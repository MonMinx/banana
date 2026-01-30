import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userId, amount, credits } = await request.json();

    if (!userId || !amount || !credits) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Mock payment processing
    // 1. Create Transaction Record
    // 2. Add Credits to User

    const transaction = await prisma.$transaction(async (tx) => {
      const newTransaction = await tx.transaction.create({
        data: {
          userId: parseInt(userId),
          amount: parseFloat(amount),
          credits: parseInt(credits),
          type: 'recharge',
          status: 'completed',
          orderId: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`
        }
      });

      const updatedUser = await tx.user.update({
        where: { id: parseInt(userId) },
        data: {
          credits: {
            increment: parseInt(credits)
          }
        }
      });

      return { transaction: newTransaction, userBalance: updatedUser.credits };
    });

    return NextResponse.json({ success: true, ...transaction });

  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
