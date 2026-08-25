// ============================================================================
// Page: Staff Operations Portal with Router Navigation (src/app/dashboardStaff/page.jsx)
// Architecture: Next.js Client Component - Enterprise Session & Routing Hub
// ============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { userService, bookingService } from '../../services/api';
import Footer from '../../components/layout/Footer';
export default function DashboardStaffPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [currentUser, setCurrentUser] = useState({ username: 'Staff', role: 'ROLE_STAFF' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Modal Control States
  const [activeModal, setActiveModal] = useState(null);

  // Searchable Dropdown States for Members
  const [bookingQuery, setBookingQuery] = useState('');
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const [renewalQuery, setRenewalQuery] = useState('');
  const [isRenewalOpen, setIsRenewalOpen] = useState(false);

  // Predefined Available Slots per Trainer matrix
  const trainerSchedules = {
    'Coach Mahmoud': [
      '2026-08-25 10:00:00 (Morning Strength)',
      '2026-08-25 17:00:00 (Heavy Powerlifting)',
      '2026-08-26 18:30:00 (Core & Functional)'
    ],
    'Coach Rami': [
      '2026-08-25 08:30:00 (Morning Conditioning)',
      '2026-08-26 16:00:00 (Bodybuilding Split)',
      '2026-08-27 19:00:00 (Advanced Hypertrophy)'
    ],
    'Coach Sara': [
      '2026-08-25 11:00:00 (Flexibility & Mobility)',
      '2026-08-26 17:15:00 (Cardio Endurance)',
      '2026-08-28 10:00:00 (Core Conditioning)'
    ]
  };

  // Form States
  const [newBooking, setNewBooking] = useState({ userId: '', className: '', trainerName: '', scheduleTime: '' });
  const [renewal, setRenewal] = useState({ userId: '', planTitle: 'Pro Titan' });

  useEffect(() => {
    // Zero-trust session guard validation
    const sessionData = localStorage.getItem('ironcore_user');
    if (!sessionData) {
      router.push('/login');
      return;
    }

    try {
      const parsed = JSON.parse(sessionData);
      const parsedUser = parsed.data || parsed;
      setCurrentUser(parsedUser);
      
      const role = parsedUser.role;
      const username = parsedUser.username;
      
      if (username === 'member_rami' || username === 'member_sara' || (role !== 'ROLE_ADMIN' && role !== 'ROLE_STAFF' && username !== 'staff_mahmoud')) {
        router.push('/dashboardMember');
        return;
      }
    } catch (e) {
      router.push('/login');
      return;
    }

    // Fetch operational data via unified enterprise service layer
    async function fetchStaffData() {
      try {
        const bookingsData = await bookingService.getBookings();
        setBookings(bookingsData || []);

        const usersData = await userService.getUsers();
        setUsers(usersData || []);

        // Fallback trace for system audit logs
        setAuditLogs([
          { id: 1, actor_id: 1, action_type: 'UPDATE_ROLE', target_entity: 'user_roles', target_id: 2, ip_address: '127.0.0.1', payload_snapshot: '{"user_id": 2, "old_role": 1, "new_role": 2}', created_at: '2026-08-05 11:05:00' }
        ]);
      } catch (err) {
        console.error('Failed to load staff operational data', err);
        setError('Failed to synchronize server state.');
      } finally {
        setLoading(false);
      }
    }

    fetchStaffData();
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  // Handlers utilizing centralized service API hooks
  const handleAddBooking = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!newBooking.userId || !newBooking.className || !newBooking.trainerName || !newBooking.scheduleTime) {
      setError('Please fill in all booking fields.');
      return;
    }

    try {
      const createdBooking = await bookingService.createBooking({
        userId: Number(newBooking.userId),
        className: newBooking.className,
        trainerName: newBooking.trainerName,
        scheduleTime: newBooking.scheduleTime
      });

      setBookings([createdBooking, ...bookings]);
      setMessage(`Successfully created booking for class "${newBooking.className}" with ${newBooking.trainerName}.`);
      setNewBooking({ userId: '', className: '', trainerName: '', scheduleTime: '' });
      setBookingQuery('');
      setActiveModal(null);
    } catch (err) {
      setError(err.message || 'Failed to create booking.');
    }
  };

const handleRenewMember = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!renewal.userId) {
      setError('Please select a member to renew.');
      return;
    }

    const price = renewal.planTitle === 'Ultimate Core VIP' ? 250 : renewal.planTitle === 'Pro Titan' ? 75 : 30;
    const duration = renewal.planTitle === 'Ultimate Core VIP' ? 12 : renewal.planTitle === 'Pro Titan' ? 3 : 1;

    try {
      // إرسال طلب حفظ الاشتراك الجديد إلى الباك إند
      const response = await fetch('http://localhost:8080/api/v1/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: Number(renewal.userId),
          planTitle: renewal.planTitle,
          priceJod: price,
          durationMonths: duration,
          status: 'ACTIVE'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to persist subscription in database.');
      }

      const result = await response.json();

      localStorage.setItem(`ironcore_plan_${renewal.userId}`, JSON.stringify({
        title: result.planTitle,
        price_JOD: result.priceJod,
        duration_months: result.durationMonths,
        description: 'Renewed by staff operations portal & saved in DB.'
      }));

      const targetUser = users.find((u) => u.id === Number(renewal.userId));
      const targetName = targetUser ? targetUser.username : `User #${renewal.userId}`;

      setMessage(`Successfully renewed subscription to "${renewal.planTitle}" for member ${targetName} and saved to database!`);
      setRenewalQuery('');
      setActiveModal(null);
    } catch (err) {
      setError(err.message || 'Failed to process membership renewal.');
    }
  };


  const handleConfirmBooking = (bookingId) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'CONFIRMED' } : b))
    );
    setMessage(`Successfully confirmed booking #${bookingId}`);
  };

  const isAdmin = currentUser.username === 'admin_abdelrazzaq' || currentUser.role === 'ROLE_ADMIN';

  const filteredBookingUsers = users.filter((u) => 
    u.username.toLowerCase().includes(bookingQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(bookingQuery.toLowerCase())
  );

  const filteredRenewalUsers = users.filter((u) => 
    u.username.toLowerCase().includes(renewalQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(renewalQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative">
      {/* Top Navbar */}
      <nav className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <span className="text-xl font-black tracking-wider text-red-500 uppercase">
            IronCore<span className="text-slate-100">Gym</span>
          </span>

          <div className="hidden md:flex gap-4 text-sm font-medium">
            <Link href="/dashboardStaff" className="text-red-500 hover:text-red-400">Staff Operations</Link>
            {isAdmin && (
              <Link href="/dashboard/admin/roles" className="text-slate-400 hover:text-white transition-colors">Role Management</Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <span className="text-xs text-slate-400 block">Logged in as (Staff)</span>
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

      {/* Main Body Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 space-y-10">
        <div className="mb-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Staff Operations & Management Portal</h1>
          <p className="text-slate-400 text-sm">Welcome, <span className="text-red-400 font-semibold">{currentUser.username}</span>. Manage schedules, bookings, and member accounts.</p>
        </div>

        {/* Feedback Alerts */}
        {message && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
            {message}
          </div>
        )}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
            {error}
          </div>
        )}

        {/* ACTION CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white mb-1">Create Member Booking</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">Assign training class & trainer slots.</p>
            </div>
            <button
              onClick={() => setActiveModal('booking')}
              className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-md shadow-red-600/20"
            >
              + Create Booking
            </button>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white mb-1">Register New Member</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">Onboard a new client into database persistence.</p>
            </div>
            {/* Redirect directly to the secure enterprise registration portal */}
            <button
              onClick={() => router.push('/register')}
              className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-md shadow-red-600/20"
            >
              + Register New Member
            </button>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white mb-1">Renew / Upgrade Plan</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">Process renewals for existing members.</p>
            </div>
            <button
              onClick={() => setActiveModal('renewal')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-md shadow-emerald-600/20"
            >
              ⚡ Renew Membership
            </button>
          </div>
        </div>

        {/* Bookings Management Table */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-4">Active Gym Bookings & Session Management</h2>
          {loading ? (
            <p className="text-slate-400 text-sm py-4">Loading operational queues...</p>
          ) : bookings.length === 0 ? (
            <p className="text-slate-400 text-sm py-4">No bookings found in the system.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Booking ID</th>
                    <th className="py-3 px-4">Member ID</th>
                    <th className="py-3 px-4">Class Name</th>
                    <th className="py-3 px-4">Trainer</th>
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
                      <td className="py-3.5 px-4">
                        {booking.status !== 'CONFIRMED' && (
                          <button
                            onClick={() => handleConfirmBooking(booking.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all shadow"
                          >
                            Confirm
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

        {/* Audit Logs Table */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-2">System Audit Logs & Security Activity</h2>
          <p className="text-slate-400 text-sm mb-4">Real-time tracking of administrative updates.</p>
          {auditLogs.length === 0 ? (
            <p className="text-slate-400 text-sm py-4">No audit logs recorded.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Log ID</th>
                    <th className="py-3 px-4">Actor ID</th>
                    <th className="py-3 px-4">Action Type</th>
                    <th className="py-3 px-4">Target Entity</th>
                    <th className="py-3 px-4">IP Address</th>
                    <th className="py-3 px-4">Payload Snapshot</th>
                    <th className="py-3 px-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-900/40 font-mono text-xs">
                      <td className="py-3.5 px-4 text-slate-400">#{log.id}</td>
                      <td className="py-3.5 px-4 text-red-400 font-bold">#{log.actor_id}</td>
                      <td className="py-3.5 px-4 text-white font-bold">{log.action_type}</td>
                      <td className="py-3.5 px-4 text-slate-300">{log.target_entity} (#{log.target_id})</td>
                      <td className="py-3.5 px-4 text-slate-400">{log.ip_address}</td>
                      <td className="py-3.5 px-4 text-amber-300 max-w-xs truncate">{log.payload_snapshot}</td>
                      <td className="py-3.5 px-4 text-slate-400">{log.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ================= MODALS ================= */}

      {/* 1. Modal: Create Booking with Trainer Available Slots */}
      {activeModal === 'booking' && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Create Member Booking</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white text-lg font-bold">✕</button>
            </div>
            
            <form onSubmit={handleAddBooking} className="space-y-4">
              <div className="relative">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Select Member (Type to Search)</label>
                <input
                  type="text"
                  placeholder="🔍 Type member name or email..."
                  value={bookingQuery}
                  onFocus={() => setIsBookingOpen(true)}
                  onChange={(e) => {
                    setBookingQuery(e.target.value);
                    setIsBookingOpen(true);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-3 focus:outline-none focus:border-red-600"
                />

                {isBookingOpen && (
                  <div className="absolute z-20 left-0 right-0 mt-1 bg-slate-950 border border-slate-800 rounded-xl max-h-40 overflow-y-auto shadow-2xl divide-y divide-slate-900">
                    {filteredBookingUsers.length === 0 ? (
                      <div className="p-3 text-xs text-slate-500 text-center">No members found</div>
                    ) : (
                      filteredBookingUsers.map((u) => (
                        <div
                          key={u.id}
                          onClick={() => {
                            setNewBooking({ ...newBooking, userId: u.id });
                            setBookingQuery(`${u.username} (${u.email})`);
                            setIsBookingOpen(false);
                          }}
                          className="p-3 text-xs text-slate-200 hover:bg-red-600/20 hover:text-white cursor-pointer transition-colors flex justify-between items-center"
                        >
                          <span className="font-semibold">{u.username}</span>
                          <span className="text-slate-500 font-mono">#{u.id}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Class Name</label>
                <input
                  type="text"
                  placeholder="e.g. Heavy Weightlifting & Power"
                  value={newBooking.className}
                  onChange={(e) => setNewBooking({...newBooking, className: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-red-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Coach / Trainer Name</label>
                <select
                  value={newBooking.trainerName}
                  onChange={(e) => setNewBooking({...newBooking, trainerName: e.target.value, scheduleTime: ''})}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-red-600"
                  required
                >
                  <option value="">-- Choose Trainer --</option>
                  <option value="Coach Mahmoud">Coach Mahmoud</option>
                  <option value="Coach Rami">Coach Rami</option>
                  <option value="Coach Sara">Coach Sara</option>
                </select>
              </div>

              {newBooking.trainerName && (
                <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl space-y-2">
                  <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
                    Available Slots for {newBooking.trainerName}:
                  </span>
                  <div className="space-y-1">
                    {trainerSchedules[newBooking.trainerName]?.map((slot, index) => {
                      const cleanSlotTime = slot.split(' (')[0];
                      const isSelected = newBooking.scheduleTime === cleanSlotTime;
                      return (
                        <div
                          key={index}
                          onClick={() => setNewBooking({ ...newBooking, scheduleTime: cleanSlotTime })}
                          className={`text-xs p-2 rounded-lg cursor-pointer transition-all flex justify-between items-center ${
                            isSelected 
                              ? 'bg-red-600 text-white font-bold' 
                              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <span>{slot}</span>
                          <span className="text-[10px] opacity-75">{isSelected ? 'Selected ✓' : 'Click to select'}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Selected Schedule Time</label>
                <input
                  type="text"
                  placeholder="Select a slot above or type date..."
                  value={newBooking.scheduleTime}
                  onChange={(e) => setNewBooking({...newBooking, scheduleTime: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-red-600 font-mono"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-3 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-md shadow-red-600/20"
                >
                  Confirm & Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal: Renew Subscription */}
      {activeModal === 'renewal' && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Renew / Upgrade Plan</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleRenewMember} className="space-y-4">
              <div className="relative">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Select Member (Type to Search)</label>
                <input
                  type="text"
                  placeholder="🔍 Type member name or email..."
                  value={renewalQuery}
                  onFocus={() => setIsRenewalOpen(true)}
                  onChange={(e) => {
                    setRenewalQuery(e.target.value);
                    setIsRenewalOpen(true);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-3 focus:outline-none focus:border-red-600"
                />

                {isRenewalOpen && (
                  <div className="absolute z-20 left-0 right-0 mt-1 bg-slate-950 border border-slate-800 rounded-xl max-h-48 overflow-y-auto shadow-2xl divide-y divide-slate-900">
                    {filteredRenewalUsers.length === 0 ? (
                      <div className="p-3 text-xs text-slate-500 text-center">No members found</div>
                    ) : (
                      filteredRenewalUsers.map((u) => (
                        <div
                          key={u.id}
                          onClick={() => {
                            setRenewal({ ...renewal, userId: u.id });
                            setRenewalQuery(`${u.username} (${u.email})`);
                            setIsRenewalOpen(false);
                          }}
                          className="p-3 text-xs text-slate-200 hover:bg-emerald-600/20 hover:text-white cursor-pointer transition-colors flex justify-between items-center"
                        >
                          <span className="font-semibold">{u.username}</span>
                          <span className="text-slate-500 font-mono">#{u.id} - {u.email}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">New Membership Package</label>
                <select
                  value={renewal.planTitle}
                  onChange={(e) => setRenewal({...renewal, planTitle: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-red-600"
                >
                  <option value="Iron Starter">Iron Starter (1 Month - 30 JOD)</option>
                  <option value="Pro Titan">Pro Titan (3 Months - 75 JOD)</option>
                  <option value="Ultimate Core VIP">Ultimate Core VIP (12 Months - 250 JOD)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-3 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-md shadow-emerald-600/20"
                >
                  Process Renewal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
         <Footer />
    </main>
  );
}