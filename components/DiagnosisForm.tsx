
import React, { useState } from 'react';
import { DiagnosisFormData } from '../types';
import { Check, Info, Loader2, Car, Activity, Zap, Thermometer, MessageCircle, Wrench, PlusCircle } from 'lucide-react';

interface DiagnosisFormProps {
  onSubmit: (data: DiagnosisFormData) => void;
  isLoading: boolean;
}

interface SectionTitleProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ children, icon }) => (
  <h3 className="text-[#F59E0B] font-black text-lg mb-5 flex items-center gap-2 tracking-wide">
    <div className="bg-[#F59E0B] w-1 h-6 rounded-full"></div>
    {icon}
    <span className="uppercase">{children}</span>
  </h3>
);

interface CheckboxItemProps {
  checked: boolean;
  label: string;
  onClick: () => void;
}

const CheckboxItem: React.FC<CheckboxItemProps> = ({ checked, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-sm font-bold text-left ${
      checked 
        ? 'bg-amber-500/10 border-[#F59E0B] text-amber-500' 
        : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'
    }`}
  >
    <div className={`shrink-0 w-6 h-6 rounded-lg flex items-center justify-center border-2 ${
      checked ? 'bg-[#F59E0B] border-[#F59E0B]' : 'bg-transparent border-slate-700'
    }`}>
      {checked && <Check size={16} className="text-slate-900 stroke-[3]" />}
    </div>
    {label}
  </button>
);

const OthersInput: React.FC<{ value: string; onChange: (val: string) => void; placeholder: string }> = ({ value, onChange, placeholder }) => (
  <div className="mt-4 relative group">
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      <PlusCircle size={18} className="text-slate-600 group-focus-within:text-[#F59E0B] transition-colors" />
    </div>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-slate-900/50 border-2 border-slate-800 rounded-2xl pl-12 pr-5 py-3 text-sm text-white focus:border-[#F59E0B] outline-none transition-all placeholder:text-slate-700"
    />
  </div>
);

const DiagnosisForm: React.FC<DiagnosisFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<DiagnosisFormData>({
    vehicle: {
      plate: '',
      model: '',
      year: '',
      km: '',
      engine: '1.0',
      transmission: 'Manual',
      fuel: 'Flex'
    },
    report: '',
    symptoms: {
      noises: [],
      othersNoises: '',
      sensations: [],
      othersSensations: '',
      dashboard: [],
      othersDashboard: ''
    },
    context: {
      frequency: 'Não sei informar',
      condition: 'Não sei informar',
      othersCondition: '',
      history: [],
      othersHistory: ''
    }
  });

  const handleVehicleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      vehicle: { ...prev.vehicle, [name]: value }
    }));
  };

  const handleToggleSymptom = (category: keyof DiagnosisFormData['symptoms'], value: string) => {
    setFormData(prev => {
      const current = prev.symptoms[category];
      if (!Array.isArray(current)) return prev;
      const next = current.includes(value)
        ? current.filter(i => i !== value)
        : [...current, value];
      return {
        ...prev,
        symptoms: { ...prev.symptoms, [category]: next }
      };
    });
  };

  const handleToggleHistory = (value: string) => {
    setFormData(prev => {
      const current = prev.context.history;
      const next = current.includes(value)
        ? current.filter(i => i !== value)
        : [...current, value];
      return {
        ...prev,
        context: { ...prev.context, history: next }
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vehicle.model) {
      alert("Seu Luna precisa saber a Marca e o Modelo para ajudar!");
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* B. DADOS DO VEÍCULO */}
      <div className="bg-slate-800 p-8 rounded-[2.5rem] border border-slate-700/50 shadow-xl">
        <SectionTitle icon={<Car size={20}/>}>Dados do Veículo</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Marca / Modelo *</label>
            <input
              name="model"
              value={formData.vehicle.model}
              onChange={handleVehicleChange}
              placeholder="Ex: Volkswagen Gol"
              className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-[#F59E0B] outline-none transition-all placeholder:text-slate-700 font-medium"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Placa (Opcional)</label>
            <input
              name="plate"
              value={formData.vehicle.plate}
              onChange={handleVehicleChange}
              placeholder="BRA-2E19"
              className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-[#F59E0B] outline-none transition-all placeholder:text-slate-700 font-mono"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Ano</label>
              <input
                type="number"
                name="year"
                value={formData.vehicle.year}
                onChange={handleVehicleChange}
                placeholder="2020"
                className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-[#F59E0B] outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">KM</label>
              <input
                type="number"
                name="km"
                value={formData.vehicle.km}
                onChange={handleVehicleChange}
                placeholder="50000"
                className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-[#F59E0B] outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Motorização</label>
            <select
              name="engine"
              value={formData.vehicle.engine}
              onChange={handleVehicleChange}
              className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-[#F59E0B] outline-none appearance-none transition-all font-medium"
            >
              <option value="1.0">1.0</option>
              <option value="1.3">1.3</option>
              <option value="1.4">1.4</option>
              <option value="1.5">1.5</option>
              <option value="1.6">1.6</option>
              <option value="1.8">1.8</option>
              <option value="2.0">2.0</option>
              <option value="Acima de 2.0">Acima de 2.0</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Câmbio</label>
            <select
              name="transmission"
              value={formData.vehicle.transmission}
              onChange={handleVehicleChange}
              className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-[#F59E0B] outline-none appearance-none transition-all font-medium"
            >
              <option>Manual</option>
              <option>Automático</option>
              <option>Automatizado</option>
            </select>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Combustível</label>
            <select
              name="fuel"
              value={formData.vehicle.fuel}
              onChange={handleVehicleChange}
              className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-[#F59E0B] outline-none appearance-none transition-all font-medium"
            >
              <option>Flex</option>
              <option>Gasolina</option>
              <option>Etanol</option>
              <option>Diesel</option>
              <option>GNV</option>
            </select>
          </div>
        </div>
      </div>

      {/* C. RELATO DO CLIENTE */}
      <div className="bg-slate-800 p-8 rounded-[2.5rem] border border-slate-700/50 shadow-xl">
        <SectionTitle icon={<MessageCircle size={20}/>}>Relato do Cliente</SectionTitle>
        <textarea
          value={formData.report}
          onChange={(e) => setFormData(prev => ({ ...prev, report: e.target.value }))}
          placeholder="Conte pro Seu Luna o que está acontecendo com o seu carro..."
          className="w-full bg-slate-900 border-2 border-slate-800 rounded-3xl px-6 py-5 text-white focus:border-[#F59E0B] outline-none transition-all min-h-[140px] resize-none placeholder:text-slate-700 font-medium leading-relaxed"
        />
      </div>

      {/* D. CHECKLIST DE SINTOMAS */}
      <div className="bg-slate-800 p-8 rounded-[2.5rem] border border-slate-700/50 shadow-xl space-y-10">
        <div>
          <SectionTitle icon={<Activity size={20}/>}>Barulhos</SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {['Estalo/Tec-Tec', 'Ronco/Zumbido', 'Assobio', 'Batida Seca', 'Grilo'].map(s => (
              <CheckboxItem 
                key={s} 
                label={s} 
                checked={formData.symptoms.noises.includes(s)} 
                onClick={() => handleToggleSymptom('noises', s)} 
              />
            ))}
          </div>
          <OthersInput 
            value={formData.symptoms.othersNoises || ''} 
            onChange={(val) => setFormData(p => ({ ...p, symptoms: { ...p.symptoms, othersNoises: val }}))}
            placeholder="Algum outro barulho específico?" 
          />
        </div>

        <div>
          <SectionTitle icon={<Zap size={20}/>}>Sensações</SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {['Vibração', 'Motor Fraco', 'Falhando', 'Partida Difícil', 'Trancos Câmbio', 'Direção Puxando', 'Freio Ruim'].map(s => (
              <CheckboxItem 
                key={s} 
                label={s} 
                checked={formData.symptoms.sensations.includes(s)} 
                onClick={() => handleToggleSymptom('sensations', s)} 
              />
            ))}
          </div>
          <OthersInput 
            value={formData.symptoms.othersSensations || ''} 
            onChange={(val) => setFormData(p => ({ ...p, symptoms: { ...p.symptoms, othersSensations: val }}))}
            placeholder="Alguma outra sensação estranha?" 
          />
        </div>

        <div>
          <SectionTitle icon={<Thermometer size={20}/>}>Painel / Visuais</SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {['Luz Injeção', 'Luz Bateria', 'Luz Óleo', 'Luz Temperatura', 'Fumaça', 'Vazamento'].map(s => (
              <CheckboxItem 
                key={s} 
                label={s} 
                checked={formData.symptoms.dashboard.includes(s)} 
                onClick={() => handleToggleSymptom('dashboard', s)} 
              />
            ))}
          </div>
          <OthersInput 
            value={formData.symptoms.othersDashboard || ''} 
            onChange={(val) => setFormData(p => ({ ...p, symptoms: { ...p.symptoms, othersDashboard: val }}))}
            placeholder="Outra luz ou detalhe visual?" 
          />
        </div>
      </div>

      {/* E. CONTEXTO (GATILHOS) */}
      <div className="bg-slate-800 p-8 rounded-[2.5rem] border border-slate-700/50 shadow-xl">
        <SectionTitle icon={<Info size={20}/>}>Contexto (Gatilhos)</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Frequência</label>
            <div className="flex flex-wrap bg-slate-900 p-1.5 rounded-2xl border-2 border-slate-800 gap-1">
              {['Sempre', 'Às Vezes', 'Uma vez', 'Não sei informar'].map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, context: { ...prev.context, frequency: opt } }))}
                  className={`flex-1 min-w-[100px] py-3 rounded-xl text-xs font-black transition-all ${
                    formData.context.frequency === opt ? 'bg-[#F59E0B] text-slate-900 shadow-lg' : 'text-slate-500 hover:text-slate-400'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Condição</label>
            <select
              value={formData.context.condition}
              onChange={(e) => setFormData(prev => ({ ...prev, context: { ...prev.context, condition: e.target.value } }))}
              className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-[#F59E0B] outline-none appearance-none transition-all font-medium"
            >
              <option>Não sei informar</option>
              <option>Frio</option>
              <option>Quente</option>
              <option>Velocidade</option>
              <option>Buracos</option>
            </select>
            <OthersInput 
              value={formData.context.othersCondition || ''} 
              onChange={(val) => setFormData(p => ({ ...p, context: { ...p.context, othersCondition: val }}))}
              placeholder="Alguma outra condição específica?" 
            />
          </div>
          <div className="md:col-span-2 space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block">Histórico Recente</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {['Lavagem', 'Abastecimento', 'Enchente', 'Bateria', 'Acessório'].map(h => (
                <CheckboxItem 
                  key={h} 
                  label={h} 
                  checked={formData.context.history.includes(h)} 
                  onClick={() => handleToggleHistory(h)} 
                />
              ))}
            </div>
            <OthersInput 
              value={formData.context.othersHistory || ''} 
              onChange={(val) => setFormData(p => ({ ...p, context: { ...p.context, othersHistory: val }}))}
              placeholder="Outro evento recente (ex: troca de óleo, oficina...)" 
            />
          </div>
        </div>
      </div>

      {/* F. BOTÃO DE AÇÃO */}
      <div className="pt-6">
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-6 px-10 rounded-3xl bg-[#F59E0B] text-[#1E293B] font-black text-2xl shadow-2xl shadow-amber-500/20 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-4 group ${
            isLoading ? 'opacity-80 cursor-not-allowed' : 'hover:bg-amber-400'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={28} />
              ANALISANDO...
            </>
          ) : (
            <>
              ANALISAR COM O SEU LUNA
              <Wrench size={28} className="group-hover:rotate-12 transition-transform" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default DiagnosisForm;
