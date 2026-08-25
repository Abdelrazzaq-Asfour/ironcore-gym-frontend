// ============================================================================
// Mock Database & Seed Data (src/data/mockData.js)
// Architecture: Enterprise Mock Data mirroring ironcore_db SQL Schema
// ============================================================================

export const mockDatabase = {
  // --------------------------------------------------------------------------
  // 1. ROLES TABLE
  // --------------------------------------------------------------------------
  roles: [
    { id: 1, name: 'ROLE_USER', description: 'Standard gym member account created via public registration' },
    { id: 2, name: 'ROLE_STAFF', description: 'Assigned gym staff or supervisor with restricted operational privileges' },
    { id: 3, name: 'ROLE_ADMIN', description: 'Full system administrator capable of modifying user roles and permissions' },
    { id: 4, name: 'ROLE_COACH', description: 'Gym personal trainer managing specific classes and training schedules' }
  ],

  // --------------------------------------------------------------------------
  // 2. USERS TABLE
  // --------------------------------------------------------------------------
  users: [
    {
      id: 1,
      username: 'admin_abdelrazzaq',
      email: 'abdelrazzaq@ironcore.com',
      phoneNumber: '+962791112233',
      passwordHash: '$2b$10$X7vQ4z4/vKx0u0u0u0u0ue8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8',
      isActive: true,
      isLocked: false,
      failedLoginAttempts: 0,
      lastLoginAt: '2026-08-22 09:30:00',
      createdAt: '2026-08-01 10:00:00',
      updatedAt: '2026-08-01 10:00:00',
      roles: [{ id: 3, name: 'ROLE_ADMIN', description: 'Full system administrator capable of modifying user roles and permissions' }]
    },
    {
      id: 2,
      username: 'staff_mahmoud',
      email: 'mahmoud.staff@ironcore.com',
      phoneNumber: '+962792223344',
      passwordHash: '$2b$10$X7vQ4z4/vKx0u0u0u0u0ue8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8',
      isActive: true,
      isLocked: false,
      failedLoginAttempts: 0,
      lastLoginAt: '2026-08-21 14:15:00',
      createdAt: '2026-08-05 11:00:00',
      updatedAt: '2026-08-05 11:00:00',
      roles: [{ id: 2, name: 'ROLE_STAFF', description: 'Assigned gym staff or supervisor with restricted operational privileges' }]
    },
    {
      id: 3,
      username: 'mohammed',
      email: 'rami.gym@gmail.com',
      phoneNumber: '+962793334455',
      passwordHash: '$2b$10$X7vQ4z4/vKx0u0u0u0u0ue8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8',
      isActive: true,
      isLocked: false,
      failedLoginAttempts: 0,
      lastLoginAt: '2026-08-20 18:45:00',
      createdAt: '2026-08-10 16:20:00',
      updatedAt: '2026-08-10 16:20:00',
      roles: [{ id: 1, name: 'ROLE_USER', description: 'Standard gym member account created via public registration' }]
    },
    {
      id: 4,
      username: 'member_sara',
      email: 'sara.fit@yahoo.com',
      phoneNumber: '+962794445566',
      passwordHash: '$2b$10$X7vQ4z4/vKx0u0u0u0u0ue8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8',
      isActive: true,
      isLocked: false,
      failedLoginAttempts: 0,
      lastLoginAt: null,
      createdAt: '2026-08-22 20:00:00',
      updatedAt: '2026-08-22 20:00:00',
      roles: [{ id: 1, name: 'ROLE_USER', description: 'Standard gym member account created via public registration' }]
    },
    {
      id: 5,
      username: 'coach_mahmoud',
      email: 'mahmoud.coach@ironcore.com',
      phoneNumber: '+962795556677',
      passwordHash: '$2b$10$X7vQ4z4/vKx0u0u0u0u0ue8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8',
      isActive: true,
      isLocked: false,
      failedLoginAttempts: 0,
      lastLoginAt: null,
      createdAt: '2026-08-22 10:00:00',
      updatedAt: '2026-08-22 10:00:00',
      roles: [{ id: 4, name: 'ROLE_COACH', description: 'Gym personal trainer managing specific classes and training schedules' }]
    },
    {
      id: 6,
      username: 'coach_rami',
      email: 'rami.coach@ironcore.com',
      phoneNumber: '+962796667788',
      passwordHash: '$2b$10$X7vQ4z4/vKx0u0u0u0u0ue8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8',
      isActive: true,
      isLocked: false,
      failedLoginAttempts: 0,
      lastLoginAt: null,
      createdAt: '2026-08-22 10:00:00',
      updatedAt: '2026-08-22 10:00:00',
      roles: [{ id: 4, name: 'ROLE_COACH', description: 'Gym personal trainer managing specific classes and training schedules' }]
    },
    {
      id: 7,
      username: 'coach_sara',
      email: 'sara.coach@ironcore.com',
      phoneNumber: '+962797778899',
      passwordHash: '$2b$10$X7vQ4z4/vKx0u0u0u0u0ue8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8',
      isActive: true,
      isLocked: false,
      failedLoginAttempts: 0,
      lastLoginAt: null,
      createdAt: '2026-08-22 10:00:00',
      updatedAt: '2026-08-22 10:00:00',
      roles: [{ id: 4, name: 'ROLE_COACH', description: 'Gym personal trainer managing specific classes and training schedules' }]
    }
  ],

  // --------------------------------------------------------------------------
  // 3. BOOKINGS TABLE
  // --------------------------------------------------------------------------
  bookings: [
    {
      id: 1,
      userId: 3,
      className: 'Weightlifting & Power Classes',
      trainerName: 'coach_mahmoud',
      scheduleTime: '2026-08-23 10:00:00',
      status: 'CONFIRMED',
      createdAt: '2026-08-23 02:00:00',
      updatedAt: '2026-08-23 02:00:00'
    },
    {
      id: 2,
      userId: 4,
      className: 'Functional Conditioning',
      trainerName: 'coach_rami',
      scheduleTime: '2026-08-23 12:00:00',
      status: 'CONFIRMED',
      createdAt: '2026-08-23 02:00:00',
      updatedAt: '2026-08-23 02:00:00'
    }
  ],

  // --------------------------------------------------------------------------
  // 4. SUBSCRIPTIONS TABLE
  // --------------------------------------------------------------------------
  subscriptions: [
    {
      id: 1,
      userId: 3,
      planTitle: 'Iron Starter',
      priceJod: 30.00,
      durationMonths: 1,
      status: 'ACTIVE',
      createdAt: '2026-08-10 16:20:00',
      updatedAt: '2026-08-10 16:20:00'
    }
  ],

  // --------------------------------------------------------------------------
  // 5. AUDIT LOGS TABLE
  // --------------------------------------------------------------------------
  auditLogs: [
    {
      id: 1,
      actorId: 1,
      actionType: 'UPDATE_ROLE',
      targetEntity: 'user_roles',
      targetId: 2,
      ipAddress: '127.0.0.1',
      payloadSnapshot: JSON.stringify({ user_id: 2, old_role: 1, new_role: 2 }),
      createdAt: '2026-08-05 11:05:00'
    }
  ]
};