
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
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#F59E0B] opacity-[0.02] rounded-full blur-3xl"></div>
        
        <div className="flex flex-col items-center mb-8 relative z-10">
          {/* Logo da Empresa */}
          <img 
            src="logo.png" 
            alt="Luna Logo" 
            className="h-14 mb-10 drop-shadow-xl" 
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
          
          {/* Mascote Seu Luna - Destaque Máximo */}
          <div className="relative group mb-6">
            <div className="absolute -inset-6 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all duration-700"></div>
            <img 
              src="seuluna.png" 
              alt="Seu Luna" 
              className="relative w-56 h-56 md:w-64 md:h-64 object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.6)] transform hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.currentTarget.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=SeuLuna&baseColor=f59e0b';
              }}
            />
          </div>

          <div className="text-center">
            <h1 className="text-4xl font-black text-[#F59E0B] tracking-tight uppercase leading-tight">
              Seu Luna
            </h1>
            <p className="text-slate-400 font-bold tracking-wide uppercase text-[10px] mt-1 opacity-70">
              Mecânico Virtual Luna Autopeças
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Senha de Acesso</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-600 group-focus-within:text-[#F59E0B] transition-colors" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 bg-slate-900 border-2 border-slate-800 rounded-2xl text-white placeholder-slate-800 focus:outline-none focus:border-[#F59E0B] transition-all font-mono"
                placeholder="••••••••"
                required
                autoFocus
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-2xl text-red-400 text-xs font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <div className="shrink-0 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-5 bg-[#F59E0B] text-slate-900 font-black rounded-2xl hover:bg-amber-400 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-amber-500/10 group uppercase text-base tracking-tight"
          >
            Entrar na Oficina
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-700/50 text-center relative z-10">
          <p className="text-slate-600 text-[9px] font-black uppercase tracking-widest leading-relaxed">
            @ Luna Autopeças e Serviços Automotivos<br/>
            <span className="opacity-50">Tecnologia de Diagnóstico Inteligente</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
