
import React, { useState } from 'react';
import Login from './components/Login';
import AnamneseForm from './components/AnamneseForm';
import ResultView from './components/ResultView';
import Header from './components/Header';
import { AnamneseForm as IAnamneseForm } from './types';
import { analyzeWithAI } from './services/geminiService';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (password: string) => {
    // Senha atualizada conforme pedido pelo usuário
    if (password === 'luna1989') {
      setIsAuthenticated(true);
    } else {
      alert('Senha incorreta! Verifique com o gerente da Luna Autopeças.');
    }
  };

  const handleAnalyze = async (formData: IAnamneseForm) => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeWithAI(formData);
      setDiagnosis(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 mt-8">
        {!diagnosis ? (
          <AnamneseForm onSubmit={handleAnalyze} isLoading={loading} />
        ) : (
          <ResultView 
            markdown={diagnosis} 
            onBack={() => setDiagnosis(null)} 
          />
        )}
      </main>

      {error && (
        <div className="fixed bottom-4 left-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 shadow-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="font-bold">X</button>
        </div>
      )}
    </div>
  );
};

export default App;
