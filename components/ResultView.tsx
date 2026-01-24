
import React from 'react';

interface Props {
  markdown: string;
  onBack: () => void;
}

const ResultView: React.FC<Props> = ({ markdown, onBack }) => {
  // Simple markdown renderer for the specific sections requested
  const sections = markdown.split(/\n(?=\d\.)/);

  return (
    <div className="animate-fade-in space-y-6 pb-20">
      <div className="flex items-center gap-4 mb-4">
        <button 
          onClick={onBack}
          className="p-3 bg-white hover:bg-slate-100 rounded-2xl transition-all shadow-md border-2 border-slate-200 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-900 group-hover:text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-2xl font-brand font-black text-slate-950 uppercase tracking-tight">Parecer do Especialista</h2>
      </div>

      <div className="bg-slate-950 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden border-b-[16px] border-amber-500">
        {/* Decorative elements based on brand colors */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full -mr-24 -mt-24 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full -ml-24 -mb-24 blur-3xl"></div>

        <div className="flex flex-col md:flex-row items-center gap-8 mb-12 relative border-b border-white/10 pb-10">
           <div className="relative">
             <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl scale-125"></div>
             <img 
                src="seu-luna.png" 
                alt="Seu Luna" 
                className="w-40 h-40 object-contain relative drop-shadow-[0_15px_15px_rgba(0,0,0,0.5)]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=SeuLuna&backgroundColor=ffb300";
                }}
             />
           </div>
           <div className="text-center md:text-left">
             <div className="bg-amber-500 text-slate-950 px-5 py-2 rounded-full text-xs font-black uppercase inline-block mb-4 tracking-[0.2em] shadow-xl">Laudo Técnico Luna Autopeças</div>
             <h3 className="text-3xl font-brand font-black leading-tight text-white uppercase italic">"Diagnóstico Pronto, Parceiro!"</h3>
             <p className="text-amber-400 text-sm mt-2 font-black uppercase tracking-widest">Análise por: Seu Luna — 40 anos de oficina</p>
           </div>
        </div>

        <div className="space-y-10 relative prose prose-invert max-w-none">
          {sections.map((section, idx) => {
             const isTitle = section.includes('🎯');
             return (
               <div key={idx} className={`${isTitle ? 'bg-slate-900 p-8 rounded-[2.5rem] border-l-[12px] border-amber-500 shadow-2xl ring-1 ring-white/10' : 'px-4'}`}>
                 <pre className="whitespace-pre-wrap font-sans text-xl sm:text-2xl leading-relaxed text-white font-semibold">
                    {section.trim()}
                 </pre>
               </div>
             )
          })}
        </div>

        <div className="mt-16 p-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-[2.5rem] text-slate-950 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 opacity-10 group-hover:scale-110 transition-transform">
             <img src="seu-luna.png" className="w-32 h-32 object-contain grayscale" />
          </div>
          <div className="flex items-center gap-6 text-center lg:text-left relative z-10">
             <div className="bg-slate-950 rounded-2xl p-4 shadow-2xl">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                 <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 004.587 4.587l.773-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
               </svg>
             </div>
             <div>
               <p className="font-black text-2xl uppercase leading-none mb-1">Peças na Mão!</p>
               <p className="text-sm font-black opacity-90 uppercase tracking-wide">Fale com nosso balcão e garanta o melhor preço.</p>
             </div>
          </div>
          <button className="w-full lg:w-auto px-12 py-6 bg-slate-950 text-amber-400 rounded-2xl font-black text-lg uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl border-b-4 border-slate-800 relative z-10">
            WHATSAPP LUNA
          </button>
        </div>
      </div>

      <div className="flex justify-center mt-12">
        <button 
          onClick={onBack}
          className="px-12 py-6 bg-slate-900 hover:bg-black text-white font-black rounded-2xl transition-all uppercase text-sm tracking-[0.3em] shadow-xl border-b-4 border-slate-800"
        >
          Iniciar Novo Laudo
        </button>
      </div>
    </div>
  );
};

export default ResultView;
