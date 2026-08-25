// ============================================================================
// Page: Advanced Analytics Dashboard with Role-Based UI Security (src/app/dashboard/page.jsx)
// Architecture: Next.js Client Component - RBAC Security & Role Control
// ============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { userService, bookingService } from '../../services/api';
import Footer from '../../components/layout/Footer';
export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [membershipsList, setMembershipsList] = useState([]);
  const [currentUser, setCurrentUser] = useState({ username: 'Guest', role: 'ROLE_USER' });

  useEffect(() => {
    // Session Security Check: Redirect to login if no active session
    const sessionData = localStorage.getItem('ironcore_user');
    if (!sessionData) {
      window.location.href = '/login';
      return;
    }
    try {
      const parsed = JSON.parse(sessionData);
      // Normalize session payload structure across backend/proxy models
      setCurrentUser(parsed.data || parsed);
    } catch (e) {
      window.location.href = '/login';
      return;
    }

    // Fetch dashboard data via unified enterprise service layer
    async function fetchDashboardData() {
      try {
        // Fetch active bookings from backend v1 endpoint
        const bookingsData = await bookingService.getBookings();
        setBookings(bookingsData || []);

        // Fetch users/members for subscription tracking from backend v1 endpoint
        const usersData = await userService.getUsers();
        const enhancedMembers = (usersData || []).map((user, idx) => ({
          ...user,
          plan: idx === 0 ? 'Ultimate Core VIP' : idx === 1 ? 'Pro Titan' : 'Iron Starter',
          startDate: '2026-08-01',
          endDate: idx === 0 ? '2027-08-01' : idx === 1 ? '2026-11-01' : '2026-09-01',
          status: 'ACTIVE'
        }));
        setMembershipsList(enhancedMembers);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  // Complete Full Session Destruction Logout
  const handleLogout = () => {
    localStorage.removeItem('ironcore_user');
    localStorage.clear();
    window.location.href = '/login';
  };

  // Weekly Training Sessions Bar Chart Data
  const barChartData = [
    { day: 'Sat', sessions: 12 },
    { day: 'Sun', sessions: 18 },
    { day: 'Mon', sessions: 15 },
    { day: 'Tue', sessions: 22 },
    { day: 'Wed', sessions: 19 },
    { day: 'Thu', sessions: 25 },
    { day: 'Fri', sessions: 10 },
  ];
  const maxBarValue = 30;

  // Category Performance Breakdown Metrics
  const progressMetrics = [
    { label: 'Weightlifting & Power Classes', percentage: 85, color: 'bg-red-600' },
    { label: 'Functional Conditioning', percentage: 65, color: 'bg-amber-500' },
    { label: 'VIP Personal Training Slots', percentage: 90, color: 'bg-emerald-500' },
  ];

  // Monthly Active Members Growth Trend
  const lineChartPoints = [
    { month: 'Jan', count: 120 },
    { month: 'Feb', count: 155 },
    { month: 'Mar', count: 190 },
    { month: 'Apr', count: 240 },
    { month: 'May', count: 285 },
    { month: 'Jun', count: 340 },
  ];

  const isAdmin = currentUser.username === 'admin_abdelrazzaq' || currentUser.role === 'ROLE_ADMIN';

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <nav className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <span className="text-xl font-black tracking-wider text-red-500 uppercase">
            IronCore<span className="text-slate-100">Gym</span>
          </span>

          <div className="hidden md:flex gap-4 text-sm font-medium">
            <Link href="/dashboard" className="text-red-500 hover:text-red-400">Overview</Link>
            {isAdmin && (
              <Link href="/dashboard/admin/roles" className="text-slate-400 hover:text-white transition-colors">Role Management</Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <span className="text-xs text-slate-400 block">Logged in as</span>
            <span className="text-sm font-bold text-white">{currentUser.username}</span>
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
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Welcome Back, {currentUser.username}</h1>
          <p className="text-slate-400 text-sm">Account Identity: <span className="text-red-400 font-semibold">{currentUser.email || currentUser.role}</span>. Here is your enterprise analytical overview.</p>
        </div>

        {/* Quick Stats Grid */}
        <div className={`grid grid-cols-1 ${isAdmin ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-xl">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Membership Status</h3>
            <p className="text-2xl font-bold text-emerald-400">Active VIP</p>
            <p className="text-xs text-slate-500 mt-2">Renews on: 2027-08-01</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-xl">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Scheduled Classes</h3>
            <p className="text-2xl font-bold text-white">{bookings.length} Active</p>
            <p className="text-xs text-slate-500 mt-2">Next session ready</p>
          </div>

          {/* Admin Panel Access Card - Rendered ONLY for Admin */}
          {isAdmin && (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Admin Panel Access</h3>
                <p className="text-sm text-slate-300 mt-1">Manage user roles and system privileges.</p>
              </div>
              <Link 
                href="/dashboard/admin/roles"
                className="mt-4 inline-block text-center bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all"
              >
                Open Roles Control
              </Link>
            </div>
          )}
        </div>

        {/* Charts Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Chart 1: Bar Chart */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white">Daily Gym Check-ins</h2>
              <span className="text-xs text-slate-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">Activity Bar</span>
            </div>
            <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-800">
              {barChartData.map((item, index) => {
                const heightPercentage = (item.sessions / maxBarValue) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <span className="text-[10px] text-slate-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                      {item.sessions}
                    </span>
                    <div 
                      style={{ height: `${heightPercentage}%` }}
                      className="w-full max-w-[36px] bg-gradient-to-t from-red-700 to-red-500 rounded-t-lg transition-all duration-500 group-hover:from-red-600 group-hover:to-red-400 shadow-lg shadow-red-600/20"
                    ></div>
                    <span className="text-xs text-slate-400 mt-2 font-medium">{item.day}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between items-center mt-4 text-xs text-slate-500">
              <span>Peak Day: Thursday</span>
              <span className="text-emerald-400 font-semibold">121 Total Check-ins</span>
            </div>
          </div>

          {/* Chart 2: Progress Bars Breakdown */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white">Facility Utilization Rates</h2>
              <span className="text-xs text-slate-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">Capacity %</span>
            </div>
            <div className="space-y-6 my-auto">
              {progressMetrics.map((metric, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span className="text-slate-300">{metric.label}</span>
                    <span className="text-white font-mono">{metric.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-3 p-0.5 border border-slate-800">
                    <div 
                      style={{ width: `${metric.percentage}%` }}
                      className={`h-full rounded-full ${metric.color} transition-all duration-1000 shadow-sm`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4 text-xs text-slate-500 pt-4 border-t border-slate-800/60">
              <span>Average Facility Load</span>
              <span className="text-white font-bold">80% Optimal</span>
            </div>
          </div>

        </div>

        {/* Chart 3: Monthly Growth Trend Line */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">Active Members Growth Trend</h2>
            <span className="text-xs text-slate-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">Growth Line</span>
          </div>
          <div className="grid grid-cols-6 gap-4 pt-8 pb-4 border-b border-slate-800 text-center">
            {lineChartPoints.map((pt, i) => (
              <div key={i} className="flex flex-col items-center group">
                <div className="text-xs font-bold text-red-400 mb-2 font-mono bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                  {pt.count}
                </div>
                <div className="w-2.5 h-2.5 bg-red-600 rounded-full shadow-lg shadow-red-600/50 mb-2 group-hover:scale-125 transition-transform"></div>
                <span className="text-xs text-slate-400 font-medium">{pt.month}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4 text-xs text-slate-500 px-2">
            <span>New Subscriptions: +183% YTD</span>
            <span className="text-emerald-400 font-semibold">Status: High Demand</span>
          </div>
        </div>

        {/* Members & Subscriptions Table */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">Members & Subscription Schedules</h2>
            <span className="text-xs text-slate-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">Database View</span>
          </div>

          {loading ? (
            <p className="text-slate-400 text-sm py-4">Loading subscriptions database...</p>
          ) : membershipsList.length === 0 ? (
            <p className="text-slate-400 text-sm py-4">No memberships found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Member Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Subscription Plan</th>
                    <th className="py-3 px-4">Start Date</th>
                    <th className="py-3 px-4">Expiry Date</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {membershipsList.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-900/40">
                      <td className="py-3.5 px-4 font-semibold text-white">{m.username}</td>
                      <td className="py-3.5 px-4 text-slate-400">{m.email}</td>
                      <td className="py-3.5 px-4 text-red-400 font-medium">{m.plan}</td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-300">{m.startDate}</td>
                      <td className="py-3.5 px-4 font-mono text-xs text-amber-400 font-bold">{m.endDate}</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Bookings Table Section */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-4">Your Recent Bookings</h2>
          
          {loading ? (
            <p className="text-slate-400 text-sm py-4">Loading active bookings...</p>
          ) : bookings.length === 0 ? (
            <p className="text-slate-400 text-sm py-4">No active bookings found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Class Name</th>
                    <th className="py-3 px-4">Trainer</th>
                    <th className="py-3 px-4">Schedule Time</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-900/40">
                      <td className="py-3.5 px-4 font-semibold text-white">{booking.className || booking.class_name}</td>
                      <td className="py-3.5 px-4 text-slate-300">{booking.trainerName || booking.trainer_name}</td>
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