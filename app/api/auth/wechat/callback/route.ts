import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';
import { signToken } from '@/app/lib/auth';
import { serialize } from 'cookie';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  try {
    // 1. Exchange code for access_token (Mocked)
    // In production: fetch(`https://api.weixin.qq.com/sns/oauth2/access_token...`)

    const mockWeChatUser = {
        openid: `mock_openid_${code}`,
        unionid: `mock_unionid_${code}`,
        nickname: 'WeChat User',
        headimgurl: ''
    };

    // 2. Find or Create User
    let user = await prisma.user.findFirst({
        where: { wechatOpenId: mockWeChatUser.openid }
    });

    if (!user) {
        // Also check if unionId exists (if multi-app)
        if (mockWeChatUser.unionid) {
            user = await prisma.user.findUnique({ where: { unionId: mockWeChatUser.unionid } });
        }
    }

    if (!user) {
        user = await prisma.user.create({
            data: {
                wechatOpenId: mockWeChatUser.openid,
                unionId: mockWeChatUser.unionid,
                credits: 10, // Bonus for WeChat login
                role: 'user'
            }
        });
    }

    // 3. Issue JWT
    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    const cookie = serialize('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    // 4. Redirect to Home
    const response = NextResponse.redirect(new URL('/', request.url));
    response.headers.set('Set-Cookie', cookie);
    return response;

  } catch (error) {
    console.error('WeChat Callback Error', error);
    return NextResponse.redirect(new URL('/login?error=wechat_failed', request.url));
  }
}
