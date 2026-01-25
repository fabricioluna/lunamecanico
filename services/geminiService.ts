
import { GoogleGenAI } from "@google/genai";
import { VehicleData, Symptoms } from "../types";

export const generateDiagnosis = async (vehicle: VehicleData, symptoms: Symptoms): Promise<string> => {
  // Initialize GoogleGenAI using the named parameter and direct process.env.API_KEY access as per guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Atue como o SEU LUNA, um mecânico especialista lendário com 40 anos de experiência. 
    Seu tom deve ser amigável, técnico, honesto e direto. 
    Este é um app de uso NACIONAL no Brasil. NÃO convide o usuário para a Luna Autopeças. 
    Seu objetivo é dar um norte técnico para que o usuário ou mecânico consiga encontrar o defeito do veículo.

    DADOS DO VEÍCULO (Grupo 1):
    - ${vehicle.modelo} | ${vehicle.ano} | Motor: ${vehicle.motor} | KM: ${vehicle.km} | Câmbio: ${vehicle.cambio}

    ANÁLISE DE SINTOMAS:
    2. Principal: Luzes: ${symptoms.luzes} | Motor: ${symptoms.motorComp} (Fumaça: ${symptoms.corFumaca}) | Direção/Suspensão: ${symptoms.dirSusp} | Freios: ${symptoms.freios} | Extras: ${symptoms.extras.g2}
    3. Ruídos: Tipo: ${symptoms.ruidoTipo} | Origem: ${symptoms.ruidoOrigem} (Rodas: ${symptoms.rodaSpec}) | Extras: ${symptoms.extras.g3}
    4. Condições: ${symptoms.condicoes} | Extras: ${symptoms.extras.g4}
    5. Histórico: Eventos recentes: ${symptoms.historico} | Detalhe Manutenção: ${symptoms.manutDetalhe} | Extras: ${symptoms.extras.g5}
    6. Cheiros: ${symptoms.cheiros} | Extras: ${symptoms.extras.g6}
    7. Fluidos: Manchas: ${symptoms.manchas} | Níveis: ${symptoms.niveis} | Extras: ${symptoms.extras.g7}
    8. Transmissão: Manual: ${symptoms.manualComp} | Automática: ${symptoms.autoComp} | Extras: ${symptoms.extras.g8}
    9. Elétrica: Bateria ${symptoms.idadeBateria} anos | Partida: ${symptoms.eletricaPartida} | Acessórios: ${symptoms.eletricaAcess} | Extras: ${symptoms.extras.g9}
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
    // Using gemini-3-pro-preview for complex reasoning task (diagnostic analysis).
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    return response.text || "Erro ao gerar diagnóstico.";
  } catch (error) {
    console.error(error);
    throw new Error("Falha na comunicação com o Seu Luna.");
  }
};
