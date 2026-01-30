import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Auto-register
      user = await prisma.user.create({
        data: {
          email,
          password, // Note: In a real production app, passwords must be hashed (e.g., bcrypt)
          role: 'user',
          credits: 5, // Free credits for new users
        },
      });
    } else {
        // Simple password check for demo purposes
        if (user.password && user.password !== password) {
            return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
        }

        // If legacy user without password, update it
        if (!user.password) {
             await prisma.user.update({
                 where: { id: user.id },
                 data: { password }
             });
        }
    }

    // Return simple user info (mock session)
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        credits: user.credits,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
