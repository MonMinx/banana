import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Mock Login: In a real app, we would verify WeChat code or password
    // For this MVP, we just find or create the user based on email

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Auto-register
      user = await prisma.user.create({
        data: {
          email,
          role: 'user',
          credits: 5, // Free credits for new users
        },
      });
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
