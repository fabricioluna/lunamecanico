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

// Função visual para simular digitação
async function typeWriterEffect(text: string, element: HTMLElement, container: HTMLElement) {
    const htmlContent = await marked.parse(text);
    element.innerHTML = `
        <div class="prose prose-invert max-w-none text-justify leading-relaxed space-y-4 fade-in-text">
            <style>
                .prose h3 { color: #f59e0b; margin-top: 1.5rem; margin-bottom: 0.5rem; font-size: 1.25rem; font-weight: 700; border-bottom: 1px solid #f59e0b55; padding-bottom: 0.25rem; }
                .prose p { margin-bottom: 1rem; color: #cbd5e1; }
                .prose strong { color: #fff; font-weight: 700; }
                .prose ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
                .prose li { margin-bottom: 0.5rem; color: #cbd5e1; }
                .fade-in-text { animation: fadeIn 0.8s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            </style>
            ${htmlContent}
        </div>
    `;
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function analisarComIA() {
    const btn = document.getElementById('btn-analisar') as HTMLButtonElement;
    const resContainer = document.getElementById('resultado-container');
    const resTexto = document.getElementById('resultado-texto');

    if (!btn || !resContainer || !resTexto) return;

    // --- COLETA DE DADOS ---
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

    // --- UI LOADING ---
    btn.disabled = true;
    const oldHtml = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-bolt fa-pulse"></i> SEU LUNA ESTÁ ANALISANDO...';
    
    resTexto.innerHTML = "";
    resContainer.classList.add('hidden');

    const prompt = `
        Atue como o SEU LUNA, um Mecânico Especialista. 
        Seu perfil é técnico, porém com uma linguagem simples, clara, objetiva e educativa.
        Não use gírias excessivas. Foque na precisão técnica.
        
        DADOS TÉCNICOS DO VEÍCULO:
        - Modelo: ${vehicle.modelo} | Ano: ${vehicle.ano} | KM: ${vehicle.km}
        - Motor: ${vehicle.motor} | Câmbio: ${vehicle.cambio}

        SINTOMAS E OBSERVAÇÕES:
        - Painel/Motor: ${sintomas.luzes}, ${sintomas.motorComp}. Fumaça: ${sintomas.corFumaca}. Obs: ${sintomas.extras.luz} ${sintomas.extras.motor}
        - Direção/Freios: ${sintomas.dirSusp}, ${sintomas.freios}. Obs: ${sintomas.extras.direcao} ${sintomas.extras.freio}
        - Ruídos: ${sintomas.ruidoTipo} em ${sintomas.ruidoOrigem} (${sintomas.rodaSpec}). Obs: ${sintomas.extras.ruido}
        - Condições: ${sintomas.condicoes}. Obs: ${sintomas.extras.condicao}
        - Histórico: ${sintomas.historico} (${sintomas.manutDetalhe}). Obs: ${sintomas.extras.historico}
        - Cheiros: ${sintomas.cheiros}. Obs: ${sintomas.extras.cheiro}
        - Fluidos: ${sintomas.manchas}. Níveis: ${sintomas.niveis}. Obs: ${sintomas.extras.fluido}
        - Transmissão: ${sintomas.manualComp} ${sintomas.autoComp}. Obs: ${sintomas.extras.transmissao}
        - Elétrica: Bateria ${sintomas.idadeBateria} anos. Partida: ${sintomas.eletricaPartida}. Acessórios: ${sintomas.eletricaAcess}. Obs: ${sintomas.extras.eletrica}
        - Frequência: ${sintomas.frequencia}

        RELATO DO CONDUTOR: "${sintomas.relato}"

        INSTRUÇÃO DE ESTRUTURA DO LAUDO (Markdown):
        ### 1. 🔧 Saudação Inicial
        (Breve e cordial, confirmando o veículo).

        ### 2. 🎯 DIAGNÓSTICO PRINCIPAL
        (Identifique o sistema e o defeito central com precisão).

        ### 3. 🧠 ANÁLISE TÉCNICA
        (Relacione os sintomas físicos, ruídos e luzes com o funcionamento mecânico. Evite termos vagos).

        ### 4. 📋 CAUSAS PROVÁVEIS
        (Liste de 3 a 5 causas potenciais, ordenadas da MAIS PROVÁVEL para a MENOS PROVÁVEL).

        ### 5. 📝 RESUMO E CONCLUSÃO
        (Parágrafo síntese claro para o mecânico e para o cliente).

        ### 6. 🚨 NÍVEL DE URGÊNCIA
        (Seguro Rodar, Atenção ou Parada Imediata).
    `;

    try {
        // CHAMA APENAS O SEU BACKEND NA VERCEL
        const response = await fetch('/api/diagnostico', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: prompt })
        });

        const data = await response.json();

        if (!response.ok || data.error) {
            throw new Error(data.error || "Erro na resposta do servidor");
        }

        const resultText = data.result;

        // Exibe o resultado
        resContainer.classList.remove('hidden');
        await typeWriterEffect(resultText, resTexto, resContainer);

    } catch (e: any) {
        console.error("Erro detalhado:", e);
        alert("Ocorreu um erro ao falar com o Seu Luna. Tente novamente em instantes.");
        resContainer.classList.add('hidden');
    } finally {
        btn.disabled = false;
        btn.innerHTML = oldHtml;
    }
}
