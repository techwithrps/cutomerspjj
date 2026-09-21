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
  Clock
} from 'lucide-react';
import { CUSTOMER_ACCOUNTS } from '../data/customerData';

export default function CustomerLoginPage({ onLoginSuccess }) {
  const [customerCode, setCustomerCode] = useState('HMA');
  const [password, setPassword] = useState('hma@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const quickDemoAccounts = [
    { code: 'HMA', name: 'HMA Agro Industries', pass: 'hma@123', tag: 'Top Exporter' },
    { code: 'ALLANA', name: 'Allana Sons Ltd', pass: 'allana@123', tag: 'Agro Conglomerate' },
    { code: 'ITC', name: 'ITC Limited - Agri', pass: 'itc@123', tag: 'Agri Business' },
    { code: 'LG', name: 'LG Electronics India', pass: 'lg@123', tag: 'Electronics SCM' },
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
      const customer = CUSTOMER_ACCOUNTS[cleanCode];

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
        setError(`No account found for code "${cleanCode}". Use one of the demo keys (e.g. HMA, ALLANA, ITC, LG).`);
      }
    }, 350);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-950 font-sans selection:bg-[#ff6a00] selection:text-white">
      
      {/* Left Brand & Portal Value Proposition */}
      <div className="relative lg:w-[56%] xl:w-[60%] shrink-0 bg-slate-950 flex flex-col justify-between p-4 sm:p-8 lg:p-14 overflow-hidden">
        
        {/* Background Port Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105 opacity-40"
          style={{ backgroundImage: "url('/login-bg.jpg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-slate-950/95 via-slate-950/90 to-[#2b1f55]/85"></div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff6a00]/15 rounded-full blur-[140px] pointer-events-none"></div>

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
            <span className="inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[9px] sm:text-xs font-semibold text-purple-200">
              <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
              Client SSL 256-Bit
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[9px] sm:text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              LIVE CLIENT HUB
            </span>
          </div>
        </div>

        {/* Middle Value Proposition Hero Content */}
        <div className="relative z-10 max-w-xl my-auto py-4 sm:py-8 space-y-3 sm:space-y-5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-lg sm:rounded-xl bg-orange-500/20 border border-orange-500/30 text-[#ff8a3d] text-[10px] sm:text-[11px] font-black tracking-wide uppercase">
            <Building2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            Enterprise Customer & Shipper Portal
          </div>

          <h1 className="text-xl sm:text-3xl lg:text-5xl font-black font-display text-white tracking-tight leading-tight">
            Client Invoicing & Container Intelligence
          </h1>

          <p className="text-xs sm:text-sm lg:text-base text-slate-300 font-normal leading-relaxed">
            Access your company's multimodal cargo invoices in interactive card format, download official tax statements, and monitor real-time container movements.
          </p>

          {/* Quick Client Benefits */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1 sm:pt-3">
            <div className="p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <Receipt className="w-4 h-4 text-amber-400 mb-1" />
              <div className="text-xs sm:text-sm font-bold text-white">Invoice Cards</div>
              <div className="text-[8px] sm:text-[10px] text-slate-300">Detailed tax breakdown</div>
            </div>

            <div className="p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <Container className="w-4 h-4 text-cyan-400 mb-1" />
              <div className="text-xs sm:text-sm font-bold text-white">Live Containers</div>
              <div className="text-[8px] sm:text-[10px] text-slate-300">Reefer temp & GPS tracking</div>
            </div>

            <div className="p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <Clock className="w-4 h-4 text-emerald-400 mb-1" />
              <div className="text-xs sm:text-sm font-bold text-white">Ledger & Credit</div>
              <div className="text-[8px] sm:text-[10px] text-slate-300">Instant credit balance</div>
            </div>
          </div>
        </div>

        {/* Footer Left */}
        <div className="relative z-10 text-[10px] sm:text-xs text-slate-400 pt-2 sm:pt-3 border-t border-white/10 hidden sm:flex items-center justify-between">
          <span>© {new Date().getFullYear()} SPJ Group of Companies — Client Gateway</span>
          <span className="text-slate-500">ISO 9001:2015 Certified Logistics</span>
        </div>

      </div>

      {/* Right Login Form Panel */}
      <div className="flex-1 lg:w-[44%] xl:w-[40%] bg-white flex flex-col justify-between p-5 sm:p-8 lg:p-14 rounded-t-3xl lg:rounded-none -mt-4 lg:mt-0 relative z-20 shadow-2xl min-h-[460px]">
        
        {/* Top Spacer */}
        <div className="hidden lg:block"></div>

        {/* Form Container */}
        <div className="w-full max-w-sm mx-auto space-y-4 sm:space-y-6 my-auto py-2 sm:py-4">
          
          <div className="space-y-0.5 sm:space-y-1 text-center lg:text-left">
            <h2 className="text-xl sm:text-3xl font-black font-display text-slate-900 tracking-tight">
              Customer Sign In
            </h2>
            <p className="text-[11px] sm:text-sm text-slate-500 font-medium">
              Enter your Customer Code to access your company dashboard
            </p>
          </div>

          {/* Quick Demo Selector Chips */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Quick Test Logins</span>
              <span className="text-[#ff6a00] font-extrabold">Tap to auto-fill</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {quickDemoAccounts.map((acc) => {
                const isSelected = customerCode === acc.code;
                return (
                  <button
                    key={acc.code}
                    type="button"
                    onClick={() => handleQuickSelect(acc)}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-purple-50 border-[#2b1f55] ring-2 ring-purple-200' 
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">{acc.code}</span>
                      <span className="text-[8px] font-bold px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
                        {acc.tag}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate font-medium mt-0.5">
                      {acc.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2 text-xs text-rose-700 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-3.5 sm:space-y-4">
            
            {/* Customer Code / ID */}
            <div className="space-y-1">
              <label className="text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#2b1f55]" />
                Customer Code / Client ID
              </label>
              <input
                type="text"
                value={customerCode}
                onChange={(e) => {
                  setCustomerCode(e.target.value.toUpperCase());
                  setError('');
                }}
                placeholder="e.g. HMA, ALLANA, ITC, LG"
                className="w-full h-11 sm:h-12 px-3.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border-2 border-slate-200 focus:border-[#ff6a00] rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#ff6a00]/15 transition-all uppercase"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#2b1f55]" />
                Access Password
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
                  className="w-full h-11 sm:h-12 pl-3.5 pr-10 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border-2 border-slate-200 focus:border-[#ff6a00] rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#ff6a00]/15 transition-all"
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
              <label className="flex items-center gap-2 cursor-pointer text-[11px] sm:text-xs font-semibold text-slate-600 hover:text-slate-900 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-slate-300 text-[#ff6a00] focus:ring-[#ff6a00] cursor-pointer"
                />
                <span>Keep me signed in</span>
              </label>

              <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-purple-700" />
                Verified Client
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 sm:h-12 bg-gradient-to-r from-[#2b1f55] to-[#ff6a00] hover:opacity-95 text-white font-black text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-lg shadow-purple-950/20 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50 hover-lift active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Open {customerCode ? `${customerCode} Dashboard` : 'Dashboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

        </div>

        {/* Bottom Note */}
        <div className="text-center text-[10px] sm:text-xs text-slate-400 font-medium pt-2">
          Dedicated Customer Gateway • SPJ Group Enterprise Cloud
        </div>

      </div>

    </div>
  );
}
