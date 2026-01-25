import { marked } from "marked";

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form') as HTMLFormElement;
    const passwordInput = document.getElementById('password-input') as HTMLInputElement;
    const loginScreen = document.getElementById('login-screen');
    const appScreen = document.getElementById('app-screen');
    const logoutBtn = document.getElementById('logout-btn');

    // Lógica visual do Upload de Áudio
    const audioInput = document.getElementById('audio-upload') as HTMLInputElement;
    const audioPreview = document.getElementById('audio-preview');
    const audioFilename = document.getElementById('audio-filename');

    if (audioInput && audioPreview && audioFilename) {
        audioInput.addEventListener('change', () => {
            if (audioInput.files && audioInput.files.length > 0) {
                audioPreview.classList.remove('hidden');
                audioFilename.textContent = audioInput.files[0].name;
            } else {
                audioPreview.classList.add('hidden');
            }
        });
    }

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

// Converte arquivo para Base64 limpo (sem header data:...)
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // Remove o prefixo "data:audio/mp3;base64,"
            const base64Data = result.split(',')[1]; 
            resolve(base64Data);
        };
        reader.onerror = error => reject(error);
    });
};

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
    const audioInput = document.getElementById('audio-upload') as HTMLInputElement;

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
        alert("Por favor, informe pelo menos o Modelo do veículo.");
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
        frequencia: (document.querySelector('input[name="frequencia"]:checked') as HTMLInputElement)?.value || "Não informado",
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

    btn.disabled = true;
    const oldHtml = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-bolt fa-pulse"></i> SEU LUNA ESTÁ ANALISANDO...';
    
    resTexto.innerHTML = "";
    resContainer.classList.add('hidden');

    // --- Processamento de Áudio ---
    let audioData = null;
    let mimeType = null;
    let audioContextMessage = "";

    if (audioInput && audioInput.files && audioInput.files.length > 0) {
        try {
            const file = audioInput.files[0];
            // Limite de 3MB para evitar erro de Payload na Vercel Free
            const maxSize = 3 * 1024 * 1024; 
            
            if (file.size > maxSize) {
                alert("O arquivo de áudio é muito grande (Máx 3MB). Por favor, grave um áudio mais curto.");
                btn.disabled = false;
                btn.innerHTML = oldHtml;
                return;
            }

            audioData = await fileToBase64(file);
            mimeType = file.type;
            audioContextMessage = " (ATENÇÃO: O USUÁRIO ENVIOU UM ÁUDIO. ANALISE-O PARA IDENTIFICAR O PADRÃO SONORO).";
            
        } catch (error) {
            console.error("Erro ao ler áudio:", error);
            alert("Erro ao processar o arquivo de áudio.");
            btn.disabled = false;
            btn.innerHTML = oldHtml;
            return;
        }
    }

    const prompt = `
        Atue como o SEU LUNA, um Mecânico Especialista Sênior. 
        Perfil: Técnico, formal, linguagem clara, objetiva e educativa. Sem gírias excessivas.
        
        CONTEXTO (DADOS PARA ANÁLISE):
        Veículo: ${vehicle.modelo} | ${vehicle.ano} | ${vehicle.km} km | ${vehicle.motor} | ${vehicle.cambio}
        
        SINTOMAS RELATADOS:
        - Ruídos Marcados: ${sintomas.ruidoTipo} em ${sintomas.ruidoOrigem}. Obs: ${sintomas.extras.ruido} ${audioContextMessage}
        - Painel/Motor: ${sintomas.luzes}, ${sintomas.motorComp}.
        - Outros Sintomas: ${sintomas.dirSusp} ${sintomas.freios} ${sintomas.cheiros} ${sintomas.manchas}
        - Contexto: ${sintomas.condicoes} | Frequência: ${sintomas.frequencia}
        - Relato Cliente: "${sintomas.relato}"
        - Outros: ${Object.values(sintomas.extras).join(' ')}

        DIRETRIZES DE RESPOSTA:
        1. NÃO repita os dados do formulário. Vá direto para a análise.
        2. Se houver ÁUDIO: Descreva o som que você ouviu (ex: "Ouço um tec-tec metálico rítmico") e use isso como prova principal.
        3. Se houver POUCA informação, use estatística de DEFEITOS CRÔNICOS DESTE MODELO mas AVISE que é preliminar.
        
        ESTRUTURA OBRIGATÓRIA (Markdown):
        ### 1. 🔧 Saudação Inicial
        (Breve e cordial).

        ### 2. 🎯 DIAGNÓSTICO PRINCIPAL
        (Identifique o sistema e o defeito central. Se ouviu o áudio, mencione-o aqui).

        ### 3. 🧠 ANÁLISE TÉCNICA
        (Explique o funcionamento mecânico e como os sintomas/áudio levam a essa conclusão).

        ### 4. 📋 CAUSAS PROVÁVEIS
        (Liste de 3 a 5 causas ordenadas da MAIS PROVÁVEL para a MENOS PROVÁVEL).

        ### 5. 🛠️ TESTES SUGERIDOS
        (Liste 3 testes práticos ou verificações visuais para confirmar a causa).

        ### 6. 📝 RESUMO E CONCLUSÃO
        (Síntese técnica e clara para mecânico e cliente).

        ### 7. 🚨 NÍVEL DE URGÊNCIA
        (Seguro Rodar, Atenção ou Parada Imediata).
    `;

    try {
        const response = await fetch('/api/diagnostico', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                prompt: prompt,
                audioData: audioData, // Envia null se não tiver áudio
                mimeType: mimeType
            })
        });

        const data = await response.json();

        if (!response.ok || data.error) {
            throw new Error(data.error || "Erro na resposta do servidor");
        }

        resContainer.classList.remove('hidden');
        await typeWriterEffect(data.result, resTexto, resContainer);

    } catch (e: any) {
        console.error("Erro detalhado:", e);
        alert("Ocorreu um erro ao falar com o Seu Luna. Tente novamente em instantes.");
        resContainer.classList.add('hidden');
    } finally {
        btn.disabled = false;
        btn.innerHTML = oldHtml;
    }
}
