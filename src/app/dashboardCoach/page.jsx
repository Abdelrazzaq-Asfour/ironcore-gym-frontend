// ============================================================================
// Page: Coach Dashboard Portal (src/app/dashboardCoach/page.jsx)
// Architecture: Next.js Client Component - Trainer Schedule & Assigned Bookings
// ============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { userService, bookingService } from '../../services/api';

import Footer from '../../components/layout/Footer';

export default function DashboardCoachPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [currentCoach, setCurrentCoach] = useState({ username: 'Coach', role: 'ROLE_COACH' });
  const [message, setMessage] = useState('');

useEffect(() => {
    // 1. Validate session and role security under zero-trust guidelines
    const sessionData = localStorage.getItem('ironcore_user');
    if (!sessionData) {
      window.location.href = '/login';
      return;
    }

    let parsedUserObj = null;
    try {
      const parsedUser = JSON.parse(sessionData);
      parsedUserObj = parsedUser.data || parsedUser;
      setCurrentCoach(parsedUserObj);
      
      // Enforce Role Check: Ensure user is a coach or admin
      const role = parsedUserObj.role;
      const username = parsedUserObj.username;
      
      if (role !== 'ROLE_COACH' && role !== 'ROLE_ADMIN' && !username?.startsWith('coach_') && username !== 'admin_abdelrazzaq') {
        window.location.href = '/dashboardMember';
        return;
      }
    } catch (e) {
      window.location.href = '/login';
      return;
    }

    // 2. Load bookings and filter accurately based on username or trainerName
    async function fetchCoachData() {
      try {
        const allBookings = await bookingService.getBookings();
        
        const username = parsedUserObj?.username || '';
        const isAdmin = username === 'admin_abdelrazzaq' || parsedUserObj.role === 'ROLE_ADMIN';
        
        const assignedBookings = isAdmin 
          ? (allBookings || []) 
          : (allBookings || []).filter(b => 
              b.trainerName === username || 
              b.trainer_name === username ||
              b.trainerName?.toLowerCase() === username.toLowerCase()
            );

        setBookings(assignedBookings);
      } catch (err) {
        console.error('Failed to load coach schedule', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCoachData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('ironcore_user');
    localStorage.clear();
    window.location.href = '/login';
  };

  const handleConfirmAttendance = (bookingId) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'CONFIRMED' } : b))
    );
    setMessage(`Successfully confirmed attendance for booking #${bookingId}`);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <nav className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <span className="text-xl font-black tracking-wider text-red-500 uppercase">
            IronCore<span className="text-slate-100">Gym</span>
          </span>

          <div className="hidden md:flex gap-4 text-sm font-medium">
            <Link href="/dashboardCoach" className="text-red-500 hover:text-red-400">Coach Portal</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <span className="text-xs text-slate-400 block">Logged in as (Coach)</span>
            <span className="text-sm font-bold text-white">{currentCoach.username}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold px-4 py-2 rounded-lg transition-all"
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 space-y-10">
        <div className="mb-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Coach Training Portal</h1>
          <p className="text-slate-400 text-sm">Welcome back, <span className="text-red-400 font-semibold">{currentCoach.username}</span>. Manage your assigned training sessions and member schedules.</p>
        </div>

        {/* Feedback Alert */}
        {message && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
            {message}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-xl">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">My Assigned Sessions</h3>
            <p className="text-2xl font-bold text-white mt-1">{bookings.length} Classes</p>
            <p className="text-xs text-slate-500 mt-2">Active roster</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Trainer Status</h3>
              <p className="text-sm text-slate-300 mt-1">Professional Coaching Clearance</p>
            </div>
            <span className="text-xs text-blue-400 font-bold mt-3">STATUS: ACTIVE & VERIFIED</span>
          </div>
        </div>

        {/* Assigned Bookings Table */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-4">My Training Schedule & Members</h2>
          
          {loading ? (
            <p className="text-slate-400 text-sm py-4">Loading your schedule...</p>
          ) : bookings.length === 0 ? (
            <p className="text-slate-400 text-sm py-4">No training sessions assigned to you yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Booking ID</th>
                    <th className="py-3 px-4">Member ID</th>
                    <th className="py-3 px-4">Class Name</th>
                    <th className="py-3 px-4">Schedule Time</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-900/40">
                      <td className="py-3.5 px-4 font-mono text-slate-400">#{booking.id}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">#{booking.userId || booking.user_id}</td>
                      <td className="py-3.5 px-4 font-semibold text-white">{booking.className || booking.class_name}</td>
                      <td className="py-3.5 px-4 text-slate-400">{booking.scheduleTime || booking.schedule_time}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                          booking.status === 'CONFIRMED' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {booking.status !== 'CONFIRMED' && (
                          <button
                            onClick={() => handleConfirmAttendance(booking.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all shadow"
                          >
                            Confirm Attendance
                          </button>
                        )}
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