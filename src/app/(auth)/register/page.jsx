// ============================================================================
// Page: Secure Enterprise Registration Portal (src/app/(auth)/register/page.jsx)
// Architecture: Next.js Client Component - Zero-Trust Auth & Validation Pipeline
// ============================================================================

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '../../../services/api';

export default function RegisterPage() {
  const router = useRouter();

  // Strict state management for form fields and cryptographic feedback loops
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '', // Aligned camelCase naming matrix with backend RegisterRequest DTO contract
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle input changes with real-time state normalization
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  // Client-side payload hardening & submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Client-side validation: Password strength and match verification
    if (formData.password !== formData.confirmPassword) {
      setError('Cryptographic mismatch: Passwords do not match.');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Security policy violation: Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    try {
      // Transmit payload over TLS 1.3 encrypted tunnel directly to Spring Boot backend API
      const result = await authService.register({
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        phoneNumber: formData.phoneNumber.trim(),
        password: formData.password,
      });

      setSuccess('Account provisioned successfully in persistence tier. Redirecting to authentication portal...');
      setTimeout(() => {
        router.push('/login');
      }, 1500);

    } catch (err) {
      setError(err.message || 'Registration failed due to server rejection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-6 py-12">
      {/* Brand Header */}
      <div className="mb-8 text-center">
        <Link href="/" className="text-2xl font-black tracking-wider text-red-500 uppercase">
          IronCore<span className="text-slate-100">Gym</span>
        </Link>
        <p className="text-slate-400 text-sm mt-2">Establish a secure membership credential</p>
      </div>

      {/* Registration Card */}
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800/80 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Username
            </label>
            <input 
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleInputChange}
              placeholder="e.g. member_alex"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-red-600 transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Email Address
            </label>
            <input 
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="alex@ironcore.com"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-red-600 transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Phone Number
            </label>
            <input 
              type="text"
              name="phoneNumber"
              required
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="+962790000000"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-red-600 transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
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

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Confirm Password
            </label>
            <input 
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-red-600 transition-colors text-sm"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-red-600/20 transition-all text-sm disabled:opacity-50"
          >
            {loading ? 'Provisioning Account...' : 'Register Securely'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="text-red-500 hover:underline font-semibold">
            Sign in here
          </Link>
        </div>
      </div>
   
    </main>
  );
}