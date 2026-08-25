// ============================================================================
// API Route: Secure Proxy / Mock Login Endpoint (src/app/api/auth/login/route.js)
// ============================================================================

import { NextResponse } from 'next/server';
import { mockDatabase } from '../../../../data/mockData';

export async function POST(request) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: 'Identifier and password are required.' },
        { status: 400 }
      );
    }

    // البحث عن المستخدم في قاعدة البيانات الوهمية
    const user = mockDatabase.users.find(
      (u) => u.username === identifier || u.email === identifier
    );

    if (!user || password !== '123456') {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials (Mock)' },
        { status: 401 }
      );
    }

    const primaryRole = user.roles?.[0]?.name || 'ROLE_USER';

    return NextResponse.json(
      {
        success: true,
        message: 'Authentication successful',
        id: user.id,
        username: user.username,
        email: user.email,
        role: primaryRole,
        token: 'mock-jwt-token-xyz-123',
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('[API Auth Proxy Error]:', error.message);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error. Please try again later.' },
      { status: 500 }
    );
  }
}