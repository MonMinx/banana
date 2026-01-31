import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const APP_ID = process.env.WECHAT_APP_ID || 'mock_app_id';
  const REDIRECT_URI = encodeURIComponent(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/auth/wechat/callback`);

  // Construct WeChat OAuth URL
  // Scope: snsapi_login (PC) or snsapi_userinfo (Mobile)
  const wechatUrl = `https://open.weixin.qq.com/connect/qrconnect?appid=${APP_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect`;

  // For this demo environment, we can't actually hit WeChat.
  // We will redirect to a mock page that simulates the callback.
  if (process.env.NODE_ENV !== 'production') {
      return NextResponse.redirect(new URL(`/api/auth/wechat/mock_login`, request.url));
  }

  return NextResponse.redirect(wechatUrl);
}
