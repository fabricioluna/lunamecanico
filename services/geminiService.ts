
import { GoogleGenAI } from "@google/genai";
import { DiagnosisFormData } from "../types";

export const analyzeVehicle = async (data: DiagnosisFormData): Promise<string> => {
  // Criamos a instância da IA exatamente no momento do clique, 
  // garantindo que ela use a API_KEY configurada no seu ambiente.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    DADOS TÉCNICOS:
    - Veículo: ${data.vehicle.model} (${data.vehicle.year})
    - KM: ${data.vehicle.km}
    - Configuração: Motor ${data.vehicle.engine}, Câmbio ${data.vehicle.transmission}, Combustível ${data.vehicle.fuel}
    
    RELATO E SINTOMAS:
    - Relato: "${data.report}"
    - Sintomas: ${[...data.symptoms.noises, ...data.symptoms.sensations, ...data.symptoms.dashboard].join(', ')}
    - Contexto: ${data.context.condition} (${data.context.frequency})
    - Histórico: ${data.context.history.join(', ')}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: `Você é o Seu Luna, o mecânico mestre da Luna Autopeças. 
        Você é extremamente experiente, técnico e atencioso.
        
        Sua tarefa é gerar um LAUDO TÉCNICO PERICIAL completo.
        
        REGRAS DE FORMATAÇÃO:
        1. TEXTO JUSTIFICADO: Escreva parágrafos completos, explicando os detalhes técnicos. 
        2. TONE OF VOICE: Use termos técnicos (ex: estequiometria, torque, viscosidade, centelhamento) mas explique-os de forma simples.
        3. ESTRUTURA DO DOCUMENTO:
        
        # 📄 LAUDO TÉCNICO AUTOMOTIVO
        
        ## 📋 1. ANÁLISE PRELIMINAR DOS SINTOMAS
        (Escreva dois parágrafos justificando tecnicamente os sintomas relatados pelo cliente).

        ## 🛠️ 2. DIAGNÓSTICO DE PROBABILIDADES
        Apresente as 3 causas mais prováveis. Para cada uma:
        ### 🟥 [NOME DA PEÇA/SISTEMA]
        **Explicação Técnica:** (Por que isso falha e como afeta o carro).
        **Urgência:** (Baixa, Média ou Crítica).

        ## 🔬 3. PROTOCOLO DE TESTES PARA O MECÂNICO
        (Liste quais ferramentas e testes o mecânico deve usar para confirmar este laudo).

        ## ⚠️ 4. CONSIDERAÇÕES DO SEU LUNA
        (Resumo final com um conselho de quem tem 40 anos de oficina).

        (Finalize com a recomendação de peças originais Luna Autopeças).`,
        temperature: 0.1,
      },
    });

    return response.text || "Ocorreu um erro ao gerar o laudo.";
  } catch (error: any) {
    console.error("Erro na API:", error);
    throw new Error("API_ERROR");
  }
};
