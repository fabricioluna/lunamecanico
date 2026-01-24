
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (password: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 px-4 py-12">
      {/* Imagem do Seu Luna - O Protagonista, acima do título */}
      <div className="mb-4 animate-bounce-slow">
        <img 
          src="seu-luna.png" 
          alt="Seu Luna" 
          className="w-72 h-auto object-contain drop-shadow-[0_35px_35px_rgba(250,204,21,0.25)]" 
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=SeuLuna&backgroundColor=ffb300";
          }}
        />
      </div>

      <div className="max-w-md w-full bg-white rounded-[3.5rem] shadow-[0_0_60px_rgba(0,0,0,0.4)] p-10 text-center border-t-[12px] border-amber-500 relative overflow-hidden">
        {/* Efeito de iluminação interna */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"></div>
        
        <div className="mb-8 relative z-10">
          <h2 className="text-5xl font-brand font-black text-slate-950 mb-1 tracking-tighter uppercase italic">Seu Luna</h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="h-px w-10 bg-slate-200"></span>
            <p className="text-amber-600 font-black text-xs uppercase tracking-[0.3em]">Mecânico Virtual Pro</p>
            <span className="h-px w-10 bg-slate-200"></span>
          </div>
          <p className="text-slate-900 text-sm font-black bg-amber-50 py-2 px-6 rounded-full inline-block border border-amber-200">
            LUNA AUTOPEÇAS
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="relative">
            <label className="block text-left text-[11px] font-black text-slate-600 uppercase tracking-widest ml-5 mb-2">Chave de Acesso</label>
            <input
              type="password"
              placeholder="Digite a senha"
              className="w-full px-6 py-6 bg-slate-50 border-2 border-slate-200 focus:border-amber-500 focus:bg-white rounded-[2rem] outline-none transition-all text-center text-3xl font-mono tracking-[0.5em] text-slate-950 placeholder:text-slate-300 placeholder:tracking-normal placeholder:font-sans placeholder:text-base placeholder:font-bold"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="w-full py-6 bg-slate-950 hover:bg-black text-white rounded-[2rem] font-black text-xl shadow-2xl transform active:scale-95 transition-all flex items-center justify-center gap-3 border-b-8 border-slate-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            ABRIR OFICINA
          </button>
        </form>
        
        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col items-center gap-2">
          <p className="text-[9px] text-slate-400 uppercase tracking-[0.6em] font-black">Qualidade e Tradição</p>
          <p className="text-[11px] text-slate-900 font-black uppercase tracking-widest italic">Luna1989</p>
        </div>
      </div>
      
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;
