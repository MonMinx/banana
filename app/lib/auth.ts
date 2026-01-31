import jwt from 'jsonwebtoken';
import { parse } from 'cookie';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-production';

export interface UserPayload {
  id: number;
  email: string | null;
  role: string;
}

export function signToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch (e) {
    return null;
  }
}

export function getUserFromRequest(req: Request): UserPayload | null {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const cookies = parse(cookieHeader);
    const token = cookies.auth_token;

    if (!token) return null;
    return verifyToken(token);
  } catch (e) {
    return null;
  }
}

export function unauthorizedResponse() {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
