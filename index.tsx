import { GoogleGenAI } from "@google/genai";
import { marked } from "marked";

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form') as HTMLFormElement;
    const passwordInput = document.getElementById('password-input') as HTMLInputElement;
    const loginScreen = document.getElementById('login-screen');
    const appScreen = document.getElementById('app-screen');
    const logoutBtn = document.getElementById('logout-btn');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Senha definida: luna1989
            if (passwordInput.value.trim() === 'luna1989') {
                loginScreen?.classList.add('hidden');
                appScreen?.classList.remove('hidden');
                window.scrollTo(0, 0);
            } else {
                document.getElementById('login-error')?.classList.remove('hidden');
            }
        });
    }

    if (logoutBtn) logoutBtn.addEventListener('click', () => window.location.reload());

    const btnAnalisar = document.getElementById('btn-analisar');
    if (btnAnalisar) btnAnalisar.addEventListener('click', analisarComIA);
});

async function analisarComIA() {
    const btn = document.getElementById('btn-analisar') as HTMLButtonElement;
    const resContainer = document.getElementById('resultado-container');
    const resTexto = document.getElementById('resultado-texto');

    if (!btn || !resContainer || !resTexto) return;

    // Funções auxiliares para pegar valores
    const getVal = (id: string) => (document.getElementById(id) as HTMLInputElement)?.value || "";
    const getChecked = (name: string) => {
        const els = document.querySelectorAll(`input[name="${name}"]:checked`) as NodeListOf<HTMLInputElement>;
        return Array.from(els).map(el => el.value).join(', ');
    };

    // Coleta de dados do Veículo
    const vehicle = {
        modelo: getVal('modelo'),
        ano: getVal('ano'),
        km: getVal('km'),
        motor: getVal('motor'),
        cambio: getVal('cambio')
    };

    if (!vehicle.modelo) {
        alert("Por favor, informe o modelo do veículo.");
        return;
    }

    // Coleta dos Sintomas e Diagnósticos
    const sintomas = {
        luzes: getChecked('luzes'),
        motorComp: getChecked('motor_comp'),
        corFumaca: getVal('cor-fumaca'),
        dirSusp: getChecked('dir_susp'),
        freios: getChecked('freios'),
        ruidoTipo: getChecked('ruido_tipo'),
        ruidoOrigem: getChecked('ruido_origem'),
        rodaSpec: getVal('especificacao-roda'),
        condicoes: getChecked('cond_contexto'),
        historico: getChecked('historico'),
        manutDetalhe: getVal('detalhe-manutencao'),
        cheiros: getChecked('cheiros'),
        manchas: getChecked('manchas'),
        niveis: getChecked('niveis'),
        manualComp: getChecked('manual_comp'),
        autoComp: getChecked('auto_comp'),
        eletricaPartida: getChecked('eletrica_partida'),
        eletricaAcess: getChecked('eletrica_acess'),
        idadeBateria: getVal('idade-bateria'),
        frequencia: (document.querySelector('input[name="frequencia"]:checked') as HTMLInputElement)?.value || "Intermitente",
        relato: (document.getElementById('relato') as HTMLTextAreaElement)?.value || "",
        extras: {
            g2: getVal('outro-grupo2'),
            g3: getVal('outro-grupo3'),
            g4: getVal('outro-grupo4'),
            g5: getVal('outro-grupo5'),
            g6: getVal('outro-grupo6'),
            g7: getVal('outro-grupo7'),
            g8: getVal('outro-grupo8'),
            g9: getVal('outro-grupo9')
        }
    };

    // UI de Carregamento
    btn.disabled = true;
    const oldHtml = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> O SEU LUNA ESTÁ ANALISANDO...';

    // Construção do Prompt Otimizado para Formatação Markdown
    const prompt = `
        Atue como o SEU LUNA, um mecânico lendário de 40 anos de praça. Sincero, técnico e gente boa.
        
        DADOS DO VEÍCULO:
        - Modelo: ${vehicle.modelo} | Ano: ${vehicle.ano} | KM: ${vehicle.km}
        - Motor: ${vehicle.motor} | Câmbio: ${vehicle.cambio}

        RELATÓRIO DE SINTOMAS:
        - Painel e Motor: ${sintomas.luzes}, ${sintomas.motorComp}. (Fumaça: ${sintomas.corFumaca}). Obs: ${sintomas.extras.g2}
        - Suspensão e Freios: ${sintomas.dirSusp}, ${sintomas.freios}.
        - Ruídos: Tipo: ${sintomas.ruidoTipo}. Origem: ${sintomas.ruidoOrigem} (${sintomas.rodaSpec}). Obs: ${sintomas.extras.g3}
        - Contexto (Quando ocorre): ${sintomas.condicoes}. Obs: ${sintomas.extras.g4}
        - Histórico: ${sintomas.historico} (${sintomas.manutDetalhe}). Obs: ${sintomas.extras.g5}
        - Cheiros: ${sintomas.cheiros}. Obs: ${sintomas.extras.g6}
        - Fluidos: ${sintomas.manchas}. Níveis: ${sintomas.niveis}. Obs: ${sintomas.extras.g7}
        - Transmissão: ${sintomas.manualComp} ${sintomas.autoComp}. Obs: ${sintomas.extras.g8}
        - Elétrica: Bateria ${sintomas.idadeBateria} anos. Partida: ${sintomas.eletricaPartida}. Acessórios: ${sintomas.eletricaAcess}. Obs: ${sintomas.extras.g9}
        - Frequência: ${sintomas.frequencia}

        RELATO DO MOTORISTA: "${sintomas.relato}"

        INSTRUÇÃO DE FORMATAÇÃO:
        Responda utilizando Markdown rigoroso para estruturar o relatório.
        Use "###" para títulos das seções.
        Não use listas numeradas simples para os títulos principais, use os headers (###).

        ESTRUTURA DO LAUDO:
        ### 1. 🔧 Saudação do Seu Luna
        (Comece com uma saudação amigável e comente brevemente sobre o carro/modelo).

        ### 2. 🎯 DIAGNÓSTICO PRINCIPAL
        (Vá direto ao ponto sobre o defeito mais provável).

        ### 3. 🧠 ANÁLISE TÉCNICA
        (Explique o raciocínio cruzando os sintomas de forma didática e técnica).

        ### 4. 📋 CAUSAS PROVÁVEIS
        (Liste de 3 a 5 itens usando bullet points).

        ### 5. 🗣️ O QUE DIZER AO SEU MECÂNICO
        (Instruções claras do que pedir para verificar na oficina).

        ### 6. 🚨 NÍVEL DE URGÊNCIA
        (Explique se é perigoso rodar ou se pode esperar).
    `;

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-09-2025",
            contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });

        const resultText = response.text || "Desculpe, não consegui processar as informações agora.";
        
        // Converte Markdown para HTML
        const rawHtml = await marked.parse(resultText);

        // Injeta o HTML com estilização forçada para garantir a beleza do relatório
        resTexto.innerHTML = `
            <div class="prose prose-invert max-w-none text-justify leading-relaxed text-slate-300">
                <style>
                    /* Estilos embutidos para garantir a formatação exata */
                    .prose h3 { 
                        color: #f59e0b; /* Cor Âmbar da Luna */
                        font-size: 1.25rem; 
                        font-weight: 700; 
                        margin-top: 1.5rem; 
                        margin-bottom: 0.75rem; 
                        border-bottom: 1px solid rgba(245, 158, 11, 0.2); 
                        padding-bottom: 0.25rem;
                    }
                    .prose p { 
                        margin-bottom: 1rem; 
                        line-height: 1.7;
                    }
                    .prose ul { 
                        list-style-type: disc; 
                        padding-left: 1.5rem; 
                        margin-bottom: 1.25rem; 
                    }
                    .prose li { 
                        margin-bottom: 0.5rem; 
                        color: #e2e8f0; /* Texto mais claro para listas */
                    }
                    .prose strong { 
                        color: #fff; 
                        font-weight: 600; 
                    }
                </style>
                ${rawHtml}
            </div>
        `;

        resContainer.classList.remove('hidden');
        resContainer.scrollIntoView({ behavior: 'smooth' });

    } catch (e: any) {
        console.error("Erro detalhado na API Gemini:", e);
        let msg = "Ocorreu um erro ao falar com o Seu Luna. Verifique sua conexão ou tente novamente.";
        
        // Tratamento de erro específico para chave inválida
        if (e.message?.includes("API key not valid")) {
            msg = "Erro de Configuração: A Chave da API (API Key) parece inválida ou não foi configurada corretamente.";
        }
        
        alert(msg);
    } finally {
        btn.disabled = false;
        btn.innerHTML = oldHtml;
    }
}
