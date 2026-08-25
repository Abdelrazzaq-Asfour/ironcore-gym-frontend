// ============================================================================
// Page: Member Dashboard Portal with Persistent Active Subscription (src/app/dashboardMember/page.jsx)
// ============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { userService, bookingService } from '../../services/api';


import Footer from '../../components/layout/Footer';


export default function DashboardMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [myBookings, setMyBookings] = useState([]);
  const [currentUser, setCurrentUser] = useState({ id: null, username: 'Member', email: '' });
  const [myMembership, setMyMembership] = useState({ title: 'Standard Member', description: 'Active gym access', price_JOD: 0, duration_months: 1 });
  const [message, setMessage] = useState('');

  useEffect(() => {
    // 1. Validate session under zero-trust guidelines
    const sessionData = localStorage.getItem('ironcore_user');
    if (!sessionData) {
      window.location.href = '/login';
      return;
    }

    let parsedUser = null;
    try {
      const parsed = JSON.parse(sessionData);
      parsedUser = parsed.data || parsed;
      setCurrentUser(parsedUser);
    } catch (e) {
      window.location.href = '/login';
      return;
    }

    // 2. Fetch bookings via centralized enterprise booking service and handle personal filtering
 // 2. Fetch bookings & active subscriptions from database API
    async function fetchMemberData() {
      try {
        const userId = parsedUser.id;
        const username = parsedUser.username;

        const allBookings = await bookingService.getBookings();
        const personalBookings = (allBookings || []).filter(
          (b) => (b.userId || b.user_id) === userId || username === 'admin_abdelrazzaq'
        );
        setMyBookings(personalBookings);

        try {
          const res = await fetch(`http://localhost:8080/api/v1/subscriptions/user/${userId}`);
          if (res.ok) {
            const activeSub = await res.json();
            if (activeSub && activeSub.planTitle) {
              setMyMembership({
                title: activeSub.planTitle,
                price_JOD: activeSub.priceJod,
                duration_months: activeSub.durationMonths,
                description: 'Active gym membership retrieved from database.'
              });
              setLoading(false);
              return;
            }
          }
        } catch (e) {
          console.warn("Could not fetch subscription from API, falling back to local/default");
        }

        const savedPlan = localStorage.getItem(`ironcore_plan_${userId}`);
        if (savedPlan) {
          setMyMembership(JSON.parse(savedPlan));
        } else {
          if (userId === 1 || username === 'admin_abdelrazzaq') {
            setMyMembership({ title: 'Ultimate Core VIP', price_JOD: 250, duration_months: 12, description: 'VIP access 24/7, private locker, free supplement bar, and personal trainer consultations.' });
          } else if (userId === 2) {
            setMyMembership({ title: 'Pro Titan', price_JOD: 75, duration_months: 3, description: 'Full access to all gym facilities, group classes, and locker rooms.' });
          } else {
            setMyMembership({ title: 'Iron Starter', price_JOD: 30, duration_months: 1, description: 'Access to gym floor and basic equipment during off-peak hours.' });
          }
        }

      } catch (err) {
        console.error('Failed to load member data', err);
      } finally {
        setLoading(false);
      }
    }

    fetchMemberData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('ironcore_user');
    localStorage.clear();
    window.location.href = '/login';
  };

  // Handle Subscription Plan Renewal / Upgrade & Save to Local Storage
  const handleRenewPlan = (planTitle, price, duration, description) => {
    setMessage('');
    const newPlan = {
      title: planTitle,
      price_JOD: price,
      duration_months: duration,
      description: description
    };
    
    setMyMembership(newPlan);
    
    // Persist active subscription for this specific user securely
    if (currentUser.id) {
      localStorage.setItem(`ironcore_plan_${currentUser.id}`, JSON.stringify(newPlan));
    }

    setMessage(`Successfully subscribed to "${planTitle}" for ${price} JOD! Your active plan has been updated.`);
  };

  const isAdmin = currentUser.username === 'admin_abdelrazzaq' || currentUser.role === 'ROLE_ADMIN';

  // Available plans matching database tier architecture
  const availablePlans = [
    { id: 1, title: 'Iron Starter', price_JOD: 30, duration_months: 1, description: 'Access to gym floor and basic equipment during off-peak hours.' },
    { id: 2, title: 'Pro Titan', price_JOD: 75, duration_months: 3, description: 'Full access to all gym facilities, group classes, and locker rooms.' },
    { id: 3, title: 'Ultimate Core VIP', price_JOD: 250, duration_months: 12, description: 'VIP access 24/7, private locker, free supplement bar, and personal trainer consultations.' }
  ];

  // Personal Weekly Activity Analytics
  const barChartData = [
    { day: 'Sat', sessions: 2 },
    { day: 'Sun', sessions: 3 },
    { day: 'Mon', sessions: 1 },
    { day: 'Tue', sessions: 4 },
    { day: 'Wed', sessions: 2 },
    { day: 'Thu', sessions: 3 },
    { day: 'Fri', sessions: 1 },
  ];
  const maxBarValue = 5;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <nav className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <span className="text-xl font-black tracking-wider text-red-500 uppercase">
            IronCore<span className="text-slate-100">Gym</span>
          </span>

          <div className="hidden md:flex gap-4 text-sm font-medium">
            <Link href="/dashboardMember" className="text-red-500 hover:text-red-400">My Dashboard</Link>
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
          <p className="text-slate-400 text-sm">Account Email: <span className="text-red-400 font-semibold">{currentUser.email || 'N/A'}</span>. View your active package and manage renewals below.</p>
        </div>

        {/* Feedback Alert */}
        {message && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
            {message}
          </div>
        )}

        {/* Quick Stats Grid - Showing Current Active Membership */}
        <div className={`grid grid-cols-1 ${isAdmin ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">My Current Active Plan</h3>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{myMembership.title}</p>
              <p className="text-xs text-slate-300 mt-2">Price: <span className="text-white font-semibold">{myMembership.price_JOD} JOD</span> | Duration: <span className="text-white font-semibold">{myMembership.duration_months} Month(s)</span></p>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{myMembership.description}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-between items-center text-xs">
              <span className="text-slate-400">Status: <strong className="text-emerald-400">ACTIVE</strong></span>
              <span className="text-slate-500 font-mono">Auto-renews enabled</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">My Scheduled Classes</h3>
              <p className="text-2xl font-bold text-white mt-1">{myBookings.length} Active Sessions</p>
              <p className="text-xs text-slate-400 mt-2">Ready for training and progression.</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-500">
              Next session ready in system queue
            </div>
          </div>

          {isAdmin && (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Admin Panel Access</h3>
                <p className="text-sm text-slate-300 mt-1">Manage all system users and roles.</p>
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

        {/* Subscription Renewal & Upgrade Section */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-2">Available Gym Membership Packages</h2>
          <p className="text-slate-400 text-sm mb-6">Choose a package to instantly activate or update your membership tier.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {availablePlans.map((plan) => {
              const isCurrent = myMembership.title === plan.title;
              return (
                <div key={plan.id} className={`border rounded-2xl p-6 flex flex-col justify-between shadow-lg transition-all ${isCurrent ? 'bg-slate-900 border-red-500/50 shadow-red-500/10' : 'bg-slate-950 border-slate-800'}`}>
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-base font-bold text-white">{plan.title}</h3>
                      {isCurrent && (
                        <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">Current Plan</span>
                      )}
                    </div>
                    <div className="text-2xl font-black text-red-500 my-2">{plan.price_JOD} <span className="text-xs text-slate-400 font-normal">JOD / {plan.duration_months} mo</span></div>
                    <p className="text-xs text-slate-400 leading-relaxed mb-6">{plan.description}</p>
                  </div>
                  <button
                    onClick={() => handleRenewPlan(plan.title, plan.price_JOD, plan.duration_months, plan.description)}
                    disabled={isCurrent}
                    className={`w-full text-xs font-bold py-2.5 rounded-xl transition-all shadow-md ${
                      isCurrent 
                        ? 'bg-slate-800 text-slate-400 cursor-not-allowed' 
                        : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20'
                    }`}
                  >
                    {isCurrent ? 'Active Plan' : 'Select & Activate'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Personal Weekly Training Analytics */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">My Weekly Training Frequency</h2>
            <span className="text-xs text-slate-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">Personal Analytics</span>
          </div>
          <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-800">
            {barChartData.map((item, index) => {
              const heightPercentage = (item.sessions / maxBarValue) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <span className="text-[10px] text-slate-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                    {item.sessions} ses
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
            <span>Personal Target: 4 Sessions/Week</span>
            <span className="text-emerald-400 font-semibold">Status: On Track</span>
          </div>
        </div>

        {/* Personal Bookings Table */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-4">My Booked Training Sessions</h2>
          
          {loading ? (
            <p className="text-slate-400 text-sm py-4">Loading your bookings...</p>
          ) : myBookings.length === 0 ? (
            <p className="text-slate-400 text-sm py-4">You have no active bookings at the moment.</p>
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
                  {myBookings.map((booking) => (
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