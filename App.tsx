
import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import DiagnosisForm from './components/DiagnosisForm';
import { DiagnosisFormData } from './types';
import { analyzeVehicle } from './services/geminiService';
import ReactMarkdown from 'react-markdown';
import { Wrench, LogOut, ShieldAlert, FileText, Printer, RotateCcw, Key, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needsKey, setNeedsKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      if (process.env.API_KEY) {
        setNeedsKey(false);
        return;
      }
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) setNeedsKey(true);
      }
    };
    checkKey();
  }, []);

  const handleOpenKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setNeedsKey(false);
    }
  };

  const handleLogin = (password: string) => {
    if (password === 'luna1989') {
      setIsAuthenticated(true);
      setError(null);
    } else {
      setError('Senha incorreta. Verifique os dados com a gerência.');
    }
  };

  const handleAnalyze = async (formData: DiagnosisFormData) => {
    setIsAnalyzing(true);
    setDiagnosis(null);
    setError(null);
    
    try {
      const result = await analyzeVehicle(formData);
      setDiagnosis(result);
      setTimeout(() => {
        document.getElementById('diagnosis-result')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError("Ocorreu um erro na comunicação com o sistema de IA. Tente novamente.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} error={error} />;
  }

  return (
    <div className="min-h-screen bg-[#1E293B] text-slate-100 pb-12 font-sans selection:bg-[#F59E0B] selection:text-slate-900">
      <header className="sticky top-0 z-50 bg-[#1E293B]/95 backdrop-blur-md border-b border-slate-700/50 p-4 print:hidden">
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-2">
          <div className="flex items-center gap-3">
             <img src="logo.png" alt="Luna Logo" className="h-8 md:h-10 shrink-0" onError={(e) => (e.currentTarget.style.display = 'none')} />
             <div className="flex flex-col">
               <span className="font-black text-[#F59E0B] tracking-tighter text-xs md:text-lg uppercase whitespace-nowrap leading-none">
                 Luna Autopeças
               </span>
               <span className="text-[8px] md:text-xs text-slate-400 font-bold uppercase tracking-wider hidden sm:block">
                 Especialista Virtual Online
               </span>
             </div>
          </div>
          
          <div className="flex items-center gap-2">
            {needsKey && (
              <button 
                onClick={handleOpenKey}
                className="flex items-center gap-2 px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase transition-all shadow-lg animate-pulse"
              >
                <Key size={14} /> Ativar IA
              </button>
            )}
            <button 
              onClick={() => setIsAuthenticated(false)}
              className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-xl text-slate-400 hover:text-[#F59E0B] hover:bg-slate-700 transition-all text-[10px] font-black uppercase shrink-0"
            >
              <LogOut size={14} /> <span className="hidden md:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-10">
        {/* DESTAQUE DO SEU LUNA E BALÃO DE FALA */}
        <div className="flex flex-col items-center mb-12 print:hidden">
          <div className="relative flex flex-col md:flex-row items-center gap-8 w-full max-w-3xl">
            {/* O Personagem */}
            <div className="shrink-0 relative">
              <div className="absolute -inset-4 bg-[#F59E0B]/10 rounded-full blur-3xl opacity-50"></div>
              <img 
                src="seuluna.png" 
                alt="Seu Luna" 
                className="relative w-40 h-40 md:w-52 md:h-52 object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.5)]"
                onError={(e) => (e.currentTarget.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=SeuLuna&baseColor=f59e0b')}
              />
            </div>
            
            {/* O Balão de Fala */}
            <div className="relative bg-slate-800 border-2 border-slate-700 p-8 rounded-[2.5rem] shadow-2xl flex-1 amber-glow">
              {/* Seta do Balão (Mobile - Topo) */}
              <div className="md:hidden absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-b-[15px] border-b-slate-700 border-r-[15px] border-r-transparent"></div>
              {/* Seta do Balão (Desktop - Esquerda) */}
              <div className="hidden md:block absolute -left-4 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[15px] border-t-transparent border-r-[20px] border-r-slate-700 border-b-[15px] border-b-transparent"></div>
              
              <h1 className="text-2xl md:text-3xl font-black text-[#F59E0B] mb-2 flex items-center gap-3 uppercase tracking-tighter">
                <Wrench size={28} /> Fala, sou o Seu Luna!
              </h1>
              <p className="text-slate-300 leading-relaxed font-bold text-sm md:text-lg">
                Seu carro tá fazendo algum barulho ou com comportamento estranho? Preenche os dados aí embaixo que eu já te falo o que deve ser!
              </p>
            </div>
          </div>
        </div>

        <div className="print:hidden">
          <DiagnosisForm onSubmit={handleAnalyze} isLoading={isAnalyzing} />
        </div>

        {(isAnalyzing || diagnosis || error) && (
          <div id="diagnosis-result" className="mt-12 space-y-6">
            {isAnalyzing && (
              <div className="bg-slate-800/80 p-16 rounded-[3rem] border-2 border-[#F59E0B]/20 flex flex-col items-center justify-center space-y-8 amber-glow backdrop-blur-md print:hidden">
                <div className="relative">
                  <div className="absolute -inset-8 bg-[#F59E0B]/10 rounded-full blur-3xl animate-pulse"></div>
                  <Loader2 className="animate-spin text-[#F59E0B] relative" size={80} />
                </div>
                <div className="text-center space-y-3">
                  <p className="text-3xl font-black text-[#F59E0B] tracking-tight uppercase">Seu Luna está analisando...</p>
                  <p className="text-slate-400 text-base italic font-semibold">"Estou checando as folgas, injeção e barulhos no motor..."</p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-900/20 border-2 border-red-500/50 p-8 rounded-[2.5rem] flex items-center gap-6 text-red-200 print:hidden animate-in zoom-in duration-300">
                <ShieldAlert size={48} className="shrink-0 text-red-500" />
                <div>
                   <p className="font-black uppercase text-sm text-red-400 tracking-widest mb-1">Aviso Técnico</p>
                   <p className="font-bold text-slate-300 text-lg">{error}</p>
                </div>
              </div>
            )}

            {diagnosis && !isAnalyzing && (
              <div className="bg-slate-800 p-8 md:p-20 rounded-[3rem] border-t-[12px] border-[#F59E0B] shadow-2xl amber-glow animate-in fade-in zoom-in duration-700 overflow-hidden relative print:bg-white print:text-slate-900 print:border-slate-300 print:p-12 print:shadow-none print:amber-glow-none print:rounded-none print:border-t-0">
                
                {/* Cabeçalho do Laudo Pericial */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 pb-12 border-b-2 border-slate-700/50 relative z-10 print:border-slate-300">
                  <div className="flex items-center gap-6">
                    <div className="bg-[#F59E0B] p-5 rounded-3xl shadow-2xl shadow-amber-500/20 print:bg-slate-100 print:shadow-none">
                      <FileText className="text-slate-900" size={40} />
                    </div>
                    <div>
                      <h2 className="text-3xl md:text-4xl font-black text-[#F59E0B] uppercase tracking-tighter leading-none print:text-slate-900">Laudo Técnico Pericial</h2>
                      <span className="text-slate-500 text-xs font-black uppercase tracking-[0.3em] mt-3 block">Consultoria Especializada Luna Autopeças</span>
                    </div>
                  </div>
                  <div className="flex flex-col md:text-right">
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Data de Emissão</span>
                    <span className="text-slate-200 text-lg font-black print:text-slate-800">{new Date().toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                
                {/* Conteúdo do Laudo Justificado */}
                <div className="prose prose-invert prose-amber max-w-none relative z-10
                  [&_p]:text-justify
                  [&_p]:mb-8
                  [&_p]:leading-relaxed
                  [&_p]:text-base
                  md:[&_p]:text-lg
                  print:prose-slate
                  prose-headings:text-[#F59E0B] 
                  prose-headings:font-black 
                  prose-headings:uppercase 
                  prose-headings:tracking-tighter
                  prose-h2:border-b-2
                  prose-h2:border-slate-700/50
                  prose-h2:pb-4
                  prose-h2:mt-16
                  prose-h2:text-2xl
                  prose-p:text-slate-300
                  prose-p:font-semibold
                  prose-strong:text-[#F59E0B]
                  print:prose-headings:text-slate-900
                  print:prose-p:text-slate-800
                  print:prose-strong:text-slate-900
                  print:prose-h2:border-slate-300">
                  <ReactMarkdown>{diagnosis}</ReactMarkdown>
                </div>
                
                {/* Rodapé do Laudo */}
                <div className="mt-20 pt-12 border-t-2 border-slate-700/50 flex flex-col md:flex-row items-center justify-between gap-10 relative z-10 print:border-slate-300">
                  <div className="flex flex-col gap-3">
                    <span className="text-[#F59E0B] font-black text-sm uppercase tracking-widest print:text-slate-900">Validado Eletronicamente: Seu Luna</span>
                    <p className="text-slate-500 text-[11px] font-bold max-w-md uppercase leading-relaxed print:text-slate-600">
                      Este documento é um diagnóstico preliminar gerado por Inteligência Artificial. Procure um profissional presencial para execução dos serviços.
                    </p>
                  </div>
                  <div className="flex gap-4 w-full md:w-auto print:hidden">
                    <button 
                      onClick={() => window.print()}
                      className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-slate-700 hover:bg-slate-600 text-[#F59E0B] px-8 py-5 rounded-[1.5rem] text-sm font-black transition-all border-2 border-slate-600 shadow-xl uppercase"
                    >
                      <Printer size={20} /> Imprimir Laudo
                    </button>
                    <button 
                      onClick={() => window.location.reload()}
                      className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-[#F59E0B] hover:bg-amber-400 text-slate-900 px-8 py-5 rounded-[1.5rem] text-sm font-black transition-all shadow-xl shadow-amber-500/10 uppercase"
                    >
                      <RotateCcw size={20} /> Novo Exame
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      
      <footer className="mt-24 border-t border-slate-800 bg-slate-900/50 py-16 print:hidden">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-8 text-center">
          <img src="logo.png" alt="Luna Logo" className="h-12 opacity-20 grayscale" />
          <div className="space-y-2">
            <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em]">
              Luna Autopeças e Serviços Automotivos
            </p>
            <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">
              Tecnologia de Especialista Virtual Seu Luna v3.5 • 2026
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
