// ============================================================================
// Component: Enterprise Footer (src/components/layout/Footer.jsx)
// ============================================================================

import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-900/30 backdrop-blur-md py-6 px-8 mt-auto text-center text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <span className="text-slate-400 font-bold uppercase tracking-wider">IronCore Gym</span> &copy; {new Date().getFullYear()} — Enterprise Operations Portal. All rights reserved.
        </div>
        <div className="flex gap-6">
          <span className="hover:text-slate-300 transition-colors cursor-pointer">Security Protocol</span>
          <span className="hover:text-slate-300 transition-colors cursor-pointer">System Status: Optimal</span>
          <span className="hover:text-slate-300 transition-colors cursor-pointer">Zero-Trust V2.4</span>
        </div>
      </div>
    </footer>
  );
}