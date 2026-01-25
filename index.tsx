
import { GoogleGenAI } from "@google/genai";
import { marked } from "marked";

// Removed global API_KEY constant to use process.env.API_KEY directly inside the function.

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
        alert("Pelo menos o modelo deve ser preenchido!");
        return;
    }

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

    btn.disabled = true;
    const oldHtml = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ANALISANDO...';

    const prompt = `
        Atue como o SEU LUNA, um mecânico lendário de 40 anos de praça. Sincero, técnico e gente boa.
        DADOS DO CARRO: ${vehicle.modelo} | Ano: ${vehicle.ano} | KM: ${vehicle.km} | Motor: ${vehicle.motor} | Câmbio: ${vehicle.cambio}

        DIAGNÓSTICO FORMULÁRIO:
        - Sintomas (Painel/Motor): ${sintomas.luzes}, ${sintomas.motorComp}. Fumaça: ${sintomas.corFumaca}. Obs: ${sintomas.extras.g2}
        - Direção/Freios: ${sintomas.dirSusp}, ${sintomas.freios}.
        - Ruídos: Tipo: ${sintomas.ruidoTipo}. Origem: ${sintomas.ruidoOrigem} (${sintomas.rodaSpec}). Obs: ${sintomas.extras.g3}
        - Quando acontece: ${sintomas.condicoes}. Obs: ${sintomas.extras.g4}
        - Histórico: ${sintomas.historico} (${sintomas.manutDetalhe}). Obs: ${sintomas.extras.g5}
        - Cheiros: ${sintomas.cheiros}. Obs: ${sintomas.extras.g6}
        - Fluidos: Manchas: ${sintomas.manchas}. Níveis: ${sintomas.niveis}. Obs: ${sintomas.extras.g7}
        - Transmissão: Manual: ${sintomas.manualComp}. Auto: ${sintomas.autoComp}. Obs: ${sintomas.extras.g8}
        - Elétrica: Bateria ${sintomas.idadeBateria} anos. Partida: ${sintomas.eletricaPartida}. Acessórios: ${sintomas.eletricaAcess}. Obs: ${sintomas.extras.g9}
        - Frequência: ${sintomas.frequencia}

        RELATO PESSOAL: "${sintomas.relato}"

        Estrutura do seu laudo (Markdown):
        1. Saudação do Seu Luna.
        2. DIAGNÓSTICO PRINCIPAL (Foco no defeito mais provável).
        3. ANÁLISE TÉCNICA (Explique o porquê cruzando os sintomas).
        4. CAUSAS PROVÁVEIS (Lista de 3 a 5).
        5. O QUE DIZER AO SEU MECÂNICO (Instruções claras para o motorista).
        6. NIVEL DE URGÊNCIA (Pode andar ou guincho?).
    `;

    try {
        // Correct initialization of GoogleGenAI using the named parameter and direct process.env.API_KEY access.
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        // Using gemini-3-pro-preview for advanced reasoning task.
        const response = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: prompt
        });

        resTexto.innerHTML = await marked.parse(response.text || "Erro ao processar.");
        resContainer.classList.remove('hidden');
        resContainer.scrollIntoView({ behavior: 'smooth' });
    } catch (e) {
        alert("Erro no Seu Luna. Verifique a internet e a chave da API.");
    } finally {
        btn.disabled = false;
        btn.innerHTML = oldHtml;
    }
}
