
import React, { useState } from 'react';
import { Lock } from 'lucide-react';

interface LoginFormProps { onLogin: () => void; }

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === 'luna1989') onLogin();
    else { 
      setError(true); 
      setTimeout(() => setError(false), 2000); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#27345b] p-4 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#f6a700] rounded-full blur-[150px] opacity-10"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400 rounded-full blur-[150px] opacity-10"></div>

      <div className="w-full max-w-sm z-10 animate-fade-in">
        {/* Logo Superior */}
        <div className="flex justify-center mb-8">
          <img 
            src="./logo.png" 
            alt="Luna Autopeças" 
            className="h-32 object-contain drop-shadow-2xl" 
            onError={e => e.currentTarget.style.display='none'} 
          />
        </div>

        {/* Personagem Seu Luna centralizado e sobreposto ao card */}
        <div className="flex justify-center -mb-24 relative z-20">
          <img 
            src="./personagem.png" 
            alt="Seu Luna"
            className="w-48 h-auto drop-shadow-[0_25px_35px_rgba(0,0,0,0.6)]" 
            onError={e => e.currentTarget.src='https://img.icons8.com/bubbles/500/maintenance.png'} 
          />
        </div>

        {/* Card de Entrada */}
        <div className="bg-white rounded-[3rem] p-8 pt-28 shadow-[0_30px_60px_rgba(0,0,0,0.4)] border border-white/20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-[#27345b] italic tracking-tighter uppercase leading-none">Mecânico Virtual</h2>
            <p className="text-[#f6a700] text-[10px] font-extrabold uppercase tracking-[0.4em] mt-1.5">Diagnóstico Inteligente</p>
          </div>

          <form onSubmit={handle} className="space-y-6">
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#f6a700] transition-colors" size={20} />
              <input 
                type="password" 
                placeholder="SENHA DE ACESSO" 
                autoFocus
                className={`w-full pl-14 pr-4 py-5 bg-slate-50 border-2 ${error ? 'border-red-500 animate-shake' : 'border-slate-100 focus:border-[#f6a700]'} rounded-3xl outline-none text-center font-mono text-2xl text-[#27345b] transition-all`}
                value={pass}
                onChange={e => setPass(e.target.value)}
              />
            </div>
            
            <button className="w-full bg-[#f6a700] hover:bg-[#e59600] text-white font-black py-5 rounded-3xl shadow-xl shadow-[#f6a700]/30 transition-all active:scale-95 uppercase tracking-widest text-lg">
              ACESSAR PORTAL
            </button>
            
            {error && (
              <div className="bg-red-50 text-red-600 text-xs text-center font-bold py-3 rounded-xl border border-red-100 animate-pulse">
                ACESSO NEGADO! VERIFIQUE A SENHA.
              </div>
            )}
          </form>
          
          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-slate-300 text-[9px] font-bold uppercase tracking-widest leading-relaxed">
              Luna Autopeças e Serviços <br/> Excelência em cada detalhe
            </p>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </div>
  );
};

export default LoginForm;
