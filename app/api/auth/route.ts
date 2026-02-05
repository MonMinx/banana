import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';
import { signToken } from '@/app/lib/auth';
import { serialize } from 'cookie';
import bcrypt from 'bcryptjs';

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
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'user',
          credits: 5, // Free credits for new users
        },
      });
    } else {
        // Password check
        if (user.password) {
             // Try comparing hash first
             const match = await bcrypt.compare(password, user.password);
             if (!match) {
                 // Fallback for legacy plain text passwords (optional migration path)
                 if (user.password === password) {
                     // Migrate to hash
                     const hashedPassword = await bcrypt.hash(password, 10);
                     await prisma.user.update({
                         where: { id: user.id },
                         data: { password: hashedPassword }
                     });
                 } else {
                     return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
                 }
             }
        } else {
            // First time setting password for legacy user
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.user.update({
                where: { id: user.id },
                data: { password: hashedPassword }
            });
        }
    }

    // Generate JWT
    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    // Set Cookie
    const cookie = serialize('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        credits: user.credits,
        role: user.role
      }
    });

    response.headers.set('Set-Cookie', cookie);

    return response;

  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
