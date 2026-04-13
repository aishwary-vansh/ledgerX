// src/pages/Login.tsx
import { useState, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';

type Mode = 'login' | 'register';

const Login = () => {
  const { login, register, error, clearError, isLoading } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [submitting, setSubmitting] = useState(false);
  const [fieldError, setFieldError] = useState('');

  const set = (k: string, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    clearError();
    setFieldError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) return setFieldError('Email and password are required.');
    if (mode === 'register' && !form.name) return setFieldError('Name is required.');

    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.email, form.password, form.name);
      }
    } catch {
      // error already set in AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-ink">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <p className="font-mono-dm text-[0.65rem] text-white/30 tracking-widest uppercase">Authenticating</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-ink overflow-hidden relative">
      {/* Background orbs */}
      <div className="absolute w-[500px] h-[500px] top-[-100px] right-[-150px] rounded-full blur-[100px] bg-[radial-gradient(circle,rgba(91,79,255,0.25),transparent_70%)] pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] bottom-[-100px] left-[-100px] rounded-full blur-[100px] bg-[radial-gradient(circle,rgba(0,245,200,0.12),transparent_70%)] pointer-events-none" />

      {/* Card */}
      <div className="relative w-full max-w-[420px] mx-4 bg-card2 border border-white/8 rounded-[24px] p-8 shadow-2xl slide-up">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="font-syne text-[2rem] font-[800] tracking-[-0.04em] leading-none mb-1">
            Ledger<span className="text-accent">X</span>
          </div>
          <div className="font-mono-dm text-[0.6rem] tracking-[0.15em] text-white/25 uppercase">
            ◈ Finance Dashboard
          </div>
        </div>

        {/* Mode tabs */}
        <div className="flex gap-1 p-1 bg-white/4 rounded-xl border border-white/6 mb-6">
          {(['login', 'register'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); clearError(); setFieldError(''); }}
              className={`flex-1 py-2 rounded-lg font-mono-dm text-[0.65rem] tracking-[0.1em] uppercase font-bold transition-all cursor-none ${
                mode === m
                  ? 'bg-accent text-ink shadow-[0_0_12px_rgba(0,245,200,0.35)]'
                  : 'text-white/30 hover:text-white/50'
              }`}
            >
              {m === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'register' && (
            <div className="flex flex-col gap-1.5">
              <label className="font-mono-dm text-[0.6rem] tracking-[0.1em] uppercase text-white/30">Full Name</label>
              <input
                type="text"
                placeholder="Rajesh Kumar"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                className="p-3 bg-white/4 border border-white/8 rounded-xl text-paper font-cabinet text-[0.88rem] outline-none focus:border-accent/40 transition-all"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="font-mono-dm text-[0.6rem] tracking-[0.1em] uppercase text-white/30">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              className="p-3 bg-white/4 border border-white/8 rounded-xl text-paper font-cabinet text-[0.88rem] outline-none focus:border-accent/40 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono-dm text-[0.6rem] tracking-[0.1em] uppercase text-white/30">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              className="p-3 bg-white/4 border border-white/8 rounded-xl text-paper font-cabinet text-[0.88rem] outline-none focus:border-accent/40 transition-all"
            />
          </div>

          {/* Errors */}
          {(error || fieldError) && (
            <p className="font-mono-dm text-[0.65rem] text-red uppercase tracking-wide font-bold">
              ⚠ {fieldError || error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 py-3 bg-accent text-ink rounded-xl font-cabinet text-[0.9rem] font-extrabold cursor-none hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,245,200,0.35)] transition-all disabled:opacity-50 disabled:scale-100"
          >
            {submitting
              ? 'Please wait…'
              : mode === 'login' ? 'Sign In →' : 'Create Account →'}
          </button>
        </form>

        {/* Quick credentials hint */}
        <div className="mt-6 p-3 bg-white/3 border border-white/6 rounded-xl">
          <p className="font-mono-dm text-[0.58rem] text-white/25 tracking-wide uppercase mb-2 font-bold">Demo credentials</p>
          <div className="flex flex-col gap-1">
            <p className="font-mono-dm text-[0.62rem] text-white/35">
              <span className="text-accent">Admin:</span> admin@ledgerx.com / Admin@1234
            </p>
            <p className="font-mono-dm text-[0.62rem] text-white/35">
              <span className="text-accent2">Viewer:</span> viewer@ledgerx.com / Viewer@1234
            </p>
          </div>
        </div>

        <p className="mt-4 text-center font-mono-dm text-[0.55rem] text-white/15 tracking-wider uppercase">
          © 2026 LedgerX · Secure JWT Auth
        </p>
      </div>
    </div>
  );
};

export default Login;
