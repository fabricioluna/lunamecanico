
import { GoogleGenAI } from "@google/genai";
import { FormData } from "../types";

const SYSTEM_INSTRUCTION = `Você é o "Seu Luna", o Mecânico Virtual Sênior da Luna Autopeças e Serviços. 
Sua especialidade é diagnóstico automotivo avançado.
Instruções:
1. Analise os dados do veículo, KM e sintomas para identificar falhas comuns do modelo.
2. Use um tom profissional, experiente e confiável.
3. Sua resposta deve ser em Markdown estruturado:
   - # Título do Diagnóstico (Ex: Falha no Sistema de Arrefecimento)
   - ## Causa Raiz Provável
   - ## Hipóteses de Defeito (Mínimo 3, com probabilidade Alta, Média e Baixa)
   - ## Recomendações Técnicas
   - ## Checklist para o Mecânico (Passos para validação física)
4. Sempre mencione que a peça correta está disponível na Luna Autopeças.`;

export const generateDiagnosis = async (formData: FormData): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    DADOS DO VEÍCULO:
    - Marca/Modelo: ${formData.veiculo.marcaModelo}
    - Ano: ${formData.veiculo.ano}
    - KM: ${formData.veiculo.km}
    - Motor: ${formData.veiculo.motorizacao}
    - Câmbio: ${formData.veiculo.cambio}
    - Combustível: ${formData.veiculo.combustivel}

    RELATO DO PROBLEMA:
    "${formData.relato}"

    SINTOMAS:
    - Barulhos: ${formData.sintomas.barulhos.join(", ") || "Nenhum específico"}
    - Sensações: ${formData.sintomas.sensacoes.join(", ") || "Nenhuma específica"}
    - Alertas: ${formData.sintomas.visual.join(", ") || "Nenhum alerta visual"}

    CONTEXTO:
    - Frequência: ${formData.contexto.frequencia}
    - Condições: ${formData.contexto.condicoes.join(", ")}
    - Histórico: ${formData.contexto.historico.join(", ")}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.5,
      },
    });

    return response.text || "Ocorreu um erro ao processar o diagnóstico.";
  } catch (error) {
    console.error("Erro Gemini:", error);
    throw new Error("Falha na conexão com o sistema Seu Luna.");
  }
};
