
import { GoogleGenAI } from "@google/genai";
import { DiagnosisFormData } from "../types";

export const analyzeVehicle = async (data: DiagnosisFormData): Promise<string> => {
  // Inicializamos a IA diretamente com a chave do ambiente.
  // Se ela estiver vazia, o SDK do Google cuidará do erro e o App.tsx tratará visualmente.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const prompt = `
    DADOS TÉCNICOS:
    - Veículo: ${data.vehicle.model} (${data.vehicle.year})
    - KM: ${data.vehicle.km} | Motor: ${data.vehicle.engine} | Câmbio: ${data.vehicle.transmission}
    
    RELATO DO CLIENTE:
    "${data.report}"
    
    SINTOMAS SELECIONADOS:
    - Barulhos: ${data.symptoms.noises.join(', ')} ${data.symptoms.othersNoises ? `(${data.symptoms.othersNoises})` : ''}
    - Sensações: ${data.symptoms.sensations.join(', ')} ${data.symptoms.othersSensations ? `(${data.symptoms.othersSensations})` : ''}
    - Painel: ${data.symptoms.dashboard.join(', ')} ${data.symptoms.othersDashboard ? `(${data.symptoms.othersDashboard})` : ''}
    
    CONTEXTO:
    - Ocorre em: ${data.context.condition}
    - Frequência: ${data.context.frequency}
    - Histórico: ${data.context.history.join(', ')}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: `Você é o Seu Luna, o mecânico lendário da Luna Autopeças.
        Você é extremamente detalhista, usa termos técnicos (ex: sonda lambda, estequiometria, juntas homocinéticas) mas explica como um mestre.
        
        REGRAS DO LAUDO:
        1. Formate em Markdown.
        2. TEXTO JUSTIFICADO: Escreva parágrafos robustos e técnicos.
        3. ESTRUTURA:
           # 📄 LAUDO TÉCNICO PERICIAL
           ## 📋 1. PARECER DO ESPECIALISTA
           (Analise os sintomas justificando fisicamente o que está ocorrendo).
           ## 🛠️ 2. DIAGNÓSTICO DE COMPONENTES
           (Liste as 3 peças mais prováveis de estarem com defeito).
           ## 🔬 3. PROCEDIMENTOS DE TESTE
           (Como o mecânico deve testar para confirmar).
           ## ⚠️ 4. RECOMENDAÇÃO DO SEU LUNA
           (Dica final de manutenção preventiva).
        
        Finalize sempre incentivando o uso de peças de qualidade Luna Autopeças.`,
        temperature: 0.1,
      },
    });

    return response.text || "Ocorreu um erro ao processar o diagnóstico.";
  } catch (error: any) {
    console.error("Erro na Chamada Gemini:", error);
    // Repassa o erro para ser tratado visualmente no App.tsx
    throw error;
  }
};
