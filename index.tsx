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

    // Funções auxiliares
    const getVal = (id: string) => (document.getElementById(id) as HTMLInputElement)?.value || "";
    const getChecked = (name: string) => {
        const els = document.querySelectorAll(`input[name="${name}"]:checked`) as NodeListOf<HTMLInputElement>;
        return Array.from(els).map(el => el.value).join(', ');
    };

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

    // Coleta COMPLETA de dados + "Outros"
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
        // Captura dos campos "Outros"
        extras: {
            luz: getVal('outra-luz'),
            motor: getVal('outro-motor'),
            direcao: getVal('outra-direcao'),
            freio: getVal('outro-freio'),
            ruido: getVal('outro-ruido'),
            condicao: getVal('outra-condicao'),
            historico: getVal('outro-historico'),
            cheiro: getVal('outro-cheiro'),
            fluido: getVal('outro-fluido'),
            transmissao: getVal('outra-transmissao'),
            eletrica: getVal('outra-eletrica')
        }
    };

    btn.disabled = true;
    const oldHtml = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-bolt fa-pulse"></i> SEU LUNA ESTÁ ESCREVENDO...';

    // Limpa e exibe container
    resTexto.innerHTML = "";
    resContainer.classList.remove('hidden');

    const prompt = `
        Atue como o SEU LUNA, um mecânico lendário de 40 anos de praça. Sincero, técnico e gente boa.
        DADOS DO CARRO: ${vehicle.modelo} | Ano: ${vehicle.ano} | KM: ${vehicle.km} | Motor: ${vehicle.motor} | Câmbio: ${vehicle.cambio}

        DIAGNÓSTICO FORMULÁRIO:
        - Sintomas (Painel/Motor): ${sintomas.luzes}, ${sintomas.motorComp}. Fumaça: ${sintomas.corFumaca}. Obs: ${sintomas.extras.luz} ${sintomas.extras.motor}
        - Direção/Freios: ${sintomas.dirSusp}, ${sintomas.freios}. Obs: ${sintomas.extras.direcao} ${sintomas.extras.freio}
        - Ruídos: Tipo: ${sintomas.ruidoTipo}. Origem: ${sintomas.ruidoOrigem} (${sintomas.rodaSpec}). Obs: ${sintomas.extras.ruido}
        - Quando acontece: ${sintomas.condicoes}. Obs: ${sintomas.extras.condicao}
        - Histórico: ${sintomas.historico} (${sintomas.manutDetalhe}). Obs: ${sintomas.extras.historico}
        - Cheiros: ${sintomas.cheiros}. Obs: ${sintomas.extras.cheiro}
        - Fluidos: Manchas: ${sintomas.manchas}. Níveis: ${sintomas.niveis}. Obs: ${sintomas.extras.fluido}
        - Transmissão: Manual: ${sintomas.manualComp}. Auto: ${sintomas.autoComp}. Obs: ${sintomas.extras.transmissao}
        - Elétrica: Bateria ${sintomas.idadeBateria} anos. Partida: ${sintomas.eletricaPartida}. Acessórios: ${sintomas.eletricaAcess}. Obs: ${sintomas.extras.eletrica}
        - Frequência: ${sintomas.frequencia}

        RELATO PESSOAL DO MOTORISTA: "${sintomas.relato}"

        Estrutura obrigatória do laudo (use Markdown):
        
        ### 1. 🔧 Saudação do Seu Luna
        (Comece com uma saudação amigável e comente brevemente sobre o carro/modelo).

        ### 2. 🎯 DIAGNÓSTICO PRINCIPAL
        (Vá direto ao ponto sobre o defeito mais provável em negrito).

        ### 3. 🧠 ANÁLISE TÉCNICA
        (Explique o raciocínio cruzando os sintomas de forma didática e técnica).

        ### 4. 📋 CAUSAS PROVÁVEIS
        (Liste de 3 a 5 itens usando bullet points).

        ### 5. 🗣️ O QUE DIZER AO SEU MECÂNICO
        (Instruções claras do que pedir para verificar).

        ### 6. 🚨 NÍVEL DE URGÊNCIA
        (Explique se é perigoso rodar ou se pode esperar).
    `;

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const response = await ai.models.generateContentStream({
            model: "gemini-2.5-flash-preview-09-2025",
            contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });

        let accumulatedText = "";

        for await (const chunk of response.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
                accumulatedText += chunkText;
                resTexto.innerHTML = `
                    <div class="prose prose-invert max-w-none text-justify leading-relaxed space-y-4">
                        <style>
                            .prose h3 { color: #f59e0b; margin-top: 1.5rem; margin-bottom: 0.5rem; font-size: 1.25rem; font-weight: 700; border-bottom: 1px solid #f59e0b55; padding-bottom: 0.25rem; }
                            .prose p { margin-bottom: 1rem; color: #cbd5e1; }
                            .prose strong { color: #fff; font-weight: 700; }
                            .prose ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
                            .prose li { margin-bottom: 0.5rem; color: #cbd5e1; }
                        </style>
                        ${await marked.parse(accumulatedText)}
                    </div>
                `;
                resContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
        }
        resContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (e: any) {
        console.error("Erro detalhado:", e);
        let msg = "Ocorreu um erro ao falar com o Seu Luna. Verifique sua conexão.";
        if (e.message?.includes("API key not valid")) {
            msg = "Erro: Chave da API inválida.";
        }
        alert(msg);
        resContainer.classList.add('hidden');
    } finally {
        btn.disabled = false;
        btn.innerHTML = oldHtml;
    }
}
