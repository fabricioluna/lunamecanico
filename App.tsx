
import React, { useState } from 'react';
import { VehicleData, Symptoms, DiagnosticResult } from './types';
import CheckboxGroup from './components/CheckboxGroup';
import { generateDiagnosis } from './services/geminiService';
import { marked } from 'marked';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosticResult | null>(null);

  const [vehicle, setVehicle] = useState<VehicleData>({
    modelo: '', ano: '', motor: '', km: '', cambio: 'Manual'
  });

  const [symptoms, setSymptoms] = useState<Symptoms>({
    outroGrupo2: '', outroGrupo3: '', outroGrupo4: '', outroGrupo5: '',
    outroGrupo6: '', outroGrupo7: '', outroGrupo8: '', outroGrupo9: '',
    luzes: [], motorComportamento: [], corFumaca: '',
    direcaoSuspensao: [], freios: [], 
    ruidosTipo: [], ruidosOrigem: [], especificacaoRoda: '',
    condicoesTemperatura: [], condicoesVelocidade: [], condicoesClima: [],
    historicoRecente: [], manutencaoRecenteDetalhe: '',
    cheiros: [], vazamentos: [], fluidosNivel: [], 
    transmissao: [],
    idadeBateria: '', eletricaPartida: [], eletricaAcessorios: [],
    frequencia: 'Intermitente (Vai e volta)', relato: ''
  });

  const toggle = (field: keyof Symptoms, value: string) => {
    setSymptoms(prev => {
      const current = prev[field] as string[];
      return current.includes(value) 
        ? { ...prev, [field]: current.filter(v => v !== value) }
        : { ...prev, [field]: [...current, value] };
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'luna1989') {
      setIsLoggedIn(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleAnalyse = async () => {
    if (!vehicle.modelo) return alert("Informe o modelo do veículo.");
    setLoading(true);
    try {
      const result = await generateDiagnosis(vehicle, symptoms);
      setDiagnosis({ text: result, timestamp: Date.now() });
      setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0f1d]">
        <div className="w-full max-w-md glass-card rounded-3xl p-8 shadow-2xl relative border border-slate-700/50">
          <div className="mb-8 flex flex-col items-center">
            <div className="w-40 h-40 mb-6 bg-slate-800 rounded-full border-4 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)] overflow-hidden">
              <img src="seuluna.png" alt="Seu Luna" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-4xl font-black text-amber-500 tracking-tighter">Seu Luna</h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em] mt-2">Mecânico Virtual</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" placeholder="Senha de Acesso"
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-4 px-4 text-white focus:border-amber-500 outline-none"
            />
            <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-black py-4 rounded-xl transition-all active:scale-95 shadow-lg">
              ACESSAR OFICINA
            </button>
            {loginError && <p className="text-red-400 text-center text-sm font-bold">Senha incorreta!</p>}
          </form>
        </div>
      </div>
    );
  }

  const InputOutroGrupo = ({ value, onChange, groupTitle }: { value: string, onChange: (v: string) => void, groupTitle: string }) => (
    <div className="mt-4 pt-4 border-t border-slate-700/30">
      <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Campo Outro (Opcional)</label>
      <input 
        type="text" 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        placeholder={`Outras informações sobre ${groupTitle}...`}
        className="w-full bg-slate-900/50 p-3 rounded-xl border border-slate-700/50 text-white text-xs focus:border-amber-500 outline-none transition-all"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 py-3">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
          <img src="logo2.png" alt="Luna Logo" className="h-10 object-contain" />
          <button onClick={() => setIsLoggedIn(false)} className="text-slate-500 hover:text-white"><i className="fas fa-power-off fa-lg"></i></button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Intro */}
        <div className="flex items-center gap-6 mb-12 bg-slate-800/50 p-6 rounded-3xl border border-slate-700">
          <div className="w-20 h-20 shrink-0 rounded-full border-2 border-amber-500 overflow-hidden shadow-lg">
            <img src="seuluna.png" alt="Seu Luna Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="relative">
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-800/50 border-l border-b border-slate-700 rotate-45"></div>
            <p className="text-sm font-medium leading-relaxed">
              "Opa! Sou o <span className="text-amber-500 font-bold">Seu Luna</span>. Me conta tudo o que tá acontecendo com o seu bruto. Quanto mais detalhe você me der, mais preciso eu serei!"
            </p>
          </div>
        </div>

        {/* 1. Identificação */}
        <section className="glass-card rounded-3xl p-6 mb-6 border-l-4 border-l-amber-500">
          <h2 className="text-amber-500 font-black text-sm uppercase mb-6 flex items-center gap-2">
            <i className="fas fa-car"></i> 1. Identificação do Veículo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Marca/Modelo" value={vehicle.modelo} onChange={e=>setVehicle({...vehicle, modelo: e.target.value})} className="bg-slate-900 p-3 rounded-xl border border-slate-700 text-white text-sm outline-none focus:border-amber-500"/>
            <input placeholder="Ano" value={vehicle.ano} onChange={e=>setVehicle({...vehicle, ano: e.target.value})} className="bg-slate-900 p-3 rounded-xl border border-slate-700 text-white text-sm outline-none focus:border-amber-500"/>
            <input placeholder="Motorização (ex: 1.0, 2.0 Turbo)" value={vehicle.motor} onChange={e=>setVehicle({...vehicle, motor: e.target.value})} className="bg-slate-900 p-3 rounded-xl border border-slate-700 text-white text-sm outline-none focus:border-amber-500"/>
            <input placeholder="Quilometragem (KM)" value={vehicle.km} onChange={e=>setVehicle({...vehicle, km: e.target.value})} className="bg-slate-900 p-3 rounded-xl border border-slate-700 text-white text-sm outline-none focus:border-amber-500"/>
            <select value={vehicle.cambio} onChange={e=>setVehicle({...vehicle, cambio: e.target.value})} className="bg-slate-900 p-3 rounded-xl border border-slate-700 text-white text-sm outline-none focus:border-amber-500">
              <option>Manual</option>
              <option>Automático</option>
              <option>CVT</option>
              <option>Automatizado</option>
            </select>
          </div>
          {/* Outro removido conforme pedido */}
        </section>

        {/* 2. Sintoma Principal */}
        <section className="glass-card rounded-3xl p-6 mb-6 border-l-4 border-l-amber-500">
          <h2 className="text-amber-500 font-black text-sm uppercase mb-6 flex items-center gap-2">
            <i className="fas fa-stethoscope"></i> 2. O Sintoma Principal
          </h2>
          <CheckboxGroup title="A. Luzes e Painel" selected={symptoms.luzes} onChange={v=>toggle('luzes', v)} options={[
            {label: 'Luz de Injeção'}, {label: 'Luz de Bateria'}, {label: 'Luz de Temperatura'}, {label: 'Luz de ABS/Freio'}
          ]} />
          <div className="mt-8">
            <CheckboxGroup title="B. Comportamento do Motor" selected={symptoms.motorComportamento} onChange={v=>toggle('motorComportamento', v)} options={[
              {label: 'Não liga (nada)'}, {label: 'Gira mas não pega'}, {label: 'Falha/Engasga'}, {label: 'Perda de potência'}, {label: 'Consumo alto'}
            ]} />
            <input placeholder="Cor da fumaça no escape? (Se houver)" value={symptoms.corFumaca} onChange={e=>setSymptoms({...symptoms, corFumaca: e.target.value})} className="w-full bg-slate-900/50 p-3 rounded-xl border border-slate-700/50 text-white text-xs mt-2 focus:border-amber-500 outline-none"/>
          </div>
          <div className="mt-8">
            <CheckboxGroup title="C. Direção e Suspensão" selected={symptoms.direcaoSuspensao} onChange={v=>toggle('direcaoSuspensao', v)} options={[
              {label: 'Volante vibra'}, {label: 'Carro puxa lado'}, {label: 'Batida seca buraco'}, {label: 'Barulho ao virar'}
            ]} />
          </div>
          <div className="mt-8">
            <CheckboxGroup title="D. Freios" selected={symptoms.freios} onChange={v=>toggle('freios', v)} options={[
              {label: 'Pedal borrachudo'}, {label: 'Apito ao frear'}, {label: 'Ferro com ferro'}, {label: 'Vibração pedal'}
            ]} />
          </div>
          <InputOutroGrupo groupTitle="O Sintoma Principal" value={symptoms.outroGrupo2} onChange={v => setSymptoms({...symptoms, outroGrupo2: v})} />
        </section>

        {/* 3. Ruídos */}
        <section className="glass-card rounded-3xl p-6 mb-6 border-l-4 border-l-amber-500">
          <h2 className="text-amber-500 font-black text-sm uppercase mb-6 flex items-center gap-2">
            <i className="fas fa-volume-up"></i> 3. Identificação de Ruídos
          </h2>
          <CheckboxGroup title="Tipo do Som" selected={symptoms.ruidosTipo} onChange={v=>toggle('ruidosTipo', v)} options={[
            {label: 'Grilo/Chiado'}, {label: 'Batida Metálica'}, {label: 'Ronco/Zumbido'}, {label: 'Sopro'}, {label: 'Estalo'}
          ]} />
          <div className="mt-8">
            <CheckboxGroup title="De onde vem?" selected={symptoms.ruidosOrigem} onChange={v=>toggle('ruidosOrigem', v)} options={[
              {label: 'Motor'}, {label: 'Embaixo'}, {label: 'Traseira'}, {label: 'Rodas'}
            ]} />
          </div>
          {symptoms.ruidosOrigem.includes('Rodas') && (
            <input placeholder="Qual roda? (Ex: Dianteira Esquerda)" value={symptoms.especificacaoRoda} onChange={e=>setSymptoms({...symptoms, especificacaoRoda: e.target.value})} className="w-full bg-slate-900/50 p-3 rounded-xl border border-slate-700/50 text-white text-xs mt-2 focus:border-amber-500 outline-none"/>
          )}
          <InputOutroGrupo groupTitle="Identificação de Ruídos" value={symptoms.outroGrupo3} onChange={v => setSymptoms({...symptoms, outroGrupo3: v})} />
        </section>

        {/* 4. Condições */}
        <section className="glass-card rounded-3xl p-6 mb-6 border-l-4 border-l-amber-500">
          <h2 className="text-amber-500 font-black text-sm uppercase mb-6 flex items-center gap-2">
            <i className="fas fa-clock"></i> 4. Quando o problema acontece?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CheckboxGroup title="Temperatura" selected={symptoms.condicoesTemperatura} onChange={v=>toggle('condicoesTemperatura', v)} options={[{label: 'Frio'}, {label: 'Quente'}, {label: 'Sempre'}]} />
            <CheckboxGroup title="Movimento" selected={symptoms.condicoesVelocidade} onChange={v=>toggle('condicoesVelocidade', v)} options={[{label: 'Parado'}, {label: 'Acelerando'}, {label: 'Alta Vel.'}, {label: 'Lombada'}]} />
            <CheckboxGroup title="Clima" selected={symptoms.condicoesClima} onChange={v=>toggle('condicoesClima', v)} options={[{label: 'Chuva/Umidade'}, {label: 'Muito Quente'}]} />
          </div>
          <InputOutroGrupo groupTitle="Quando o problema acontece?" value={symptoms.outroGrupo4} onChange={v => setSymptoms({...symptoms, outroGrupo4: v})} />
        </section>

        {/* 5. Histórico */}
        <section className="glass-card rounded-3xl p-6 mb-6 border-l-4 border-l-amber-500">
          <h2 className="text-amber-500 font-black text-sm uppercase mb-6 flex items-center gap-2">
            <i className="fas fa-history"></i> 5. Histórico Recente
          </h2>
          <CheckboxGroup 
            title="Eventos Recentes" 
            selected={symptoms.historicoRecente} 
            onChange={v=>toggle('historicoRecente', v)} 
            options={[
              {label: 'Abastecimento em posto desconhecido'},
              {label: 'Manutenção realizada nos últimos 15 dias'},
              {label: 'Carro parado por mais de 2 semanas'}
            ]} 
          />
          {symptoms.historicoRecente.includes('Manutenção realizada nos últimos 15 dias') && (
            <input 
              placeholder="O que foi feito na manutenção?" 
              value={symptoms.manutencaoRecenteDetalhe} 
              onChange={e=>setSymptoms({...symptoms, manutencaoRecenteDetalhe: e.target.value})} 
              className="w-full bg-slate-900/50 p-3 rounded-xl border border-slate-700/50 text-white text-xs mt-2 focus:border-amber-500 outline-none"
            />
          )}
          <InputOutroGrupo groupTitle="Histórico Recente" value={symptoms.outroGrupo5} onChange={v => setSymptoms({...symptoms, outroGrupo5: v})} />
        </section>

        {/* 6. Cheiros */}
        <section className="glass-card rounded-3xl p-6 mb-6 border-l-4 border-l-amber-500">
          <h2 className="text-amber-500 font-black text-sm uppercase mb-6 flex items-center gap-2"><i className="fas fa-wind"></i> 6. Cheiros</h2>
          <CheckboxGroup title="Odor Identificado" selected={symptoms.cheiros} onChange={v=>toggle('cheiros', v)} options={[
            {label: 'Combustível Cru'}, {label: 'Ovo Podre'}, {label: 'Adocicado'}, {label: 'Borracha Queimada'}, {label: 'Óleo Queimado'}, {label: 'Embreagem/Freio'}
          ]} />
          <InputOutroGrupo groupTitle="Cheiros" value={symptoms.outroGrupo6} onChange={v => setSymptoms({...symptoms, outroGrupo6: v})} />
        </section>

        {/* 7. Fluidos */}
        <section className="glass-card rounded-3xl p-6 mb-6 border-l-4 border-l-amber-500">
          <h2 className="text-amber-500 font-black text-sm uppercase mb-6 flex items-center gap-2"><i className="fas fa-droplet"></i> 7. Fluidos e Vazamentos</h2>
          <CheckboxGroup title="Manchas no Chão" selected={symptoms.vazamentos} onChange={v=>toggle('vazamentos', v)} options={[
            {label: 'Preta/Óleo'}, {label: 'Vermelha/Câmbio'}, {label: 'Verde/Rosa/Água'}, {label: 'Amarela/Freio'}
          ]} />
          <div className="mt-8">
            <CheckboxGroup title="Nível dos Fluidos" selected={symptoms.fluidosNivel} onChange={v=>toggle('fluidosNivel', v)} options={[
              {label: 'Óleo Baixo'}, {label: 'Água baixando'}
            ]} />
          </div>
          <InputOutroGrupo groupTitle="Fluidos e Vazamentos" value={symptoms.outroGrupo7} onChange={v => setSymptoms({...symptoms, outroGrupo7: v})} />
        </section>

        {/* 8. Transmissão */}
        <section className="glass-card rounded-3xl p-6 mb-6 border-l-4 border-l-amber-500">
          <h2 className="text-amber-500 font-black text-sm uppercase mb-6 flex items-center gap-2">
            <i className="fas fa-gears"></i> 8. Transmissão e Embreagem
          </h2>
          <CheckboxGroup title="Sintomas de Câmbio/Embreagem" selected={symptoms.transmissao} onChange={v=>toggle('transmissao', v)} options={[
            {label: 'Dificuldade engate'}, {label: 'Pedal duro/alto'}, {label: 'Patinando'}, {label: 'Trancos marcha'}, {label: 'Demora resposta'}
          ]} />
          <InputOutroGrupo groupTitle="Transmissão e Embreagem" value={symptoms.outroGrupo8} onChange={v => setSymptoms({...symptoms, outroGrupo8: v})} />
        </section>

        {/* 9. Sistema Elétrico */}
        <section className="glass-card rounded-3xl p-6 mb-6 border-l-4 border-l-amber-500">
          <h2 className="text-amber-500 font-black text-sm uppercase mb-6 flex items-center gap-2">
            <i className="fas fa-bolt"></i> 9. Sistema Elétrico
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase mb-3">Idade da Bateria (Anos)</p>
              <input type="number" value={symptoms.idadeBateria} onChange={e=>setSymptoms({...symptoms, idadeBateria: e.target.value})} className="bg-slate-900 p-3 rounded-xl border border-slate-700 text-white w-full outline-none focus:border-amber-500"/>
            </div>
            <div>
              <CheckboxGroup title="Partida" selected={symptoms.eletricaPartida} onChange={v=>toggle('eletricaPartida', v)} options={[{label: 'Pesada (Lenta)'}, {label: 'Apenas um tec'}]} />
            </div>
          </div>
          <div className="mt-8">
            <CheckboxGroup title="Acessórios" selected={symptoms.eletricaAcessorios} onChange={v=>toggle('eletricaAcessorios', v)} options={[{label: 'Vidros lentos'}, {label: 'Ar não gela'}, {label: 'Rádio desliga'}]} />
          </div>
          <InputOutroGrupo groupTitle="Sistema Elétrico" value={symptoms.outroGrupo9} onChange={v => setSymptoms({...symptoms, outroGrupo9: v})} />
        </section>

        {/* 10. Frequência & Relato */}
        <section className="glass-card rounded-3xl p-6 mb-8 border-l-4 border-l-amber-500">
          <h2 className="text-amber-500 font-black text-sm uppercase mb-6 flex items-center gap-2">
            <i className="fas fa-star"></i> 10. A "Pergunta de Ouro"
          </h2>
          <div className="mb-6">
            <p className="text-xs font-bold text-slate-500 uppercase mb-3">Frequência do Problema</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {['Constante', 'Intermitente', 'Evento Único'].map(o => (
                <button key={o} onClick={()=>setSymptoms({...symptoms, frequencia: o})} className={`p-3 rounded-xl text-xs font-bold border transition-all ${symptoms.frequencia === o ? 'bg-amber-500 border-amber-500 text-slate-900' : 'bg-slate-900 border-slate-700'}`}>{o}</button>
              ))}
            </div>
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase mb-3">Resumo Descritivo (Suas palavras)</p>
          <textarea rows={5} value={symptoms.relato} onChange={e=>setSymptoms({...symptoms, relato: e.target.value})} placeholder="Descreva aqui o que você sente, ouve ou vê..." className="w-full bg-slate-900 p-4 rounded-xl border border-slate-700 text-white outline-none focus:border-amber-500"/>
        </section>

        <button onClick={handleAnalyse} disabled={loading} className="w-full py-6 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black text-xl rounded-2xl shadow-2xl transition-all active:scale-95 mb-20 flex items-center justify-center gap-4">
          {loading ? <i className="fas fa-cog fa-spin"></i> : <i className="fas fa-clipboard-check"></i>}
          {loading ? 'ANALISANDO SEU BRUTO...' : 'GERAR LAUDO TÉCNICO'}
        </button>

        {diagnosis && (
          <div id="results" className="glass-card rounded-3xl p-8 mb-20 border-2 border-amber-500/30 relative animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="absolute top-0 left-0 w-full h-2 bg-amber-500"></div>
            <div className="prose prose-invert prose-amber max-w-none" dangerouslySetInnerHTML={{ __html: marked.parse(diagnosis.text) }} />
            <div className="mt-8 pt-8 border-t border-slate-700 flex gap-4">
              <button onClick={() => window.print()} className="bg-slate-800 px-6 py-3 rounded-xl font-bold text-sm">IMPRIMIR LAUDO</button>
              <button onClick={() => {setDiagnosis(null); window.scrollTo({top: 0, behavior: 'smooth'})}} className="bg-amber-500 text-slate-900 px-6 py-3 rounded-xl font-bold text-sm">NOVA ANÁLISE</button>
            </div>
          </div>
        )}

        <footer className="py-12 border-t border-slate-800 flex flex-col items-center gap-6">
          <img src="logo.png" alt="Luna Footer Logo" className="h-16 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
          <div className="text-center">
            <p className="text-amber-500 font-black tracking-widest text-sm mb-1 uppercase">Luna Autopeças e Serviços</p>
            <p className="text-slate-500 text-[10px] uppercase tracking-[0.4em]">Desenvolvido por Fabrício Luna</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
