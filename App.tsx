
import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import DiagnosisForm from './components/DiagnosisForm';
import { DiagnosisFormData } from './types';
import { analyzeVehicle } from './services/geminiService';
import ReactMarkdown from 'react-markdown';
import { Wrench, Loader2, LogOut, MessageCircle } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (password: string) => {
    // Nova senha definida: luna1989
    if (password === 'luna1989') {
      setIsAuthenticated(true);
      setError(null);
    } else {
      // Mensagem genérica para não recomendar a senha correta
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
      {/* Header Fixo */}
      <header className="sticky top-0 z-50 bg-[#1E293B]/95 backdrop-blur-md border-b border-slate-700/50 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
             <img src="logo.png" alt="Luna Logo" className="h-10" onError={(e) => (e.currentTarget.style.display = 'none')} />
             <span className="font-bold text-[#F59E0B] tracking-tighter text-xl">LUNA AUTOPEÇAS</span>
          </div>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full text-slate-400 hover:text-[#F59E0B] hover:bg-slate-700 transition-all text-sm font-medium"
          >
            Sair <LogOut size={16} />
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-8">
        {/* Personagem e Boas-vindas */}
        <div className="flex flex-col items-center mb-10">
          <img 
            src="logo.png" 
            alt="Luna Autopeças" 
            className="w-48 mb-10 drop-shadow-2xl" 
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
          
          <div className="relative flex flex-col md:flex-row items-center gap-6 w-full mb-4">
            {/* Mascote Seu Luna */}
            <div className="shrink-0 relative">
              <div className="absolute -inset-1 bg-[#F59E0B] rounded-full blur opacity-25"></div>
              <img 
                src="seuluna.png" 
                alt="Seu Luna" 
                className="relative w-36 h-36 md:w-44 md:h-44 object-contain"
                onError={(e) => (e.currentTarget.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=SeuLuna&baseColor=f59e0b')}
              />
            </div>
            
            {/* Balão de Fala */}
            <div className="relative bg-slate-800 border-2 border-slate-700 p-6 rounded-3xl shadow-2xl">
              <div className="hidden md:block absolute left-0 top-1/2 -translate-x-4 -translate-y-2 w-0 h-0 border-t-[10px] border-t-transparent border-r-[15px] border-r-slate-700 border-b-[10px] border-b-transparent"></div>
              <div className="md:hidden absolute left-1/2 -top-4 -translate-x-2 w-0 h-0 border-l-[10px] border-l-transparent border-b-[15px] border-b-slate-700 border-r-[10px] border-r-transparent"></div>
              
              <h1 className="text-xl md:text-2xl font-bold text-[#F59E0B] mb-2 flex items-center gap-2">
                <MessageCircle size={24} />
                Olá! Sou o Seu Luna.
              </h1>
              <p className="text-slate-300 leading-relaxed">
                Preencha os dados abaixo que eu vou te ajudar a descobrir o problema do seu carro agora mesmo!
              </p>
            </div>
          </div>
        </div>

        <DiagnosisForm onSubmit={handleAnalyze} isLoading={isAnalyzing} />

        {/* Área de Resultado */}
        {(isAnalyzing || diagnosis || error) && (
          <div id="diagnosis-result" className="mt-12 space-y-6">
            {isAnalyzing && (
              <div className="bg-slate-800/50 p-12 rounded-3xl border border-[#F59E0B]/30 flex flex-col items-center justify-center space-y-4 amber-glow">
                <div className="relative">
                  <Wrench className="animate-bounce text-[#F59E0B]" size={48} />
                  <Loader2 className="absolute -bottom-2 -right-2 animate-spin text-[#F59E0B]" size={24} />
                </div>
                <p className="text-xl font-bold text-[#F59E0B]">Seu Luna está analisando...</p>
                <p className="text-slate-400 text-sm text-center italic">"Deixa eu dar uma olhada nesse motor..."</p>
              </div>
            )}

            {error && !isAuthenticated && (
              <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-2xl text-red-400 flex items-center gap-3">
                <div className="bg-red-500 p-2 rounded-lg text-white">!</div>
                {error}
              </div>
            )}

            {diagnosis && !isAnalyzing && (
              <div className="bg-slate-800 p-8 md:p-10 rounded-3xl border-l-8 border-[#F59E0B] shadow-2xl amber-glow">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-[#F59E0B] p-3 rounded-2xl shadow-lg shadow-amber-500/20">
                    <Wrench className="text-slate-900" size={28} />
                  </div>
                  <h2 className="text-2xl font-black text-[#F59E0B] uppercase tracking-tight">Diagnóstico do Seu Luna</h2>
                </div>
                
                <div className="prose prose-invert prose-amber max-w-none prose-headings:text-[#F59E0B] prose-strong:text-amber-200">
                  <ReactMarkdown>{diagnosis}</ReactMarkdown>
                </div>
                
                <div className="mt-10 pt-8 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-3 text-slate-400 text-xs italic bg-slate-900/50 px-4 py-2 rounded-lg">
                    <span>⚠️ Atenção: Este é um auxílio virtual da Luna Autopeças.</span>
                  </div>
                  <button 
                    onClick={() => window.print()}
                    className="bg-slate-700 hover:bg-slate-600 text-[#F59E0B] px-6 py-2 rounded-full text-sm font-bold transition-all border border-slate-600"
                  >
                    Imprimir Diagnóstico
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      
      <footer className="mt-20 border-t border-slate-800 bg-slate-900/50 py-10">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-4 text-center">
          <img src="logo.png" alt="Luna Logo" className="h-8 opacity-50 grayscale" />
          <p className="text-slate-500 text-sm font-medium tracking-wide">
            @ 2026 Luna Autopeças e Serviços - Desenvolvido por Fabrício Luna
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
