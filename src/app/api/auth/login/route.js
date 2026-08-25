// ============================================================================
// API Route: Secure Proxy Login Endpoint (src/app/api/auth/login/route.js)
// ============================================================================

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Parse incoming client payload with strict input boundary check
    const body = await request.json();
    const { identifier, password } = body;

    // Validate request integrity
    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: 'Identifier and password are required.' },
        { status: 400 }
      );
    }

    // Forward authentication request securely to the production Spring Boot backend
    const backendResponse = await fetch('http://localhost:8080/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier, password }),
    });

    const result = await backendResponse.json();

    if (!backendResponse.ok) {
      // Propagate exact failure message from backend zero-trust barrier
      return NextResponse.json(
        { success: false, message: result.message || 'Authentication failed.' },
        { status: backendResponse.status }
      );
    }

    // Return structured success response back to the client session handler
    return NextResponse.json(
      {
        success: true,
        message: 'Authentication successful',
        ...result, // Passes backend response payload directly (id, username, email, role, etc.)
      },
      { status: 200 }
    );

  } catch (error) {
    // Log unexpected failures internally and return generalized secure message
    console.error('[API Auth Proxy Error]:', error.message);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error. Please try again later.' },
      { status: 500 }
    );
  }
}