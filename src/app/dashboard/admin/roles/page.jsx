// ============================================================================
// Page: Admin Role Management with Coach Role Support (src/app/dashboard/admin/roles/page.jsx)
// Architecture: Next.js Client Component - RBAC Security & Role Control
// ============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { userService, bookingService } from '../../../../services/api'; //   
import Footer from '../../../../components/layout/Footer';

export default function AdminRolesPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [authorized, setAuthorized] = useState(false);

  // Security Check: Enforce Role-Based Access Control (RBAC) on mount
  useEffect(() => {
    const sessionData = localStorage.getItem('ironcore_user');
    if (!sessionData) {
      window.location.href = '/login';
      return;
    }

    try {
      const parsedUser = JSON.parse(sessionData);
      // Zero-trust client boundary check for admin identity
      const role = parsedUser.role || parsedUser.data?.role;
      const username = parsedUser.username || parsedUser.data?.username;
      
      if (role !== 'ROLE_ADMIN' && username !== 'admin_abdelrazzaq') {
        window.location.href = '/dashboard';
        return;
      }
      setAuthorized(true);
      fetchUsers();
    } catch (e) {
      window.location.href = '/login';
    }
  }, []);

  // Fetch users via unified service layer pointing directly to backend v1 endpoints
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers();
      setUsers(data || []);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching users.');
    } finally {
      setLoading(false);
    }
  };

  // Handle dynamic role propagation via centralized userService
  const handleRoleChange = async (userId, newRoleId) => {
    setMessage('');
    setError('');

    try {
      await userService.updateRole(userId, Number(newRoleId));
      setMessage('User role updated successfully!');
      fetchUsers();
    } catch (err) {
      setError(err.message || 'Failed to update role');
    }
  };

  if (!authorized) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
        Verifying security clearance...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <nav className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <span className="text-xl font-black tracking-wider text-red-500 uppercase">
            IronCore<span className="text-slate-100">Gym</span>
          </span>

          <div className="hidden md:flex gap-4 text-sm font-medium">
            <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">Overview</Link>
            <Link href="/dashboard/admin/roles" className="text-red-500 hover:text-red-400">Role Management</Link>
          </div>
        </div>

        <button 
          onClick={() => router.push('/dashboard')}
          className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold px-4 py-2 rounded-lg transition-all"
        >
          Back to Dashboard
        </button>
      </nav>

      {/* Main Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Admin Role Control</h1>
          <p className="text-slate-400 text-sm">Dynamically manage user permissions, assign staff, coaches, or administrator privileges instantly.</p>
        </div>

        {message && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-4">System Users & Access Levels</h2>

          {loading ? (
            <p className="text-slate-400 text-sm py-4">Loading users database...</p>
          ) : users.length === 0 ? (
            <p className="text-slate-400 text-sm py-4">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Username</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Current Role</th>
                    <th className="py-3 px-4">Action: Change Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-900/40">
                      <td className="py-3.5 px-4 font-mono text-slate-400">#{u.id}</td>
                      <td className="py-3.5 px-4 font-semibold text-white">{u.username}</td>
                      <td className="py-3.5 px-4 text-slate-400">{u.email}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                          u.role === 'ROLE_ADMIN' 
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                            : u.role === 'ROLE_STAFF'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : u.role === 'ROLE_COACH'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <select 
                          value={u.role === 'ROLE_ADMIN' ? 3 : u.role === 'ROLE_STAFF' ? 2 : u.role === 'ROLE_COACH' ? 4 : 1}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-red-600 transition-colors"
                        >
                          <option value={1}>ROLE_USER (Member)</option>
                          <option value={2}>ROLE_STAFF (Staff)</option>
                          <option value={4}>ROLE_COACH (Trainer)</option>
                          <option value={3}>ROLE_ADMIN (Administrator)</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

         <Footer />
         
    </main>
  );
}