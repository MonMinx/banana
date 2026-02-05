import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    // This is a dev-only route to simulate scanning the QR code
    return new NextResponse(`
      <html>
        <body style="background:#333; color:white; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; font-family:sans-serif;">
          <h1>WeChat Mock Login</h1>
          <p>Click below to simulate a successful WeChat callback.</p>
          <a href="/api/auth/wechat/callback?code=mock_code_12345" style="padding:10px 20px; background:green; color:white; text-decoration:none; border-radius:5px;">
            Simulate Scan & Login
          </a>
        </body>
      </html>
    `, { headers: { 'Content-Type': 'text/html' } });
}
