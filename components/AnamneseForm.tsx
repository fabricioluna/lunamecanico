
import React, { useState } from 'react';
import { AnamneseForm as IAnamneseForm } from '../types';

const InputLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="block text-xs font-black text-slate-950 mb-2 uppercase tracking-[0.15em]">{children}</label>
);

interface CheckboxItemProps {
  category: string;
  label: string;
  value: string;
  checked: boolean;
  onChange: () => void;
}

const CheckboxItem: React.FC<CheckboxItemProps> = ({ label, checked, onChange }) => {
  return (
    <label className={`flex items-center p-4 rounded-2xl border-2 transition-all cursor-pointer ${checked ? 'bg-blue-50 border-blue-700 text-blue-950 shadow-md ring-2 ring-blue-700/20' : 'bg-white border-slate-200 text-slate-950 hover:border-slate-400 shadow-sm'}`}>
      <input 
        type="checkbox" 
        className="hidden" 
        checked={checked} 
        onChange={onChange} 
      />
      <span className={`w-6 h-6 rounded-lg border-2 mr-3 flex items-center justify-center transition-all ${checked ? 'bg-blue-700 border-blue-700' : 'border-slate-300 bg-gray-50'}`}>
        {checked && <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>}
      </span>
      <span className="text-sm font-black uppercase tracking-tight">{label}</span>
    </label>
  );
};

interface Props {
  onSubmit: (data: IAnamneseForm) => void;
  isLoading: boolean;
}

const AnamneseForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<IAnamneseForm>({
    veiculo: { placa: '', modelo: '', ano: '', km: '', motor: '1.0', cambio: 'Manual', combustivel: 'Flex' },
    relate: '',
    relato: '',
    sintomas: { barulhos: [], sensacoes: [], painel: [] },
    contexto: { frequencia: 'Acontece SEMPRE', condicao: [], historico: [] }
  });

  const handleCheckboxChange = (category: keyof IAnamneseForm['sintomas'] | 'condicao' | 'historico', value: string) => {
    setFormData(prev => {
      const isSintoma = ['barulhos', 'sensacoes', 'painel'].includes(category);
      if (isSintoma) {
        const cat = category as keyof IAnamneseForm['sintomas'];
        const current = prev.sintomas[cat];
        const updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
        return { ...prev, sintomas: { ...prev.sintomas, [cat]: updated } };
      } else {
        const cat = category as 'condicao' | 'historico';
        const current = prev.contexto[cat];
        const updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
        return { ...prev, contexto: { ...prev.contexto, [cat]: updated } };
      }
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.veiculo.modelo || !formData.relato) {
      alert('Seu Luna avisa: Preencha o Modelo e o Relato antes de analisar!');
      return;
    }
    onSubmit(formData);
  };

  const isChecked = (category: keyof IAnamneseForm['sintomas'] | 'condicao' | 'historico', value: string) => {
    const isSintoma = ['barulhos', 'sensacoes', 'painel'].includes(category);
    if (isSintoma) {
      return formData.sintomas[category as keyof IAnamneseForm['sintomas']].includes(value);
    } else {
      return formData.contexto[category as 'condicao' | 'historico'].includes(value);
    }
  };

  const inputClass = "w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-700/10 outline-none text-slate-950 font-black text-lg placeholder:text-slate-300 transition-all shadow-inner";

  return (
    <form onSubmit={handleFormSubmit} className="space-y-10 animate-fade-in pb-20">
      <section className="bg-white p-8 rounded-[2.5rem] shadow-xl border-t-8 border-amber-500">
        <h3 className="text-2xl font-brand font-black text-slate-950 mb-8 flex items-center gap-4">
          <span className="w-10 h-10 bg-slate-950 text-amber-500 rounded-xl flex items-center justify-center text-lg font-black shadow-lg italic">01</span>
          DADOS DO VEÍCULO
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <InputLabel>Placa</InputLabel>
            <input 
              className={`${inputClass} font-mono uppercase text-center tracking-widest`} 
              placeholder="ABC-1234"
              value={formData.veiculo.placa}
              onChange={e => setFormData(prev => ({...prev, veiculo: {...prev.veiculo, placa: e.target.value}}))}
            />
          </div>
          <div className="lg:col-span-2">
            <InputLabel>Modelo e Versão</InputLabel>
            <input 
              required
              className={inputClass} 
              placeholder="Ex: Fiat Toro 1.8 Freedom"
              value={formData.veiculo.modelo}
              onChange={e => setFormData(prev => ({...prev, veiculo: {...prev.veiculo, modelo: e.target.value}}))}
            />
          </div>
          <div>
            <InputLabel>KM Atual</InputLabel>
            <input 
              type="number" 
              className={inputClass} 
              placeholder="KM"
              value={formData.veiculo.km}
              onChange={e => setFormData(prev => ({...prev, veiculo: {...prev.veiculo, km: e.target.value}}))}
            />
          </div>
          <div>
            <InputLabel>Ano</InputLabel>
            <input 
              type="number" 
              className={inputClass} 
              placeholder="Ano"
              value={formData.veiculo.ano}
              onChange={e => setFormData(prev => ({...prev, veiculo: {...prev.veiculo, ano: e.target.value}}))}
            />
          </div>
          <div>
            <InputLabel>Motorização</InputLabel>
            <select 
              className={inputClass}
              value={formData.veiculo.motor}
              onChange={e => setFormData(prev => ({...prev, veiculo: {...prev.veiculo, motor: e.target.value}}))}
            >
              {['1.0', '1.3', '1.4', '1.6', '1.8', '2.0+', 'Turbo', 'Diesel'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div>
            <InputLabel>Câmbio</InputLabel>
            <select 
              className={inputClass}
              value={formData.veiculo.cambio}
              onChange={e => setFormData(prev => ({...prev, veiculo: {...prev.veiculo, cambio: e.target.value}}))}
            >
              {['Manual', 'Automático/CVT', 'Automatizado'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div>
            <InputLabel>Combustível</InputLabel>
            <select 
              className={inputClass}
              value={formData.veiculo.combustivel}
              onChange={e => setFormData(prev => ({...prev, veiculo: {...prev.veiculo, combustivel: e.target.value}}))}
            >
              {['Flex', 'Gasolina', 'Etanol', 'Diesel', 'GNV'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>
      </section>

      <section className="bg-white p-8 rounded-[2.5rem] shadow-xl border-t-8 border-amber-500">
        <h3 className="text-2xl font-brand font-black text-slate-950 mb-8 flex items-center gap-4">
          <span className="w-10 h-10 bg-slate-950 text-amber-500 rounded-xl flex items-center justify-center text-lg font-black shadow-lg italic">02</span>
          O QUE O CLIENTE DIZ?
        </h3>
        <textarea 
          required
          rows={5}
          className={`${inputClass} resize-none text-xl leading-relaxed`} 
          placeholder="Descreva o problema detalhadamente como o cliente explicou..."
          value={formData.relato}
          onChange={e => setFormData(prev => ({...prev, relato: e.target.value}))}
        />
      </section>

      <section className="bg-white p-8 rounded-[2.5rem] shadow-xl border-t-8 border-amber-500">
        <h3 className="text-2xl font-brand font-black text-slate-950 mb-8 flex items-center gap-4">
          <span className="w-10 h-10 bg-slate-950 text-amber-500 rounded-xl flex items-center justify-center text-lg font-black shadow-lg italic">03</span>
          CHECKLIST DE SINTOMAS
        </h3>
        
        <div className="space-y-10">
          <div>
            <h4 className="font-black text-xs text-slate-500 mb-4 uppercase tracking-[0.2em] border-l-8 border-amber-500 pl-4">👂 Sons e Ruídos</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {['Estalo/Tec-Tec', 'Ronco/Zumbido', 'Assobio/Chiado', 'Batida Seca', 'Grilo/Rangido', 'Detonação (Pino)'].map(s => (
                <CheckboxItem 
                  key={s} 
                  category="barulhos" 
                  label={s} 
                  value={s} 
                  checked={isChecked('barulhos', s)}
                  onChange={() => handleCheckboxChange('barulhos', s)}
                />
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-black text-xs text-slate-500 mb-4 uppercase tracking-[0.2em] border-l-8 border-amber-500 pl-4">✋ Comportamento e Sensação</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {['Vibração', 'Motor Fraco/Sem Força', 'Motor Falhando', 'Partida Difícil', 'Trancos no Câmbio', 'Direção Puxando', 'Freio Ruim'].map(s => (
                <CheckboxItem 
                  key={s} 
                  category="sensacoes" 
                  label={s} 
                  value={s} 
                  checked={isChecked('sensacoes', s)}
                  onChange={() => handleCheckboxChange('sensacoes', s)}
                />
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-black text-xs text-slate-500 mb-4 uppercase tracking-[0.2em] border-l-8 border-amber-500 pl-4">👁️ Painel e Visual</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {['Luz Injeção', 'Luz Bateria', 'Luz Óleo', 'Luz Temperatura', 'Fumaça no Escape', 'Cheiro Queimado', 'Vazamento'].map(s => (
                <CheckboxItem 
                  key={s} 
                  category="painel" 
                  label={s} 
                  value={s} 
                  checked={isChecked('painel', s)}
                  onChange={() => handleCheckboxChange('painel', s)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white p-8 rounded-[2.5rem] shadow-xl border-t-8 border-amber-500">
        <h3 className="text-2xl font-brand font-black text-slate-950 mb-8 flex items-center gap-4">
          <span className="w-10 h-10 bg-slate-950 text-amber-500 rounded-xl flex items-center justify-center text-lg font-black shadow-lg italic">04</span>
          CONTEXTO E HISTÓRICO
        </h3>
        
        <div className="space-y-8">
          <div>
            <InputLabel>Qual a Frequência?</InputLabel>
            <select 
              className={`${inputClass} max-w-sm`}
              value={formData.contexto.frequencia}
              onChange={e => setFormData(prev => ({...prev, contexto: {...prev.contexto, frequencia: e.target.value}}))}
            >
              <option value="Acontece SEMPRE">Sempre acontece</option>
              <option value="Acontece AS VEZES/Intermitente">Acontece às vezes (Intermitente)</option>
            </select>
          </div>
          
          <div>
            <h4 className="font-black text-xs text-slate-500 mb-4 uppercase tracking-[0.2em] border-l-8 border-amber-500 pl-4">Quando o problema se manifesta?</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {['Só Frio', 'Só Quente', 'Alta Velocidade', 'Baixa Velocidade', 'Ao Frear', 'Ao Virar', 'Em Buracos'].map(s => (
                <CheckboxItem 
                  key={s} 
                  category="condicao" 
                  label={s} 
                  value={s} 
                  checked={isChecked('condicao', s)}
                  onChange={() => handleCheckboxChange('condicao', s)}
                />
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <h4 className="font-black text-xs text-slate-500 mb-4 uppercase tracking-[0.2em] border-l-8 border-amber-500 pl-4">Houve algo recente no veículo?</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {['Lavagem de Motor', 'Abastecimento Diferente', 'Enchente/Buraco', 'Troca Bateria', 'Instalação Acessório', 'Carro Parado há dias'].map(s => (
                <CheckboxItem 
                  key={s} 
                  category="historico" 
                  label={s} 
                  value={s} 
                  checked={isChecked('historico', s)}
                  onChange={() => handleCheckboxChange('historico', s)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Botão Flutuante de Ação */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-50">
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-6 rounded-[2rem] font-black text-2xl flex items-center justify-center gap-4 transition-all shadow-2xl border-b-8 ${isLoading ? 'bg-slate-400 border-slate-500 cursor-not-allowed text-white' : 'bg-blue-700 hover:bg-blue-800 border-blue-900 text-white active:scale-95'}`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-8 w-8 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>ANALISANDO...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.040L3 6.247a11.955 11.955 0 003.858 18.255 12.078 12.078 0 0010.284 0 11.955 11.955 0 003.858-18.255l-1.24-.721z" />
              </svg>
              <span>ANALISAR COM IA</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AnamneseForm;
