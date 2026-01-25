import { marked } from "marked";

// Variáveis globais para controle de áudio
let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];
let recordedBlob: Blob | null = null; // Armazena o áudio gravado
let uploadedFile: File | null = null; // Armazena o arquivo enviado

document.addEventListener('DOMContentLoaded', () => {
    setupLogin();
    setupAudioLogic();
    
    const btnAnalisar = document.getElementById('btn-analisar');
    if (btnAnalisar) btnAnalisar.addEventListener('click', analisarComIA);
});

function setupLogin() {
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
}

function setupAudioLogic() {
    const audioInput = document.getElementById('audio-upload') as HTMLInputElement;
    const recordBtn = document.getElementById('record-btn-container');
    const stopRecordBtn = document.getElementById('btn-stop-record');
    const clearAudioBtn = document.getElementById('btn-clear-audio');
    
    // UI Elements
    const feedbackContainer = document.getElementById('audio-feedback-container');
    const statusText = document.getElementById('audio-status-text');
    const audioPlayer = document.getElementById('audio-player') as HTMLAudioElement;
    const recordingOverlay = document.getElementById('recording-overlay');

    // 1. Lógica de UPLOAD de Arquivo
    if (audioInput) {
        audioInput.addEventListener('change', () => {
            if (audioInput.files && audioInput.files.length > 0) {
                uploadedFile = audioInput.files[0];
                recordedBlob = null; // Limpa gravação se houver
                
                // Atualiza UI
                if (feedbackContainer && statusText && audioPlayer) {
                    feedbackContainer.classList.remove('hidden');
                    statusText.innerHTML = `<i class="fas fa-file-audio"></i> Arquivo: ${uploadedFile.name}`;
                    
                    // Cria URL para preview
                    const fileURL = URL.createObjectURL(uploadedFile);
                    audioPlayer.src = fileURL;
                    audioPlayer.classList.remove('hidden');
                }
            }
        });
    }

    // 2. Lógica de GRAVAÇÃO
    if (recordBtn && stopRecordBtn) {
        recordBtn.addEventListener('click', async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                audioChunks = [];

                mediaRecorder.ondataavailable = (event) => {
                    audioChunks.push(event.data);
                };

                mediaRecorder.onstop = () => {
                    // Cria o Blob do áudio gravado
                    const mimeType = mediaRecorder?.mimeType || 'audio/webm';
                    recordedBlob = new Blob(audioChunks, { type: mimeType });
                    uploadedFile = null; // Limpa upload se houver

                    // Atualiza UI
                    if (feedbackContainer && statusText && audioPlayer && recordingOverlay) {
                        recordingOverlay.classList.add('hidden'); // Esconde overlay
                        feedbackContainer.classList.remove('hidden');
                        statusText.innerHTML = `<i class="fas fa-microphone"></i> Gravação Finalizada (${Math.round(recordedBlob.size / 1024)} KB)`;
                        
                        const audioURL = URL.createObjectURL(recordedBlob);
                        audioPlayer.src = audioURL;
                        audioPlayer.classList.remove('hidden');
                    }

                    // Para todas as tracks do microfone
                    stream.getTracks().forEach(track => track.stop());
                };

                mediaRecorder.start();
                
                // Atualiza UI para "Gravando"
                if (recordingOverlay) recordingOverlay.classList.remove('hidden');

            } catch (err) {
                console.error("Erro ao acessar microfone:", err);
                alert("Não foi possível acessar o microfone. Verifique as permissões do navegador.");
            }
        });

        stopRecordBtn.addEventListener('click', () => {
            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                mediaRecorder.stop();
            }
        });
    }

    // 3. Limpar Áudio
    if (clearAudioBtn) {
        clearAudioBtn.addEventListener('click', () => {
            uploadedFile = null;
            recordedBlob = null;
            if (audioInput) audioInput.value = '';
            if (feedbackContainer) feedbackContainer.classList.add('hidden');
        });
    }
}

