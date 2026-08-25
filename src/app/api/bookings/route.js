// ============================================================================
// API Route: Bookings Endpoint (src/app/api/bookings/route.js)
// ============================================================================

import { NextResponse } from 'next/server';
import { mockDatabase } from '../../../data/mockData';

export async function GET() {
  try {
    return NextResponse.json(
      { success: true, data: mockDatabase.bookings || [] },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}