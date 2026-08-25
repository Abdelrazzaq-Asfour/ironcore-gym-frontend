// ============================================================================
// Page: Enterprise Unified Authentication Portal (src/app/(auth)/login/page.jsx)
// Architecture: Zero-Trust Client Layer supporting dynamic Mock/Real switching
// ============================================================================

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '../../../services/api';
import Footer from '../../../components/layout/Footer';

export default function LoginPage() {
  const router = useRouter();
  
  // Encapsulate identity payload state securely
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Delegate authentication through the unified service layer (handles mock vs real transparently)
      const result = await authService.login(formData);

      if (!result) {
        throw new Error('Authentication gateway returned an empty payload.');
      }

      // Persist session token safely with strict key isolation
      localStorage.setItem('ironcore_user', JSON.stringify(result));

      // RBAC routing engine mapping session state to appropriate operational portal
      const userRole = result.role || '';
      if (result.username === 'admin_abdelrazzaq' || userRole === 'ROLE_ADMIN') {
        router.push('/dashboard');
      } else if (result.username === 'staff_mahmoud' || userRole === 'ROLE_STAFF') {
        router.push('/dashboardStaff');
      } else if ((result.username && result.username.startsWith('coach_')) || userRole === 'ROLE_COACH') {
        router.push('/dashboardCoach');
      } else {
        router.push('/dashboardMember');
      }

    } catch (err) {
      // Catch vector anomalies or unreachable backend states gracefully
      setError(err.message || 'Authentication sequence failed. Verify network or credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col justify-between text-slate-100 selection:bg-red-600 selection:text-white">
      
      {/* Top Identity Anchor */}
      <div className="p-6">
        <Link href="/" className="text-xl font-black tracking-wider text-red-500 uppercase">
          IronCore<span className="text-slate-100">Gym</span>
        </Link>
      </div>

      {/* Core Credential Evaluation Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-black tracking-wider text-white uppercase">Secure Sign-In</h1>
          <p className="text-slate-400 text-sm mt-2">Enter credentials to authorize session</p>
        </div>

        <div className="w-full max-w-md bg-slate-900/80 border border-slate-800/80 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Username or Email
              </label>
              <input 
                type="text"
                name="identifier"
                required
                value={formData.identifier}
                onChange={handleInputChange}
                placeholder="e.g. mohammed, coach_mahmoud, admin_abdelrazzaq"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-red-600 transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Password
              </label>
              <input 
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-red-600 transition-colors text-sm"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-red-600/20 transition-all text-sm disabled:opacity-50"
            >
              {loading ? 'Evaluating Protocol...' : 'Authorize Access'}
            </button>
          </form>

          {/* Quick Access Credentials Hint Box */}
          <div className="mt-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-1">
            <p className="font-bold text-slate-300 mb-1">Quick Login Hints (Password: <span className="text-red-400 font-mono">123456</span>):</p>
            <p>• Member / User: <span className="text-slate-200 font-mono">mohammed</span></p>
            <p>• Coach Account: <span className="text-slate-200 font-mono">coach_mahmoud</span></p>
            <p>• Administrator: <span className="text-slate-200 font-mono">admin_abdelrazzaq</span></p>
          </div>

          <div className="mt-6 text-center text-sm text-slate-400">
            Unregistered profile?{' '}
            <Link href="/register" className="text-red-500 hover:underline font-semibold">
              Initialize account
            </Link>
          </div>
        </div>
      </div>

      {/* Persistent Enterprise Footer */}
      <Footer />

    </main>
  );
}