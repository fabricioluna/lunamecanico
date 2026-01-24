
import React, { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';

interface LoginFormProps {
  onLogin: (password: string) => void;
  error: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, error }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 rounded-[2.5rem] p-10 shadow-2xl border border-slate-700/50 amber-glow relative overflow-hidden">
        {/* Decoração de fundo sutil */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#F59E0B] opacity-[0.03] rounded-full blur-3xl"></div>
        
        <div className="flex flex-col items-center mb-10 relative z-10">
          <img 
            src="logo.png" 
            alt="Luna Logo" 
            className="h-20 mb-6 drop-shadow-xl" 
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
          <h1 className="text-4xl font-black text-[#F59E0B] text-center tracking-tight uppercase">Seu Luna</h1>
          <p className="text-slate-400 text-center mt-1 font-medium tracking-wide uppercase text-sm">Mecânico Virtual</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Senha de Acesso</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-600 group-focus-within:text-[#F59E0B] transition-colors" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 bg-slate-900 border-2 border-slate-700 rounded-2xl text-white placeholder-slate-700 focus:outline-none focus:border-[#F59E0B] transition-all font-mono"
                placeholder="••••••••"
                required
                autoFocus
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-2xl text-red-400 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <div className="shrink-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-5 bg-[#F59E0B] text-slate-900 font-black rounded-2xl hover:bg-amber-400 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-amber-500/10 group uppercase text-lg"
          >
            Acessar Sistema 
            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-700/50 text-center relative z-10">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
            @ 2026 Luna Autopeças e Serviços<br/>
            <span className="text-slate-600 font-medium">Desenvolvido por Fabrício Luna</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
