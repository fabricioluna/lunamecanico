
import { GoogleGenAI } from "@google/genai";
import { DiagnosisFormData } from "../types";

export const analyzeVehicle = async (data: DiagnosisFormData): Promise<string> => {
  // Inicialização dentro da função para garantir que pegue o estado mais recente do ambiente
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
      model: "gemini-3-pro-preview", // Upgrade para o modelo Pro para diagnósticos mais complexos
      contents: prompt,
      config: {
        systemInstruction: `Você é o Seu Luna, o mecânico master e consultor técnico sênior da Luna Autopeças. Sua missão é emitir um "LAUDO TÉCNICO DE DIAGNÓSTICO VIRTUAL" com extrema precisão e profissionalismo.

        REGRAS DE FORMATAÇÃO DO RELATÓRIO:
        1. PARÁGRAFOS E JUSTIFICAÇÃO: Cada explicação deve ser um parágrafo independente. O texto deve ser redigido de forma que a visualização final seja JUSTIFICADA e limpa para impressão. Use espaços entre blocos de texto.
        2. LINGUAGEM PERICIAL: Use um tom técnico-didático. Explique a função dos componentes citados e por que os sintomas apresentados indicam a falha neles.
        3. ESTRUTURA PARA IMPRESSÃO: O laudo deve estar pronto para ser entregue ao cliente, com separação clara entre análise, causas e recomendações.

        ESTRUTURA OBRIGATÓRIA (Markdown):
        
        # 📄 LAUDO TÉCNICO DE INSPEÇÃO VEICULAR
        
        ## 📋 1. ANÁLISE TÉCNICA DOS SINTOMAS
        (Escreva pelo menos dois parágrafos detalhados justificando a correlação entre os sintomas relatados e o comportamento físico do veículo).

        ## 📊 2. DIAGNÓSTICO DE CAUSAS PROVÁVEIS (TOP 3)
        Apresente exatamente 3 suspeitas. Cada uma deve seguir este formato:
        
        ### 🟥 OPÇÃO 01: [Componente] — [Probabilidade]%
        **Função da Peça:** (Um parágrafo explicando a função do componente).
        
        **Justificativa Técnica:** (Dois ou mais parágrafos explicando detalhadamente POR QUE este componente falhou, baseando-se no KM, ano e sintomas do carro).
        
        **Risco Operacional:** (Um parágrafo sobre o perigo de não realizar o reparo).

        ### 🟧 OPÇÃO 02: [Componente] — [Probabilidade]%
        (Siga a mesma estrutura acima).

        ### 🟨 OPÇÃO 03: [Componente] — [Probabilidade]%
        (Siga a mesma estrutura acima).

        ## 🔬 3. PROCEDIMENTOS DE VALIDAÇÃO (TESTES)
        (Descreva em parágrafos os testes práticos que devem ser feitos na oficina para confirmar o defeito).

        ## ⚠️ 4. CONSIDERAÇÕES FINAIS E CONCLUSÃO
        (Parágrafo de encerramento resumindo a urgência do reparo).
        
        (Encerre com: "Este laudo é uma análise preliminar baseada em inteligência artificial. Recomendamos uma avaliação física imediata em uma oficina de sua confiança para a validação deste diagnóstico e execução dos serviços necessários.")`,
        temperature: 0.15, // Baixa temperatura para maior precisão técnica
      },
    });

    return response.text || "Sistema de diagnóstico indisponível.";
  } catch (error: any) {
    console.error("Erro na API do Seu Luna:", error);
    throw new Error("Erro ao gerar o laudo. Certifique-se de que a API Key está configurada corretamente no Vercel.");
  }
};
