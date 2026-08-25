// ============================================================================
// API Route: Users & Roles Endpoint (src/app/api/users/route.js)
// ============================================================================

import { NextResponse } from 'next/server';
import { MOCK_DATABASE } from '../../../data/mockData';

// GET: Return all users and their roles
export async function GET() {
  try {
    const usersWithRoles = MOCK_DATABASE.users.map((user) => {
      const relation = MOCK_DATABASE.user_roles.find((ur) => ur.user_id === user.id);
      const roleObj = MOCK_DATABASE.roles.find((r) => r.id === (relation ? relation.id_role : 1));
      
      return {
        ...user,
        role: roleObj ? roleObj.name : 'ROLE_USER',
      };
    });

    return NextResponse.json({ success: true, data: usersWithRoles }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch users' }, { status: 500 });
  }
}

// PUT: Admin updates user role
export async function PUT(request) {
  try {
    const { userId, newRoleId } = await request.json();

    const relationIndex = MOCK_DATABASE.user_roles.findIndex((ur) => ur.user_id === userId);
    
    if (relationIndex === -1) {
      return NextResponse.json({ success: false, message: 'User role relation not found' }, { status: 404 });
    }

    MOCK_DATABASE.user_roles[relationIndex].id_role = newRoleId;

    return NextResponse.json({
      success: true,
      message: 'Role updated successfully',
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update role' }, { status: 500 });
  }
}