
import React from 'react';
import { FormData } from '../types';
import { Car, Tool, Activity, HelpCircle, History } from 'lucide-react';

interface DiagnosisFormProps {
  data: FormData;
  onChange: (data: FormData) => void;
  onSubmit: () => void;
  loading: boolean;
}

const DiagnosisForm: React.FC<DiagnosisFormProps> = ({ data, onChange, onSubmit, loading }) => {
  const updateVeiculo = (field: keyof FormData['veiculo'], value: string) => {
    onChange({ ...data, veiculo: { ...data.veiculo, [field]: value } });
  };

  const toggleSintoma = (category: keyof FormData['sintomas'], value: string) => {
    const current = data.sintomas[category];
    const updated = current.includes(value)
      ? current.filter(i => i !== value)
      : [...current, value];
    onChange({ ...data, sintomas: { ...data.sintomas, [category]: updated } });
  };

  const toggleCondicao = (value: string) => {
    const current = data.contexto.condicoes;
    const updated = current.includes(value)
      ? current.filter(i => i !== value)
      : [...current, value];
    onChange({ ...data, contexto: { ...data.contexto, condicoes: updated } });
  };

  const toggleHistorico = (value: string) => {
    const current = data.contexto.historico;
    const updated = current.includes(value)
      ? current.filter(i => i !== value)
      : [...current, value];
    onChange({ ...data, contexto: { ...data.contexto, historico: updated } });
  };

  const inputClass = "w-full bg-slate-800 border-slate-700 rounded-lg py-2 px-3 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none border transition-all";
  const labelClass = "block text-slate-400 text-sm font-medium mb-1.5";
  const sectionClass = "bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6 shadow-sm";
  const checkboxClass = "flex items-center gap-2 cursor-pointer group";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* GRUPO A: DADOS DO VEÍCULO */}
      <section className={sectionClass}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-900/30 text-blue-400 rounded-lg"><Car size={20} /></div>
          <h2 className="text-xl font-bold text-white uppercase tracking-tight">Grupo A: Dados do Veículo</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Marca/Modelo</label>
            <input 
              type="text" 
              className={inputClass}
              placeholder="Ex: Honda Civic"
              value={data.veiculo.marcaModelo}
              onChange={(e) => updateVeiculo('marcaModelo', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Ano</label>
              <input 
                type="number" 
                className={inputClass}
                placeholder="Ex: 2018"
                value={data.veiculo.ano}
                onChange={(e) => updateVeiculo('ano', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>KM Atual</label>
              <input 
                type="number" 
                className={inputClass}
                placeholder="Ex: 85000"
                value={data.veiculo.km}
                onChange={(e) => updateVeiculo('km', e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Motorização</label>
            <select 
              className={inputClass}
              value={data.veiculo.motorizacao}
              onChange={(e) => updateVeiculo('motorizacao', e.target.value)}
            >
              <option value="">Selecione...</option>
              {['1.0', '1.3', '1.4', '1.5', '1.6', '1.8', '2.0', 'Turbo', 'Diesel'].map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Câmbio</label>
              <select 
                className={inputClass}
                value={data.veiculo.cambio}
                onChange={(e) => updateVeiculo('cambio', e.target.value)}
              >
                <option value="">Selecione...</option>
                {['Manual', 'Automático/CVT', 'Automatizado'].map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Combustível</label>
              <select 
                className={inputClass}
                value={data.veiculo.combustivel}
                onChange={(e) => updateVeiculo('combustivel', e.target.value)}
              >
                <option value="">Selecione...</option>
                {['Gasolina', 'Etanol', 'Flex Misturado', 'Diesel', 'GNV'].map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* GRUPO B: RELATO */}
      <section className={sectionClass}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-yellow-900/30 text-yellow-400 rounded-lg"><HelpCircle size={20} /></div>
          <h2 className="text-xl font-bold text-white uppercase tracking-tight">Grupo B: Relato</h2>
        </div>
        <label className={labelClass}>O que está acontecendo?</label>
        <textarea 
          rows={4}
          className={`${inputClass} resize-none`}
          placeholder="Descreva em detalhes o comportamento do veículo..."
          value={data.relato}
          onChange={(e) => onChange({...data, relato: e.target.value})}
        />
      </section>

      {/* GRUPO C: SINTOMAS */}
      <section className={sectionClass}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-900/30 text-red-400 rounded-lg"><Activity size={20} /></div>
          <h2 className="text-xl font-bold text-white uppercase tracking-tight">Grupo C: Sintomas</h2>
        </div>

        <div className="space-y-8">
          {/* Barulhos */}
          <div>
            <h3 className="text-slate-300 font-bold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span> Barulhos
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {['Sem barulho', 'Estalo/Tec-Tec', 'Ronco/Zumbido', 'Assobio/Chiado', 'Batida Seca', 'Grilo/Rangido', 'Detonação (Batida de pino)'].map(s => (
                <label key={s} className={checkboxClass}>
                  <input 
                    type="checkbox" 
                    checked={data.sintomas.barulhos.includes(s)}
                    onChange={() => toggleSintoma('barulhos', s)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-yellow-500 focus:ring-yellow-500"
                  />
                  <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">{s}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sensações */}
          <div>
            <h3 className="text-slate-300 font-bold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span> Sensações
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {['Vibração', 'Motor Fraco', 'Motor Falhando', 'Partida Difícil', 'Trancos Câmbio', 'Direção Puxando/Dura', 'Freio Ruim'].map(s => (
                <label key={s} className={checkboxClass}>
                  <input 
                    type="checkbox" 
                    checked={data.sintomas.sensacoes.includes(s)}
                    onChange={() => toggleSintoma('sensacoes', s)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-yellow-500 focus:ring-yellow-500"
                  />
                  <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">{s}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Visual/Alertas */}
          <div>
            <h3 className="text-slate-300 font-bold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span> Visual/Alertas
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {['Luz Injeção', 'Luz Bateria', 'Luz Óleo', 'Luz Temperatura', 'Fumaça no Escape', 'Cheiro Queimado/Combustível', 'Vazamento'].map(s => (
                <label key={s} className={checkboxClass}>
                  <input 
                    type="checkbox" 
                    checked={data.sintomas.visual.includes(s)}
                    onChange={() => toggleSintoma('visual', s)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-yellow-500 focus:ring-yellow-500"
                  />
                  <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">{s}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GRUPO D: CONTEXTO */}
      <section className={sectionClass}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-900/30 text-green-400 rounded-lg"><History size={20} /></div>
          <h2 className="text-xl font-bold text-white uppercase tracking-tight">Grupo D: Contexto</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className={labelClass}>Frequência</label>
            <select 
              className={inputClass}
              value={data.contexto.frequencia}
              onChange={(e) => onChange({...data, contexto: {...data.contexto, frequencia: e.target.value}})}
            >
              <option value="">Selecione...</option>
              <option value="Acontece SEMPRE">Acontece SEMPRE</option>
              <option value="Acontece AS VEZES">Acontece AS VEZES</option>
            </select>

            <div className="mt-6">
              <label className={labelClass}>Condição</label>
              <div className="grid grid-cols-2 gap-2">
                {['Só Frio', 'Só Quente', 'Alta Velocidade', 'Baixa Velocidade', 'Ao Frear', 'Ao Virar', 'Em Buracos'].map(c => (
                  <label key={c} className={checkboxClass}>
                    <input 
                      type="checkbox" 
                      checked={data.contexto.condicoes.includes(c)}
                      onChange={() => toggleCondicao(c)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-yellow-500 focus:ring-yellow-500"
                    />
                    <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">{c}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Histórico Recente</label>
            <div className="grid grid-cols-1 gap-2">
              {['Lavagem Motor', 'Abastecimento Diferente', 'Buraco/Enchente', 'Troca Bateria', 'Instalação Acessório', 'Carro Parado'].map(h => (
                <label key={h} className={checkboxClass}>
                  <input 
                    type="checkbox" 
                    checked={data.contexto.historico.includes(h)}
                    onChange={() => toggleHistorico(h)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-yellow-500 focus:ring-yellow-500"
                  />
                  <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">{h}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BOTÃO DE AÇÃO */}
      <div className="sticky bottom-6 mt-12 px-4 flex justify-center">
        <button
          onClick={onSubmit}
          disabled={loading || !data.veiculo.marcaModelo || !data.relato}
          className={`
            w-full max-w-md py-4 px-8 rounded-2xl font-bold text-lg uppercase tracking-wider shadow-2xl transition-all
            ${loading 
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
              : 'bg-yellow-500 hover:bg-yellow-400 text-slate-900 shadow-yellow-500/30 hover:-translate-y-1 active:scale-95'
            }
          `}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
              Processando Diagnóstico...
            </div>
          ) : (
            "Gerar Diagnóstico Profissional"
          )}
        </button>
      </div>
    </div>
  );
};

export default DiagnosisForm;
