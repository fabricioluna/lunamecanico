
import { GoogleGenAI } from "@google/genai";
import { DiagnosisFormData } from "../types";

export const analyzeVehicle = async (data: DiagnosisFormData): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    DADOS TÉCNICOS DO VEÍCULO:
    - MODELO/MARCA: ${data.vehicle.model}
    - ESPECIFICAÇÕES: Ano ${data.vehicle.year} | ${data.vehicle.km} KM | Motor ${data.vehicle.engine} | Câmbio ${data.vehicle.transmission} | Combustível ${data.vehicle.fuel}
    
    SINTOMATOLOGIA E RELATO:
    - RELATO DO PROPRIETÁRIO: "${data.report}"
    - SINAIS E SINTOMAS SELECIONADOS: ${[...data.symptoms.noises, ...data.symptoms.sensations, ...data.symptoms.dashboard].join(', ') || 'Nenhum sinal específico selecionado'}
    - CONDIÇÕES DE OCORRÊNCIA: Condição de ${data.context.condition} | Frequência: ${data.context.frequency}
    - EVENTOS RECENTES: ${data.context.history.join(', ') || 'Sem intervenções recentes informadas'}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: `Você é o Seu Luna, um Mecânico Master com décadas de experiência e Consultor Técnico Sênior da Luna Autopeças. Sua tarefa é redigir um "Laudo de Diagnóstico Técnico Virtual" extremamente profissional, justificado e didático.

        DIRETRIZES DE FORMATAÇÃO PARA IMPRESSÃO E LEITURA:
        1. ORGANIZAÇÃO POR PARÁGRAFOS: Cada explicação técnica, justificativa ou observação deve estar em seu próprio parágrafo. Evite blocos de texto maciços. Use espaçamento entre parágrafos para clareza visual.
        2. JUSTIFICATIVA TÉCNICA PROFUNDA: Não se limite a citar a peça. Explique a lógica de causa e efeito. Por que o sintoma X leva à suspeita da peça Y? Use termos técnicos explicados de forma didática.
        3. TOM DE RELATÓRIO PERICIAL: Escreva de forma objetiva, autoritária e profissional. O texto deve parecer um laudo oficial de engenharia mecânica.

        ESTRUTURA OBRIGATÓRIA DO LAUDO (Markdown):
        
        # 📄 LAUDO DE INSPEÇÃO TÉCNICA VEICULAR
        
        ## 📋 1. ANÁLISE DOS SINTOMAS E CONTEXTO OPERACIONAL
        (Mínimo de dois parágrafos justificando a correlação entre o relato do cliente e o comportamento esperado do sistema mecânico/eletrônico do veículo).

        ## 📊 2. DIAGNÓSTICO DE CAUSAS PROVÁVEIS (TOP 3)
        Apresente exatamente 3 opções. Cada uma deve seguir rigorosamente este formato:
        
        ### 🟥 OPÇÃO 01: [Componente] — [Probabilidade]%
        **Explicação Didática:** (Um parágrafo explicando a função desta peça no veículo).
        
        **Justificativa Técnica:** (Pelo menos dois parágrafos explicando detalhadamente por que este componente é o principal suspeito, baseando-se nos sintomas e no histórico).
        
        **Impacto no Sistema:** (Um parágrafo sobre o que acontece se o defeito persistir).

        ### 🟧 OPÇÃO 02: [Componente] — [Probabilidade]%
        (Siga a mesma estrutura acima, com parágrafos bem definidos).

        ### 🟨 OPÇÃO 03: [Componente] — [Probabilidade]%
        (Siga a mesma estrutura acima).

        ## 🔬 3. PARECER TÉCNICO E PROCEDIMENTOS DE VALIDAÇÃO
        (Descreva em parágrafos os testes físicos e eletrônicos que o mecânico deve realizar para confirmar este laudo).

        ## ⚠️ 4. CONCLUSÃO E RECOMENDAÇÃO FINAL
        (Parágrafo de encerramento com a classificação de risco).
        
        (Encerre OBRIGATORIAMENTE com: "Este laudo é uma análise preliminar baseada em inteligência artificial. Recomendamos uma avaliação física imediata em uma oficina de sua confiança para a validação deste diagnóstico e execução dos serviços necessários.")`,
        temperature: 0.2,
        thinkingConfig: { 
          thinkingBudget: 2048 
        },
      },
    });

    return response.text || "Sistema de diagnóstico temporariamente indisponível.";
  } catch (error: any) {
    console.error("Erro no Seu Luna:", error);
    throw new Error("Erro ao processar o laudo técnico. Verifique sua conexão e tente novamente.");
  }
};
