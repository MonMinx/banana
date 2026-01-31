import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/app/lib/auth';

export async function POST(request: Request) {
  try {
    const authUser = getUserFromRequest(request);
    if (!authUser) return unauthorizedResponse();

    const { orderId } = await request.json();

    if (!orderId) {
        return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    // 1. Find Transaction
    const transaction = await prisma.transaction.findUnique({
        where: { orderId }
    });

    if (!transaction) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Ensure user owns transaction
    if (transaction.userId !== authUser.id && authUser.role !== 'admin') {
        return unauthorizedResponse();
    }

    if (transaction.status === 'completed') {
        return NextResponse.json({ success: true, message: 'Already completed' });
    }

    // 2. Complete Transaction & Add Credits (Atomic)
    await prisma.$transaction([
        prisma.transaction.update({
            where: { id: transaction.id },
            data: { status: 'completed' }
        }),
        prisma.user.update({
            where: { id: transaction.userId },
            data: { credits: { increment: transaction.credits } }
        })
    ]);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Payment Verify Error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
