import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

const API_HOST = 'https://grsaiapi.com';

export async function POST(request: Request) {
  const API_KEY = process.env.NANO_API_KEY;
  try {
    const { userId, prompt, imageBase64 } = await request.json();

    if (!userId || !prompt) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Check User Credits
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });

    if (!user || user.credits < 1) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 403 });
    }

    const payload: any = {
      prompt: prompt,
      model: "nano-banana"
    };

    if (imageBase64) {
      payload.image = imageBase64;
    }

    // 2. Call API (Expect Stream)
    const response = await fetch(`${API_HOST}/v1/draw/nano-banana`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
       const txt = await response.text();
       console.error("API Error", txt);
       return NextResponse.json({ error: 'API Error' }, { status: 500 });
    }

    if (!response.body) {
        return NextResponse.json({ error: 'No response body' }, { status: 500 });
    }

    // 3. Read Stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let finalUrl = null;
    let externalId = 'unknown';
    let status = 'failed';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const jsonStr = line.substring(6).trim();
            if (!jsonStr) continue;
            const data = JSON.parse(jsonStr);

            if (data.id) externalId = data.id;

            if (data.status === 'succeeded' && data.results && data.results.length > 0) {
              finalUrl = data.results[0].url;
              status = 'completed';
            } else if (data.status === 'failed') {
               status = 'failed';
            }
          } catch (e) {
            console.error('JSON Parse error', e);
          }
        }
      }

      if (status === 'completed' || status === 'failed') break;
    }

    if (status === 'completed' && finalUrl) {
        // 4. Save to DB & Deduct
        await prisma.$transaction([
          prisma.user.update({
            where: { id: parseInt(userId) },
            data: { credits: { decrement: 1 } }
          }),
          prisma.generation.create({
            data: {
              userId: parseInt(userId),
              prompt: prompt,
              status: 'completed',
              cost: 1,
              imageUrl: finalUrl
            }
          })
        ]);

        return NextResponse.json({ success: true, imageUrl: finalUrl, taskId: externalId });
    } else {
        return NextResponse.json({ error: 'Generation failed or timed out', status });
    }

  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
