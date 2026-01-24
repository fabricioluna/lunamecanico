
import { GoogleGenAI } from "@google/genai";
import { DiagnosisFormData } from "../types";

export const analyzeVehicle = async (data: DiagnosisFormData): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    DADOS TÉCNICOS DO VEÍCULO:
    - Veículo: ${data.vehicle.model} (${data.vehicle.year})
    - KM: ${data.vehicle.km} km
    - Motor: ${data.vehicle.engine} | Câmbio: ${data.vehicle.transmission} | Combustível: ${data.vehicle.fuel}
    ${data.vehicle.plate ? `- Placa Identificada: ${data.vehicle.plate}` : ''}

    RELATO DO CLIENTE:
    "${data.report}"

    SINTOMAS OBSERVADOS:
    - Barulhos: ${data.symptoms.noises.join(', ') || 'Nenhum item da lista'} ${data.symptoms.othersNoises ? `| Outros informados: ${data.symptoms.othersNoises}` : ''}
    - Sensações: ${data.symptoms.sensations.join(', ') || 'Nenhum item da lista'} ${data.symptoms.othersSensations ? `| Outros informados: ${data.symptoms.othersSensations}` : ''}
    - Alertas no Painel: ${data.symptoms.dashboard.join(', ') || 'Nenhum item da lista'} ${data.symptoms.othersDashboard ? `| Outros informados: ${data.symptoms.othersDashboard}` : ''}

    CONTEXTO DO DEFEITO:
    - Frequência: ${data.context.frequency}
    - Condição: ${data.context.condition} ${data.context.othersCondition ? `| Detalhe da condição: ${data.context.othersCondition}` : ''}
    - Histórico Recente: ${data.context.history.join(', ') || 'Nenhum item da lista'} ${data.context.othersHistory ? `| Detalhes extras: ${data.context.othersHistory}` : ''}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: `Você é o Seu Luna, o mecânico mestre, experiente e simpático da Luna Autopeças. 
        Sua missão é ajudar o cliente a entender o que está acontecendo com o carro dele de forma didática e técnica.
        
        REGRAS DE RESPOSTA (Sempre use Markdown):
        1. 🛠️ **O que parece ser**: Identifique o provável defeito com um título direto.
        2. 🧠 **Por que isso está acontecendo**: Explique a mecânica por trás do problema de forma que um leigo entenda, mas mantendo a autoridade de especialista.
        3. 📋 **As 3 principais suspeitas**: Faça um ranking de 1 a 3 das peças ou sistemas que podem estar falhando.
        4. 🔧 **Teste rápido para fazer na hora**: Sugira algo que o motorista possa conferir sem ferramentas complexas (ex: checar nível, ouvir tal lugar, etc).
        
        Mantenha o tom da Luna Autopeças: Amigável, honesto e profissional. Use emojis relacionados a ferramentas e carros.`,
        temperature: 0.8,
      },
    });

    return response.text || "Puxa, parece que meu scanner deu erro. Vamos tentar analisar novamente?";
  } catch (error) {
    console.error("Erro na análise do Seu Luna:", error);
    throw new Error("Tive um probleminha na oficina virtual. Pode tentar de novo em instantes?");
  }
};
