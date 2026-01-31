import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/app/lib/auth';

export async function GET(request: Request) {
  const authUser = getUserFromRequest(request);
  if (!authUser || authUser.role !== 'admin') {
    return unauthorizedResponse();
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        role: true,
        credits: true,
        wechatOpenId: true,
        createdAt: true
      }
    });

    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
    const authUser = getUserFromRequest(request);
    if (!authUser || authUser.role !== 'admin') {
      return unauthorizedResponse();
    }

    try {
        const { id, credits, role } = await request.json();

        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id) },
            data: {
                credits: credits !== undefined ? parseInt(credits) : undefined,
                role: role !== undefined ? role : undefined
            }
        });

        return NextResponse.json({ user: updatedUser });

    } catch(e) {
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}
