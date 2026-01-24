
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-950 text-white py-4 shadow-2xl border-b-4 border-amber-500 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-1 border-2 border-amber-500 overflow-hidden shadow-lg transform -rotate-3">
             <img 
              src="seu-luna.png" 
              alt="Logo Luna" 
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=SeuLuna&backgroundColor=ffb300";
              }}
             />
          </div>
          <div>
            <h1 className="text-2xl font-brand font-black tracking-tighter leading-none text-white">LUNA</h1>
            <p className="text-[10px] uppercase font-black text-amber-400 tracking-[0.2em]">Autopeças & Serviços</p>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <div className="flex items-center gap-2 justify-end mb-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sistemas Ativos</p>
          </div>
          <p className="text-sm font-black text-white uppercase tracking-tighter italic">Seu Luna Online</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
