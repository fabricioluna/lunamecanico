
import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import Header from './components/Header';
import DiagnosisForm from './components/DiagnosisForm';
import DiagnosisResult from './components/DiagnosisResult';
import { FormData } from './types';
import { generateDiagnosis } from './services/geminiService';

const INITIAL_FORM: FormData = {
  veiculo: { marcaModelo: '', ano: '', km: '', motorizacao: '', cambio: '', combustivel: '' },
  relato: '',
  sintomas: { barulhos: [], sensacoes: [], visual: [] },
  contexto: { frequencia: '', condicoes: [], historico: [] }
};

const App: React.FC = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [data, setData] = useState<FormData>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  if (!isAuth) return <LoginForm onLogin={() => setIsAuth(true)} />;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const diagnosis = await generateDiagnosis(data);
      setResult(diagnosis);
      window.scrollTo(0, 0);
    } catch (err) {
      alert("Erro ao gerar diagnóstico. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header onLogout={() => { setIsAuth(false); setResult(null); setData(INITIAL_FORM); }} />
      <main className="flex-grow">
        {result ? (
          <DiagnosisResult 
            content={result} 
            formData={data} 
            onBack={() => setResult(null)} 
          />
        ) : (
          <DiagnosisForm 
            data={data} 
            onChange={setData} 
            onSubmit={handleSubmit} 
            loading={loading} 
          />
        )}
      </main>
      <footer className="py-6 text-center text-slate-600 text-[10px] uppercase font-bold tracking-widest no-print">
        Luna Autopeças e Serviços © {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default App;
