
import React from 'react';
import { LogOut } from 'lucide-react';

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#27345b] border-b border-white/5 shadow-lg no-print">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl border-2 border-[#f6a700] overflow-hidden bg-white shadow-inner flex items-center justify-center p-0.5">
            <img 
              src="./personagem.png" 
              alt="Seu Luna"
              className="h-full w-auto object-contain"
              onError={(e) => e.currentTarget.src = 'https://img.icons8.com/bubbles/100/maintenance.png'}
            />
          </div>
          <div className="hidden sm:block">
            <img src="./logo.png" alt="Luna" className="h-6 object-contain brightness-0 invert" />
            <p className="text-[#f6a700] text-[9px] font-black uppercase tracking-[0.2em] mt-0.5">Mecânico Virtual</p>
          </div>
          <div className="sm:hidden">
             <h1 className="text-white font-black italic text-lg leading-none">SEU LUNA</h1>
             <p className="text-[#f6a700] text-[8px] font-bold uppercase tracking-tighter">Mecânico Virtual</p>
          </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-red-500/20 text-white/70 hover:text-red-400 rounded-xl transition-all border border-white/10"
        >
          <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Sair</span>
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Header;
