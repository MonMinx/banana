import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/app/lib/auth';

export async function GET(request: Request) {
  const authUser = getUserFromRequest(request);
  if (!authUser) return unauthorizedResponse();

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  // Authorization Check: prevent IDOR
  // User can only access their own profile, unless they are admin
  if (authUser.id !== parseInt(userId) && authUser.role !== 'admin') {
      return unauthorizedResponse();
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        email: true,
        credits: true,
        role: true,
        generations: {
          take: 10,
          orderBy: { createdAt: 'desc' }
        },
        transactions: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });

  } catch (error) {
    console.error('User fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
