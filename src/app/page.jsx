// ============================================================================
// Page: Landing Page with Real Gym Content (src/app/page.jsx)
// Architecture: Next.js App Router - High Performance Server/Client Hybrid
// ============================================================================

import React from 'react';
import Link from 'next/navigation';
import Footer from '../components/layout/Footer';

// Production-grade landing page component focusing strictly on real physical gym operations,
// heavy-duty bodybuilding environment, and authentic training standards.
export default function LandingPage() {
  // Developer note: Clean layout, removing meta-system phrasing and focusing entirely 
  // on raw gym atmosphere, calibrated weights, and bodybuilding culture.

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-red-600 selection:text-white flex flex-col justify-between">
      
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/60 px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-black tracking-wider text-red-500 uppercase">
          IronCore<span className="text-slate-100">Gym</span>
        </div>
        <div className="flex gap-4 items-center">
          <a 
            href="/login" 
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-2"
          >
            Sign In
          </a>
          <a 
            href="/register" 
            className="text-sm font-semibold bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-lg shadow-red-600/20 transition-all"
          >
            Join Now
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-24 md:py-32 flex flex-col items-center text-center max-w-5xl mx-auto">
        <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-10 pointer-events-none">
          {/* Industrial lighting glow simulator */}
          <div className="w-[500px] h-[500px] bg-red-600 rounded-full blur-[140px]"></div>
        </div>

        {/* <span className="inline-block py-1 px-3 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold tracking-wider uppercase mb-6">
          Forge Your Physique • Absolute Heavy-Duty Training
        </span> */}

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          Welcome to <span className="text-red-600">IronCore Gym</span> <br />
          Built for Serious Bodybuilding and Raw Strength
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-10">
          Step into a hardcore training environment equipped with heavy-duty power racks, calibrated steel plates, specialized isolation machines, and an uncompromising atmosphere dedicated to muscle hypertrophy and physical mastery.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <a 
            href="/register" 
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-red-600/30 transition-all text-center"
          >
            Start Your Membership
          </a>
          <a 
            href="/login" 
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold px-8 py-4 rounded-xl transition-all text-center"
          >
            Member Portal
          </a>
        </div>
      </section>

      {/* Core Real Gym Features Grid */}
      <section className="px-6 py-16 border-t border-slate-900 bg-slate-900/40">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80">
            <h3 className="text-xl font-bold text-white mb-2">Heavy-Duty Iron & Plates</h3>
            <p className="text-slate-400 text-sm">
              Equipped with heavy-gauge steel barbells, calibrated iron plates, deadlift platforms, and multi-grip racks designed for maximum compound loading and progressive overload.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80">
            <h3 className="text-xl font-bold text-white mb-2">Bodybuilding & Hypertrophy Focus</h3>
            <p className="text-slate-400 text-sm">
              Extensive selection of pin-loaded and plate-loaded machines optimized for strict muscle isolation, constant tension mechanics, and complete back and leg development.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80">
            <h3 className="text-xl font-bold text-white mb-2">Expert Coaching & Training Splits</h3>
            <p className="text-slate-400 text-sm">
              Professional trainers specialized in bodybuilding splits, nutrition guidance, and movement mechanics to push your limits safely and build dense muscle mass.
            </p>
          </div>
        </div>
      </section>

      {/* Persistent Footer Component */}
      <Footer />

    </main>
  );
}