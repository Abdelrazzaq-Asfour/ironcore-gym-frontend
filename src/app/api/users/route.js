// ============================================================================
// API Route: Users & Roles Endpoint (src/app/api/users/route.js)
// ============================================================================

import { NextResponse } from 'next/server';
import { mockDatabase } from '../../../data/mockData';

// GET: Return all users and their roles
export async function GET() {
  try {
    const usersWithRoles = mockDatabase.users.map((user) => {
      const relation = mockDatabase.user_roles?.find((ur) => ur.user_id === user.id);
      const roleObj = mockDatabase.roles.find((r) => r.id === (relation ? relation.id_role : 1));
      
      return {
        ...user,
        role: roleObj ? roleObj.name : (user.roles?.[0]?.name || 'ROLE_USER'),
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

    if (!mockDatabase.user_roles) {
      mockDatabase.user_roles = [];
    }

    const relationIndex = mockDatabase.user_roles.findIndex((ur) => ur.user_id === userId);
    
    if (relationIndex === -1) {
      // Create relation if it doesn't exist
      mockDatabase.user_roles.push({ user_id: userId, id_role: newRoleId });
    } else {
      mockDatabase.user_roles[relationIndex].id_role = newRoleId;
    }

    return NextResponse.json({
      success: true,
      message: 'Role updated successfully',
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update role' }, { status: 500 });
  }
}