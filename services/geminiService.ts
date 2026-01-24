
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

        DIRETRIZES DE FORMATAÇÃO E ESTILO:
        1. ORGANIZAÇÃO POR PARÁGRAFOS: Divida cada explicação técnica em parágrafos claros e bem definidos. Use espaços duplos entre parágrafos no Markdown para garantir a separação visual.
        2. TEXTO JUSTIFICADO E PROFISSIONAL: Utilize uma linguagem técnica porém acessível, estruturando os argumentos de forma lógica e sequencial (causa, efeito e solução).
        3. FOCO EM IMPRESSÃO: O laudo deve ser conciso e organizado, pronto para ser entregue ao cliente ou mecânico como um documento oficial de consulta.

        ESTRUTURA OBRIGATÓRIA DO LAUDO (Markdown):
        
        # 📄 LAUDO DE INSPEÇÃO TÉCNICA VEICULAR
        
        ## 📋 1. ANÁLISE DOS SINTOMAS E CONTEXTO OPERACIONAL
        (Escreva pelo menos dois parágrafos justificando a correlação técnica entre o relato do motorista e o comportamento esperado das peças envolvidas).

        ## 📊 2. DIAGNÓSTICO DE CAUSAS PROVÁVEIS (TOP 3)
        Apresente exatamente 3 opções. Cada uma deve seguir rigorosamente este formato para clareza máxima:
        
        ### 🟥 OPÇÃO 01: [Componente] — [Probabilidade]%
        **Explicação Didática:** (Um parágrafo explicando a função desta peça de forma simples).
        
        **Justificativa Técnica:** (Pelo menos dois parágrafos explicando o motivo da suspeita, relacionando a falha funcional aos sintomas apresentados).
        
        **Impacto no Sistema:** (Um parágrafo sobre riscos e consequências da não manutenção).

        ### 🟧 OPÇÃO 02: [Componente] — [Probabilidade]%
        (Siga a mesma estrutura acima).

        ### 🟨 OPÇÃO 03: [Componente] — [Probabilidade]%
        (Siga a mesma estrutura acima).

        ## 🔬 3. PARECER TÉCNICO E PROCEDIMENTOS DE VALIDAÇÃO
        (Descreva em parágrafos os testes que devem ser realizados na oficina para confirmar o defeito).

        ## ⚠️ 4. CONCLUSÃO E RECOMENDAÇÃO FINAL
        (Encerramento com o resumo da gravidade).
        
        (Encerre OBRIGATORIAMENTE com: "Este laudo é uma análise preliminar baseada em inteligência artificial. Recomendamos uma avaliação física imediata em uma oficina de sua confiança para a validação deste diagnóstico e execução dos serviços necessários.")
        organize os resultados pulando linha (adicionando parágrafos) a cada opção e a cada nova informação, justifique o texto`,
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
