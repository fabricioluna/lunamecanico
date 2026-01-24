
import { GoogleGenAI } from "@google/genai";
import { VehicleData, Symptoms } from "../types";

export const generateDiagnosis = async (vehicle: VehicleData, symptoms: Symptoms): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const prompt = `
    Atue como o SEU LUNA, um mecânico especialista lendário com 40 anos de experiência. 
    Seu tom deve ser amigável, técnico, honesto e direto. 
    Este é um app de uso NACIONAL no Brasil. NÃO convide o usuário para a Luna Autopeças. 
    Seu objetivo é dar um norte técnico para que ele saiba o que falar com o mecânico dele.

    DADOS DO VEÍCULO (Grupo 1):
    - ${vehicle.modelo} | ${vehicle.ano} | Motor: ${vehicle.motor} | KM: ${vehicle.km} | Câmbio: ${vehicle.cambio}

    ANÁLISE DE SINTOMAS:
    2. Principal: Luzes: ${symptoms.luzes.join(', ')} | Motor: ${symptoms.motorComportamento.join(', ')} (Fumaça: ${symptoms.corFumaca}) | Direção/Suspensão: ${symptoms.direcaoSuspensao.join(', ')} | Freios: ${symptoms.freios.join(', ')} | Extras: ${symptoms.outroGrupo2}
    3. Ruídos: Tipo: ${symptoms.ruidosTipo.join(', ')} | Origem: ${symptoms.ruidosOrigem.join(', ')} (Rodas: ${symptoms.especificacaoRoda}) | Extras: ${symptoms.outroGrupo3}
    4. Condições: Temp: ${symptoms.condicoesTemperatura.join(', ')} | Movimento: ${symptoms.condicoesVelocidade.join(', ')} | Clima: ${symptoms.condicoesClima.join(', ')} | Extras: ${symptoms.outroGrupo4}
    5. Histórico: Eventos recentes: ${symptoms.historicoRecente.join(', ')} | Detalhe Manutenção: ${symptoms.manutencaoRecenteDetalhe} | Extras: ${symptoms.outroGrupo5}
    6. Cheiros: ${symptoms.cheiros.join(', ')} | Extras: ${symptoms.outroGrupo6}
    7. Fluidos: Manchas: ${symptoms.vazamentos.join(', ')} | Níveis: ${symptoms.fluidosNivel.join(', ')} | Extras: ${symptoms.outroGrupo7}
    8. Transmissão: ${symptoms.transmissao.join(', ')} | Extras: ${symptoms.outroGrupo8}
    9. Elétrica: Bateria ${symptoms.idadeBateria} anos | Partida: ${symptoms.eletricaPartida.join(', ')} | Acessórios: ${symptoms.eletricaAcessorios.join(', ')} | Extras: ${symptoms.outroGrupo9}
    10. Frequência: ${symptoms.frequencia}
    
    RELATO FINAL DO CLIENTE: "${symptoms.relato}"

    ESTRUTURA DO LAUDO (Markdown):
    1. Saudação do Seu Luna.
    2. DIAGNÓSTICO PRINCIPAL.
    3. ANÁLISE TÉCNICA (Explique o cruzamento dos dados).
    4. POSSÍVEIS CAUSAS (3 a 5 itens).
    5. O QUE DIZER AO SEU MECÂNICO.
    6. NIVEL DE URGÊNCIA.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Erro ao gerar diagnóstico.";
  } catch (error) {
    console.error(error);
    throw new Error("Falha na comunicação com o Seu Luna.");
  }
};
