
import { GoogleGenAI } from "@google/genai";
import { AnamneseForm } from "../types";

// Always use process.env.API_KEY directly when initializing the client.
export const analyzeWithAI = async (formData: AnamneseForm): Promise<string> => {
  // Initialize the AI client directly inside the function for the latest API_KEY access
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    DADOS DO VEÍCULO:
    - Modelo/Versão: ${formData.veiculo.modelo}
    - Ano: ${formData.veiculo.ano}
    - KM: ${formData.veiculo.km}
    - Motor: ${formData.veiculo.motor}
    - Câmbio: ${formData.veiculo.cambio}
    - Combustível: ${formData.veiculo.combustivel}

    RELATO DO CLIENTE:
    "${formData.relato}"

    SINTOMAS OBSERVADOS:
    - Barulhos: ${formData.sintomas.barulhos.join(", ") || "Nenhum informado"}
    - Sensações: ${formData.sintomas.sensacoes.join(", ") || "Nenhuma informada"}
    - Painel/Visual: ${formData.sintomas.painel.join(", ") || "Nenhum informado"}

    CONTEXTO E GATILHOS:
    - Frequência: ${formData.contexto.frequencia}
    - Condição: ${formData.contexto.condicao.join(", ") || "Não especificado"}
    - Histórico Recente: ${formData.contexto.historico.join(", ") || "Nenhum"}
  `;

  try {
    // Basic Text Task using 'gemini-3-flash-preview' as per guidelines
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "Você é o Seu Luna, o Mecânico Virtual Pro da Luna Autopeças. Um profissional com 40 anos de oficina, amigável mas extremamente técnico e direto. Analise os dados do veículo, combustível, KM e os sintomas. Cruze informações (ex: Lavagem + Falha = Umidade). Gere um relatório em Markdown com: 1. 🎯 Título do Defeito Provável. 2. 🧠 Análise de Causalidade (Por que você acha isso?). 3. 📋 Ranking de 3 Hipóteses (Alta, Média, Baixa chance). 4. 🛠️ Teste Rápido sugerido para a oficina. Seja técnico, direto e use termos de mecânica profissional brasileira.",
        temperature: 0.7,
      },
    });

    // Access text as a property, not a method, as per guidelines
    return response.text || "Desculpe, não consegui analisar os dados agora. Tente novamente em instantes.";
  } catch (error) {
    console.error("Erro na API Gemini:", error);
    throw new Error("Falha ao conectar com o Seu Luna. Verifique sua conexão.");
  }
};
