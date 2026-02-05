import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorizedResponse } from '@/app/lib/auth';

export async function POST(request: Request) {
  try {
    const authUser = getUserFromRequest(request);
    if (!authUser) {
      // Allow unauthenticated for the payment callback demo
      // but in real world, this would likely be a server-to-server callback verified by signature
    }

    const { userId, amount, credits } = await request.json();

    // 1. Generate Order ID (mock)
    const orderId = `wechat_pay_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // 2. Create Transaction Record
    const transaction = await prisma.transaction.create({
      data: {
        userId: parseInt(userId),
        amount: parseFloat(amount),
        credits: parseInt(credits),
        type: 'wechat_pay',
        status: 'pending', // Pending payment
        orderId: orderId
      }
    });

    // 3. Return Pay Info (Mock)
    // In reality, this returns params for WeixinJSBridge.invoke or a Code URL
    return NextResponse.json({
        success: true,
        pay_info: {
            code_url: `weixin://wxpay/bizpayurl?pr=${orderId}`, // Mock URL
            orderId: orderId,
            price: amount
        }
    });

  } catch (error) {
    console.error('Payment Error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
