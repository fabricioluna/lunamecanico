
import { GoogleGenAI } from "@google/genai";
import { DiagnosisFormData } from "../types";

export const analyzeVehicle = async (data: DiagnosisFormData): Promise<string> => {
  // Inicialização robusta usando a API_KEY do ambiente
  if (!process.env.API_KEY) {
    throw new Error("MISSING_KEY");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    DADOS DO VEÍCULO:
    - Modelo: ${data.vehicle.model}
    - Ano: ${data.vehicle.year} | KM: ${data.vehicle.km}
    - Motor: ${data.vehicle.engine} | Câmbio: ${data.vehicle.transmission} | Combustível: ${data.vehicle.fuel}
    
    SINTOMAS E RELATO:
    - O cliente diz: "${data.report}"
    - Sintomas marcados: ${[...data.symptoms.noises, ...data.symptoms.sensations, ...data.symptoms.dashboard].join(', ')}
    - Quando acontece: ${data.context.condition} (${data.context.frequency})
    - Histórico recente: ${data.context.history.join(', ')}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest', // Usando o alias estável para evitar erros de "model not found"
      contents: prompt,
      config: {
        systemInstruction: `Você é o Seu Luna, mecânico master e dono da Luna Autopeças.
        Você é uma lenda na mecânica, conhecido por ser técnico, honesto e muito gente boa.
        
        Sua missão é emitir um LAUDO PERICIAL PROFISSIONAL.
        
        ESTILO:
        - Use Markdown.
        - TEXTO JUSTIFICADO: Escreva parágrafos longos e detalhados.
        - PERSONA: Use emojis de ferramentas 🛠️ e seja acolhedor.
        
        ESTRUTURA DO LAUDO:
        # 📄 LAUDO TÉCNICO DE INSPEÇÃO VIRTUAL
        
        ## 📋 1. ANÁLISE TÉCNICA
        (Explique em 2 parágrafos a causa provável baseada na física e mecânica do carro).

        ## 🛠️ 2. PONTOS DE ATENÇÃO (TOP 3)
        ### 🟥 [Peça ou Sistema]
        **Causa:** Explicação detalhada.
        **Gravidade:** Baixa, Média ou Alta.

        ## 🔬 3. COMO TESTAR NA OFICINA
        (Instruções para o mecânico que vai pegar o carro).

        ## ⚠️ 4. PALAVRA DO SEU LUNA
        (Conselho final amigável).

        Encerrar com: "Conte com a Luna Autopeças para as melhores peças do mercado!"`,
        temperature: 0.2,
      },
    });

    return response.text || "Erro ao gerar diagnóstico.";
  } catch (error: any) {
    console.error("Erro Seu Luna API:", error);
    throw new Error(error.status === 403 ? "AUTH_ERROR" : "API_ERROR");
  }
};
