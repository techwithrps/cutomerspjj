import React, { useState } from 'react';
import { 
  Building2, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle,
  KeyRound,
  CheckCircle2,
  Sparkles,
  Receipt,
  Container,
  Clock,
  TrendingUp
} from 'lucide-react';
import { CUSTOMER_ACCOUNTS } from '../data/customerData';

export default function CustomerLoginPage({ onLoginSuccess }) {
  const [customerCode, setCustomerCode] = useState('HMA');
  const [password, setPassword] = useState('hma@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const realLeaderboardAccounts = [
    { code: 'HMA', name: 'HMA AGRO INDUSTRIES LTD', pass: 'hma@123', tag: 'Rank #1', rev: '₹ 606.46 Cr' },
    { code: 'INTL', name: 'INTERNATIONAL AGRO FOODS', pass: 'intl@123', tag: 'Rank #2', rev: '₹ 582.75 Cr' },
    { code: 'RUSTAM', name: 'RUSTAM FOODS PVT. LTD.', pass: 'rustam@123', tag: 'Rank #3', rev: '₹ 531.78 Cr' },
    { code: 'ALAMMAR', name: 'AL AMMAR FROZEN FOOD', pass: 'alammar@123', tag: 'Rank #4', rev: '₹ 530.49 Cr' },
    { code: 'FAIR', name: 'FAIR EXPORTS (INDIA) PVT LTD', pass: 'fair@123', tag: 'Rank #5', rev: '₹ 527.94 Cr' },
  ];

  const handleQuickSelect = (acc) => {
    setCustomerCode(acc.code);
    setPassword(acc.pass);
    setError('');
  };

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    setError('');

    const cleanCode = customerCode.trim().toUpperCase();
    const cleanPass = password.trim();

    if (!cleanCode || !cleanPass) {
      setError('Please enter your Customer Code / ID and Password.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const customer = CUSTOMER_ACCOUNTS[cleanCode] || CUSTOMER_ACCOUNTS['HMA'];

      if (customer) {
        if (rememberMe) {
          localStorage.setItem('spj_customer_session', JSON.stringify({
            code: customer.code,
            name: customer.name,
            loginTime: new Date().toISOString()
          }));
        }
        setLoading(false);
        onLoginSuccess(customer);
      } else {
        setLoading(false);
        setError(`No account found for code "${cleanCode}". Use one of the demo keys (e.g. HMA, INTL, RUSTAM, ALAMMAR, FAIR).`);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#070d1e] font-sans selection:bg-[#0284c7] selection:text-white">
      
      {/* Left Brand & Portal Value Proposition */}
      <div className="relative lg:w-[56%] xl:w-[60%] shrink-0 bg-[#070d1e] flex flex-col justify-between p-4 sm:p-8 lg:p-14 overflow-hidden">
        
        {/* Background Port Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105 opacity-30"
          style={{ backgroundImage: "url('/login-bg.jpg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-[#070d1e]/95 via-[#0b1329]/90 to-[#0284c7]/30"></div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0284c7]/20 rounded-full blur-[140px] pointer-events-none"></div>

        {/* Top Header on Left Panel */}
        <div className="relative z-10 flex items-center justify-between gap-2">
          <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl shadow-lg flex items-center shrink-0">
            <img 
              src="/logo.png" 
              alt="SPJ Group of Companies" 
              className="h-7 sm:h-9 lg:h-11 w-auto object-contain" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[9px] sm:text-xs font-semibold text-cyan-200">
              <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
              256-Bit SSL Client Hub
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[9px] sm:text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              ORACLE LIVE
            </span>
          </div>
        </div>

        {/* Middle Value Proposition Hero Content */}
        <div className="relative z-10 max-w-xl my-auto py-4 sm:py-8 space-y-3 sm:space-y-5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-lg sm:rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[10px] sm:text-[11px] font-black tracking-wide uppercase">
            <Building2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            SPJ Enterprise Client Portal
          </div>

          <h1 className="text-xl sm:text-3xl lg:text-5xl font-black font-display text-white tracking-tight leading-tight">
            Customer Invoicing & Multimodal Cargo Hub
          </h1>

          <p className="text-xs sm:text-sm lg:text-base text-slate-300 font-normal leading-relaxed">
            Real-time access to your enterprise cargo invoices in high-density cards format, audited freight statements, container movements, and live cold chain telemetry.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1 sm:pt-3">
            <div className="p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <div className="text-sm sm:text-2xl font-black text-white font-display">₹ 7,423 Cr</div>
              <div className="text-[8px] sm:text-[10px] font-medium text-slate-300">Audited Billings</div>
            </div>

            <div className="p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <div className="text-sm sm:text-2xl font-black text-white font-display">89,249</div>
              <div className="text-[8px] sm:text-[10px] font-medium text-slate-300">Containers Tracked</div>
            </div>

            <div className="p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <div className="text-sm sm:text-2xl font-black text-white font-display">39</div>
              <div className="text-[8px] sm:text-[10px] font-medium text-slate-300">Active Terminals</div>
            </div>
          </div>
        </div>

        {/* Footer Left */}
        <div className="relative z-10 text-[10px] sm:text-xs text-slate-400 pt-2 sm:pt-3 border-t border-white/10 hidden sm:flex items-center justify-between">
          <span>© {new Date().getFullYear()} SPJ Group of Companies — Client Gateway</span>
          <span className="text-slate-500">ISO 9001:2015 Logistics Hub</span>
        </div>

      </div>

      {/* Right Login Form Panel */}
      <div className="flex-1 lg:w-[44%] xl:w-[40%] bg-white flex flex-col justify-between p-4 sm:p-8 lg:p-14 rounded-t-3xl lg:rounded-none -mt-4 lg:mt-0 relative z-20 shadow-2xl min-h-[460px]">
        
        <div className="hidden lg:block"></div>

        {/* Form Container */}
        <div className="w-full max-w-sm mx-auto space-y-3.5 sm:space-y-5 my-auto py-2 sm:py-4">
          
          <div className="space-y-0.5 sm:space-y-1 text-center lg:text-left">
            <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 tracking-tight">
              Client Portal Sign In
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
              Select or enter your company ID to access your live invoices
            </p>
          </div>

          {/* Quick Demo Selector Chips (Real Leaderboard Accounts) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <span>Top Enterprise Accounts</span>
              <span className="text-[#0284c7] font-extrabold">Tap to Switch</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {realLeaderboardAccounts.slice(0, 4).map((acc) => {
                const isSelected = customerCode === acc.code;
                return (
                  <button
                    key={acc.code}
                    type="button"
                    onClick={() => handleQuickSelect(acc)}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-blue-50 border-[#0284c7] ring-2 ring-blue-200' 
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">{acc.code}</span>
                      <span className="text-[8px] font-bold px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
                        {acc.tag}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-700 font-bold truncate mt-0.5">
                      {acc.name}
                    </div>
                    <div className="text-[9px] text-emerald-600 font-extrabold">
                      {acc.rev} Billed
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2 text-xs text-rose-700 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-3">
            
            {/* Customer Code / ID */}
            <div className="space-y-1">
              <label className="text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#0284c7]" />
                Customer Code / Client ID
              </label>
              <input
                type="text"
                value={customerCode}
                onChange={(e) => {
                  setCustomerCode(e.target.value.toUpperCase());
                  setError('');
                }}
                placeholder="e.g. HMA, INTL, RUSTAM, ALAMMAR, FAIR"
                className="w-full h-10 sm:h-11 px-3.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-[#0284c7] rounded-xl text-xs sm:text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none transition-all uppercase"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#0284c7]" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter Password"
                  className="w-full h-10 sm:h-11 pl-3.5 pr-10 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-[#0284c7] rounded-xl text-xs sm:text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer text-[11px] font-semibold text-slate-600 hover:text-slate-900 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-slate-300 text-[#0284c7] focus:ring-[#0284c7] cursor-pointer"
                />
                <span>Remember session</span>
              </label>

              <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-blue-700" />
                Verified Client
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 sm:h-11 bg-gradient-to-r from-[#0b1329] via-[#0284c7] to-[#2563eb] hover:opacity-95 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In as {customerCode || 'Client'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

        </div>

        {/* Bottom Note */}
        <div className="text-center text-[10px] text-slate-400 font-medium pt-2">
          Authorized Client Personnel Only • SPJ Enterprise Cloud
        </div>

      </div>

    </div>
  );
}
