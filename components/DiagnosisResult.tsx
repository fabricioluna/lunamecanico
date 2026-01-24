
import React from 'react';
import { marked } from 'marked';
import { ChevronLeft, Printer, Share2 } from 'lucide-react';
import { FormData } from '../types';

interface Props { content: string; onBack: () => void; formData: FormData; }

const DiagnosisResult: React.FC<Props> = ({ content, onBack, formData }) => {
  const html = { __html: marked.parse(content) };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8 no-print">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 font-bold hover:text-white transition-all bg-slate-900 px-5 py-2.5 rounded-xl border border-slate-800">
          <ChevronLeft size={20} /> VOLTAR AO INÍCIO
        </button>
        <div className="flex gap-3">
          <button onClick={() => window.print()} className="bg-[#f6a700] hover:bg-[#e59600] text-white px-6 py-2.5 rounded-xl font-black shadow-lg shadow-yellow-500/20 flex items-center gap-2 transition-all active:scale-95">
            <Printer size={18} /> IMPRIMIR LAUDO
          </button>
        </div>
      </div>

      <div className="bg-white text-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl printable-document">
        <div className="bg-[#27345b] p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-6 text-white text-center md:text-left">
          <div className="flex items-center gap-5">
             <div className="h-16 w-16 bg-white rounded-2xl p-1 flex items-center justify-center">
                <img src="./personagem.png" className="h-full object-contain" />
             </div>
             <div>
                <h1 className="text-3xl font-black italic tracking-tighter">LAUDO TÉCNICO</h1>
                <p className="text-[#f6a700] text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-2 justify-center md:justify-start">
                  <span className="h-1 w-1 bg-[#f6a700] rounded-full"></span>
                  Inteligência Seu Luna
                </p>
             </div>
          </div>
          <img src="./logo.png" className="h-16 object-contain" onError={e => e.currentTarget.style.display='none'} />
        </div>

        <div className="px-8 py-4 bg-slate-50 border-b flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <div className="flex items-center gap-2"><span className="text-[#f6a700]">VEÍCULO:</span> {formData.veiculo.marcaModelo}</div>
          <div className="flex items-center gap-2"><span className="text-[#f6a700]">ANO:</span> {formData.veiculo.ano}</div>
          <div className="flex items-center gap-2"><span className="text-[#f6a700]">KM:</span> {formData.veiculo.km}</div>
          <div className="flex items-center gap-2"><span className="text-[#f6a700]">MOTOR:</span> {formData.veiculo.motorizacao}</div>
        </div>

        <div className="p-8 md:p-16 prose prose-slate max-w-none prose-headings:text-[#27345b] prose-headings:font-black prose-strong:text-[#27345b] prose-strong:font-bold">
          <div className="diagnosis-content" dangerouslySetInnerHTML={html} />
        </div>

        <div className="p-8 border-t bg-slate-50 text-[10px] text-slate-400 italic text-center font-medium leading-relaxed">
          Este laudo é uma análise preliminar baseada em inteligência artificial e relatos técnicos. <br className="hidden sm:block" />
          É indispensável a inspeção física por um mecânico especializado na unidade Luna Autopeças e Serviços.
        </div>
      </div>
      
      <style>{`
        .diagnosis-content h1 { font-size: 1.5rem; border-left: 4px solid #f6a700; padding-left: 1rem; margin-top: 2rem; margin-bottom: 1rem; }
        .diagnosis-content ul { list-style-type: none; padding-left: 0; }
        .diagnosis-content li { margin-bottom: 0.5rem; display: flex; align-items: flex-start; gap: 0.5rem; }
        .diagnosis-content li::before { content: "•"; color: #f6a700; font-weight: bold; }
      `}</style>
    </div>
  );
};

export default DiagnosisResult;
