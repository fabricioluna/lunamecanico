
import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import DiagnosisForm from './components/DiagnosisForm';
import { DiagnosisFormData } from './types';
import { analyzeVehicle } from './services/geminiService';
import ReactMarkdown from 'react-markdown';
import { Wrench, LogOut, ShieldAlert, FileText, Printer, RotateCcw } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (password: string) => {
    if (password === 'luna1989') {
      setIsAuthenticated(true);
      setError(null);
    } else {
      setError('Senha incorreta. Acesso negado.');
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
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} error={error} />;
  }

  return (
    <div className="min-h-screen bg-[#1E293B] text-slate-100 pb-12 font-sans">
      <header className="sticky top-0 z-50 bg-[#1E293B]/95 backdrop-blur-md border-b border-slate-700/50 p-4 print:hidden">
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
             <img src="logo.png" alt="Luna Logo" className="h-10 shrink-0" onError={(e) => (e.currentTarget.style.display = 'none')} />
             <div className="flex flex-col md:flex-row md:items-center md:gap-2">
               <span className="font-black text-[#F59E0B] tracking-tighter text-sm md:text-lg uppercase whitespace-nowrap">
                 Luna Autopeças e Serviços
               </span>
               <span className="hidden md:block text-slate-500 font-bold">-</span>
               <span className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-wider">
                 Seu Luna, o seu mecânico virtual
               </span>
             </div>
          </div>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-full text-slate-400 hover:text-[#F59E0B] hover:bg-slate-700 transition-all text-xs font-bold uppercase shrink-0"
          >
            <span className="hidden sm:inline">Sair</span> <LogOut size={16} />
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-8">
        <div className="flex flex-col items-center mb-10 print:hidden">
          <div className="relative flex flex-col md:flex-row items-center gap-6 w-full mb-4">
            <div className="shrink-0 relative">
              <div className="absolute -inset-1 bg-[#F59E0B] rounded-full blur opacity-25"></div>
              <img 
                src="seuluna.png" 
                alt="Seu Luna" 
                className="relative w-36 h-36 md:w-44 md:h-44 object-contain"
                onError={(e) => (e.currentTarget.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=SeuLuna&baseColor=f59e0b')}
              />
            </div>
            
            <div className="relative bg-slate-800 border-2 border-slate-700 p-6 rounded-3xl shadow-2xl">
              <div className="hidden md:block absolute left-0 top-1/2 -translate-x-4 -translate-y-2 w-0 h-0 border-t-[10px] border-t-transparent border-r-[15px] border-r-slate-700 border-b-[10px] border-b-transparent"></div>
              <h1 className="text-xl md:text-2xl font-black text-[#F59E0B] mb-2 flex items-center gap-2">
                <FileText size={24} />
                Laudo Automotivo
              </h1>
              <p className="text-slate-300 leading-relaxed font-medium">
                Seja bem-vindo. Forneça os detalhes técnicos do seu veículo e eu gerarei um relatório de diagnóstico completo para você.
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
              <div className="bg-slate-800/80 p-12 rounded-[2.5rem] border-2 border-[#F59E0B]/20 flex flex-col items-center justify-center space-y-6 amber-glow backdrop-blur-sm print:hidden">
                <div className="relative">
                  <Wrench className="animate-bounce text-[#F59E0B]" size={64} />
                  <div className="absolute inset-0 animate-ping bg-[#F59E0B] rounded-full opacity-20"></div>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-2xl font-black text-[#F59E0B] tracking-tight uppercase">Processando Diagnóstico...</p>
                  <p className="text-slate-400 text-sm italic font-medium">"Analisando mecânica de precisão e sistemas eletrônicos..."</p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-900/20 border-2 border-red-500/50 p-6 rounded-3xl flex items-center gap-4 text-red-200 print:hidden">
                <ShieldAlert size={32} className="shrink-0 text-red-500" />
                <p className="font-bold">{error}</p>
              </div>
            )}

            {diagnosis && !isAnalyzing && (
              <div className="bg-slate-800 p-8 md:p-16 rounded-[3rem] border-t-8 border-[#F59E0B] shadow-2xl amber-glow animate-in fade-in zoom-in duration-500 overflow-hidden relative print:bg-white print:text-slate-900 print:border-slate-300 print:p-8 print:shadow-none print:amber-glow-none print:rounded-none print:border-t-0">
                <div className="absolute top-10 right-10 opacity-[0.03] pointer-events-none print:hidden">
                  <Wrench size={400} />
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-12 pb-8 border-b border-slate-700/50 relative z-10 print:border-slate-300">
                  <div className="flex items-center gap-5">
                    <div className="bg-[#F59E0B] p-4 rounded-[1.5rem] shadow-xl shadow-amber-500/20 print:bg-slate-100 print:shadow-none">
                      <FileText className="text-slate-900" size={32} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-[#F59E0B] uppercase tracking-tighter leading-none print:text-slate-900">Laudo Técnico</h2>
                      <span className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1 block">Diagnóstico inteligente do Seu Luna</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-tight">
                      Data de Emissão<br/>
                      <span className="text-slate-300 text-sm print:text-slate-700">{new Date().toLocaleDateString('pt-BR')}</span>
                    </p>
                  </div>
                </div>
                
                <div className="prose prose-invert prose-amber max-w-none relative z-10
                  print:prose-slate
                  prose-headings:text-[#F59E0B] 
                  prose-headings:font-black 
                  prose-headings:uppercase 
                  prose-headings:tracking-tight
                  prose-h1:text-center
                  prose-h1:text-4xl
                  prose-h1:mb-12
                  prose-h2:border-b
                  prose-h2:border-slate-700/50
                  prose-h2:pb-2
                  prose-h2:mt-12
                  prose-h3:text-2xl
                  prose-h3:mt-8
                  prose-p:text-slate-300
                  prose-p:font-medium
                  prose-p:text-justify
                  prose-p:leading-relaxed
                  prose-p:mb-8
                  prose-strong:text-[#F59E0B]
                  prose-li:text-slate-300
                  prose-li:marker:text-[#F59E0B]
                  prose-blockquote:border-[#F59E0B]
                  prose-blockquote:bg-slate-900/50
                  prose-blockquote:py-4
                  prose-blockquote:px-8
                  prose-blockquote:rounded-r-xl
                  print:prose-headings:text-slate-900
                  print:prose-p:text-slate-800
                  print:prose-strong:text-slate-900
                  print:prose-h2:border-slate-300
                  print:prose-blockquote:bg-slate-50">
                  <ReactMarkdown>{diagnosis}</ReactMarkdown>
                </div>
                
                <div className="mt-16 pt-10 border-t border-slate-700/50 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 print:border-slate-300">
                  <div className="flex flex-col gap-1">
                    <span className="text-[#F59E0B] font-black text-sm uppercase tracking-widest print:text-slate-900">Responsabilidade Técnica</span>
                    <p className="text-slate-500 text-[11px] font-bold max-w-md uppercase leading-tight print:text-slate-600">
                      Este laudo é uma análise consultiva gerada por IA. Para sua total segurança, recomendamos a validação física imediata em uma oficina de sua confiança.
                    </p>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto print:hidden">
                    <button 
                      onClick={() => window.print()}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-[#F59E0B] px-8 py-4 rounded-2xl text-sm font-black transition-all border-2 border-slate-600 shadow-lg"
                    >
                      <Printer size={18} /> Imprimir
                    </button>
                    <button 
                      onClick={() => window.location.reload()}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#F59E0B] hover:bg-amber-400 text-slate-900 px-8 py-4 rounded-2xl text-sm font-black transition-all shadow-lg uppercase"
                    >
                      <RotateCcw size={18} /> Nova Consulta
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      
      <footer className="mt-20 border-t border-slate-800 bg-slate-900/50 py-12 print:hidden">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-6 text-center">
          <img src="logo.png" alt="Luna Logo" className="h-10 opacity-30 grayscale" />
          <div className="space-y-1">
            <p className="text-slate-400 text-sm font-black uppercase tracking-widest">
              Luna Autopeças e Serviços Automotivos
            </p>
            <p className="text-slate-600 text-xs font-bold uppercase tracking-wider">
              Sistema de Diagnóstico Seu Luna • Versão 1.2
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
