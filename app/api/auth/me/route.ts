import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/app/lib/auth';

export async function GET(request: Request) {
  const authUser = getUserFromRequest(request);
  if (!authUser) return unauthorizedResponse();

  try {
    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: {
        id: true,
        email: true,
        credits: true,
        role: true,
        wechatOpenId: true
      }
    });

    if (!user) return unauthorizedResponse();

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}