// Helpers de Conversão
const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => {
            const result = reader.result as string;
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

    if (!btn || !resContainer || !resTexto) return;

    // Coleta de dados
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
    btn.innerHTML = '<i class="fas fa-bolt fa-pulse"></i> SEU LUNA ESTÁ OUVINDO E ANALISANDO...';
    
    resTexto.innerHTML = "";
    resContainer.classList.add('hidden');

    // --- PREPARAÇÃO DO ÁUDIO (ARQUIVO OU GRAVAÇÃO) ---
    let finalAudioData = null;
    let finalMimeType = null;
    let audioContextMessage = "";

    try {
        if (recordedBlob) {
            // Prioridade 1: Áudio Gravado na hora
            finalAudioData = await blobToBase64(recordedBlob);
            finalMimeType = recordedBlob.type;
            audioContextMessage = " (ATENÇÃO: O USUÁRIO GRAVOU UM ÁUDIO DO RUÍDO AGORA. ESCUTE COM ATENÇÃO).";
        
        } else if (uploadedFile) {
            // Prioridade 2: Arquivo Enviado
            if (uploadedFile.size > 3 * 1024 * 1024) {
                throw new Error("O arquivo de áudio é muito grande (Máx 3MB).");
            }
            finalAudioData = await blobToBase64(uploadedFile);
            finalMimeType = uploadedFile.type;
            audioContextMessage = " (ATENÇÃO: O USUÁRIO ENVIOU UM ARQUIVO DE ÁUDIO. ESCUTE COM ATENÇÃO).";
        }
    } catch (err: any) {
        alert(err.message || "Erro ao processar o áudio.");
        btn.disabled = false;
        btn.innerHTML = oldHtml;
        return;
    }

    const prompt = `
        Atue como o SEU LUNA, um Mecânico Especialista Sênior. 
        Perfil: Técnico, formal, linguagem clara, objetiva e educativa.
        
        CONTEXTO (DADOS PARA ANÁLISE):
        Veículo: ${vehicle.modelo} | ${vehicle.ano} | ${vehicle.km} km | ${vehicle.motor} | ${vehicle.cambio}
        
        SINTOMAS RELATADOS:
        - Ruídos Marcados: ${sintomas.ruidoTipo} em ${sintomas.ruidoOrigem}. Obs: ${sintomas.extras.ruido} ${audioContextMessage}
        - Painel/Motor: ${sintomas.luzes}, ${sintomas.motorComp}.
        - Outros Sintomas: ${sintomas.dirSusp} ${sintomas.freios} ${sintomas.cheiros} ${sintomas.manchas}
        - Contexto: ${sintomas.condicoes} | Frequência: ${sintomas.frequencia}
        - Relato Cliente: "${sintomas.relato}"
        - Outros: ${Object.values(sintomas.extras).join(' ')}

        DIRETRIZES:
        1. NÃO repita os dados do formulário.
        2. Se houver ÁUDIO: Descreva o som (ex: "tec-tec metálico", "zumbido agudo") e use como prova principal.
        3. Se houver POUCA informação, use estatística de falhas conhecidas do modelo.
        
        ESTRUTURA OBRIGATÓRIA (Markdown):
        ### 1. 🔧 Saudação Inicial
        (Breve e cordial).

        ### 2. 🎯 DIAGNÓSTICO PRINCIPAL
        (Identifique o defeito. Se ouviu o áudio, mencione explicitamente o que ouviu).

        ### 3. 🧠 ANÁLISE TÉCNICA
        (Explique o funcionamento mecânico).

        ### 4. 📋 CAUSAS PROVÁVEIS
        (Ordenadas por probabilidade).

        ### 5. 🛠️ TESTES SUGERIDOS
        (3 testes práticos).

        ### 6. 📝 RESUMO E CONCLUSÃO
        (Síntese clara).

        ### 7. 🚨 NÍVEL DE URGÊNCIA
        (Seguro Rodar, Atenção ou Parada Imediata).
    `;

    try {
        const response = await fetch('/api/diagnostico', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                prompt: prompt,
                audioData: finalAudioData, 
                mimeType: finalMimeType
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
