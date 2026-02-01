import { marked } from "marked";

// --- VARIÁVEIS GLOBAIS ---
// Grupo 3 (Ruído Específico)
let mediaRecorderNoise: MediaRecorder | null = null;
let audioChunksNoise: Blob[] = [];
let recordedBlobNoise: Blob | null = null; 
let uploadedFileNoise: File | null = null; 

// Grupo 11 (Resumo do Motorista - Multimídia)
let driverMedia: { type: 'file' | 'audio_recording', blob: Blob, name: string }[] = [];
let mediaRecorderDriver: MediaRecorder | null = null;
let audioChunksDriver: Blob[] = [];

document.addEventListener('DOMContentLoaded', () => {
    setupLogin();
    setupNoiseAudioLogic(); // Lógica do Grupo 3
    setupDriverMediaLogic(); // Lógica do Resumo
    
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

// --- LÓGICA GRUPO 3 (RUÍDO) ---
function setupNoiseAudioLogic() {
    const audioInput = document.getElementById('audio-upload') as HTMLInputElement;
    const recordBtn = document.getElementById('record-btn-container');
    const stopRecordBtn = document.getElementById('btn-stop-record');
    const clearAudioBtn = document.getElementById('btn-clear-audio');
    
    const feedbackContainer = document.getElementById('audio-feedback-container');
    const statusText = document.getElementById('audio-status-text');
    const audioPlayer = document.getElementById('audio-player') as HTMLAudioElement;
    const recordingOverlay = document.getElementById('recording-overlay');

    if (audioInput) {
        audioInput.addEventListener('change', () => {
            if (audioInput.files && audioInput.files.length > 0) {
                uploadedFileNoise = audioInput.files[0];
                recordedBlobNoise = null;
                if (feedbackContainer && statusText && audioPlayer) {
                    feedbackContainer.classList.remove('hidden');
                    statusText.innerHTML = `<i class="fas fa-file-audio"></i> Arquivo: ${uploadedFileNoise.name}`;
                    audioPlayer.src = URL.createObjectURL(uploadedFileNoise);
                    audioPlayer.classList.remove('hidden');
                }
            }
        });
    }

    if (recordBtn && stopRecordBtn) {
        recordBtn.addEventListener('click', async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorderNoise = new MediaRecorder(stream);
                audioChunksNoise = [];
                mediaRecorderNoise.ondataavailable = e => audioChunksNoise.push(e.data);
                mediaRecorderNoise.onstop = () => {
                    const mimeType = mediaRecorderNoise?.mimeType || 'audio/webm';
                    recordedBlobNoise = new Blob(audioChunksNoise, { type: mimeType });
                    uploadedFileNoise = null;
                    if (feedbackContainer && statusText && audioPlayer && recordingOverlay) {
                        recordingOverlay.classList.add('hidden');
                        feedbackContainer.classList.remove('hidden');
                        statusText.innerHTML = `<i class="fas fa-microphone"></i> Gravação Finalizada`;
                        audioPlayer.src = URL.createObjectURL(recordedBlobNoise);
                        audioPlayer.classList.remove('hidden');
                    }
                    stream.getTracks().forEach(track => track.stop());
                };
                mediaRecorderNoise.start();
                if (recordingOverlay) recordingOverlay.classList.remove('hidden');
            } catch (err) { alert("Erro no microfone."); }
        });

        stopRecordBtn.addEventListener('click', () => {
            if (mediaRecorderNoise && mediaRecorderNoise.state !== 'inactive') mediaRecorderNoise.stop();
        });
    }

    if (clearAudioBtn) {
        clearAudioBtn.addEventListener('click', () => {
            uploadedFileNoise = null;
            recordedBlobNoise = null;
            if (audioInput) audioInput.value = '';
            if (feedbackContainer) feedbackContainer.classList.add('hidden');
        });
    }
}

// --- LÓGICA GRUPO 11 (RESUMO MULTIMÍDIA) ---
function setupDriverMediaLogic() {
    const uploadInput = document.getElementById('driver-media-upload') as HTMLInputElement;
    const recordBtn = document.getElementById('driver-record-btn');
    const recordIndicator = document.getElementById('driver-recording-indicator');
    const mediaList = document.getElementById('driver-media-list');

    const addMediaItem = (blob: Blob, name: string, type: 'file' | 'audio_recording') => {
        const currentTotalSize = driverMedia.reduce((acc, item) => acc + item.blob.size, 0) + blob.size;
        if (currentTotalSize > 4.5 * 1024 * 1024) { 
            alert("Atenção: O total de arquivos ultrapassou 4.5MB. É provável que o envio falhe. Tente enviar vídeos curtos ou menos fotos.");
        }
        driverMedia.push({ blob, name, type });
        renderMediaList();
    };

    const renderMediaList = () => {
        if (!mediaList) return;
        mediaList.innerHTML = '';
        driverMedia.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = "flex items-center justify-between bg-slate-800 p-2 rounded-lg border border-slate-700";
            
            let icon = 'fa-file';
            if (item.blob.type.includes('image')) icon = 'fa-image text-blue-400';
            else if (item.blob.type.includes('video')) icon = 'fa-video text-purple-400';
            else if (item.blob.type.includes('audio')) icon = 'fa-microphone text-green-400';

            div.innerHTML = `
                <div class="flex items-center gap-3 overflow-hidden">
                    <div class="w-8 h-8 flex items-center justify-center bg-slate-900 rounded"><i class="fas ${icon}"></i></div>
                    <span class="text-xs text-slate-300 truncate font-mono">${item.name}</span>
                </div>
                <button class="text-red-400 hover:text-red-300 p-2" data-index="${index}"><i class="fas fa-trash"></i></button>
            `;
            div.querySelector('button')?.addEventListener('click', () => {
                driverMedia.splice(index, 1);
                renderMediaList();
            });
            mediaList.appendChild(div);
        });
    };

    if (uploadInput) {
        uploadInput.addEventListener('change', () => {
            if (uploadInput.files) {
                Array.from(uploadInput.files).forEach(file => {
                    addMediaItem(file, file.name, 'file');
                });
                uploadInput.value = ''; 
            }
        });
    }

    if (recordBtn) {
        recordBtn.addEventListener('click', async () => {
            if (mediaRecorderDriver && mediaRecorderDriver.state === 'recording') {
                mediaRecorderDriver.stop();
                return;
            }
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorderDriver = new MediaRecorder(stream);
                audioChunksDriver = [];
                mediaRecorderDriver.ondataavailable = e => audioChunksDriver.push(e.data);
                mediaRecorderDriver.onstop = () => {
                    const mimeType = mediaRecorderDriver?.mimeType || 'audio/webm';
                    const blob = new Blob(audioChunksDriver, { type: mimeType });
                    addMediaItem(blob, `Explicação em Áudio (${new Date().toLocaleTimeString()})`, 'audio_recording');
                    if (recordIndicator) recordIndicator.classList.add('hidden');
                    stream.getTracks().forEach(track => track.stop());
                };
                mediaRecorderDriver.start();
                if (recordIndicator) recordIndicator.classList.remove('hidden');
            } catch (err) { alert("Erro ao acessar microfone para explicação."); }
        });
    }
}

// Helpers
const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
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

    // Coleta de dados Texto
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
        tentativasSolucao: getVal('tentativas-solucao'),
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
    btn.innerHTML = '<i class="fas fa-bolt fa-pulse"></i> SEU LUNA ESTÁ ANALISANDO TUDO...';
    
    resTexto.innerHTML = "";
    resContainer.classList.add('hidden');

    // --- PROCESSAMENTO MULTIMÍDIA ---
    let noiseAudioData = null;
    let noiseMimeType = null;
    let contextMsg = "";

    // 1. Processa Áudio do Ruído (Grupo 3)
    try {
        if (recordedBlobNoise) {
            noiseAudioData = await blobToBase64(recordedBlobNoise);
            noiseMimeType = recordedBlobNoise.type;
            contextMsg += " [Áudio do Ruído Gravado Anexado]";
        } else if (uploadedFileNoise) {
            noiseAudioData = await blobToBase64(uploadedFileNoise);
            noiseMimeType = uploadedFileNoise.type;
            contextMsg += " [Arquivo de Ruído Anexado]";
        }
    } catch (e) { console.error(e); }

    // 2. Processa Mídias do Motorista
    const driverMediaFiles = [];
    try {
        for (const item of driverMedia) {
            const base64 = await blobToBase64(item.blob);
            driverMediaFiles.push({
                mimeType: item.blob.type,
                data: base64
            });
            contextMsg += ` [Anexo extra: ${item.name}]`;
        }
    } catch (e) {
        console.error("Erro ao processar mídias", e);
        alert("Erro ao processar um dos arquivos anexados.");
    }

    // Se não tiver nada, define mensagem padrão para o Prompt
    if (contextMsg === "") {
        contextMsg = "Nenhum arquivo de mídia foi enviado pelo usuário.";
    }

    const prompt = `
        Atue como o SEU LUNA, um Mecânico Especialista Sênior. 
        
        CONTEXTO TÉCNICO:
        Veículo: ${vehicle.modelo} | ${vehicle.ano} | ${vehicle.km} km | ${vehicle.motor} | ${vehicle.cambio}
        
        SINTOMAS E DADOS:
        - Ruídos: ${sintomas.ruidoTipo} em ${sintomas.ruidoOrigem}. Obs: ${sintomas.extras.ruido}
        - Painel/Motor: ${sintomas.luzes}, ${sintomas.motorComp}.
        - Geral: ${sintomas.dirSusp} ${sintomas.freios} ${sintomas.cheiros} ${sintomas.manchas}
        - Contexto: ${sintomas.condicoes} | Frequência: ${sintomas.frequencia}
        - Tentativas Prévias: "${sintomas.tentativasSolucao}"
        - Relato do Motorista: "${sintomas.relato}"
        - Outras Observações: ${Object.values(sintomas.extras).join(' ')}
        
        STATUS DOS ARQUIVOS: ${contextMsg}
        
        DIRETRIZES OBRIGATÓRIAS:
        1. SEU OBJETIVO É DAR UM DIAGNÓSTICO TÉCNICO COMPLETO AGORA.
        2. SE NÃO HOUVER ARQUIVOS: **NÃO PEÇA ARQUIVOS**. Isso é crucial. Se o usuário não mandou, assuma que ele não tem. Baseie seu diagnóstico exclusivamente nos sintomas marcados e no modelo do carro. Use sua experiência para deduzir o defeito mais provável.
        3. SE HOUVER ARQUIVOS: Use-os para confirmar ou refutar hipóteses. Descreva o que viu/ouviu (ex: "No áudio ouve-se um tec-tec de tucho").
        4. Leve em conta as "Tentativas Prévias" para não sugerir o que já foi feito.
        
        ESTRUTURA OBRIGATÓRIA (Markdown):
        ### 1. 🔧 Saudação Inicial
        ### 2. 🎯 DIAGNÓSTICO PRINCIPAL (Seja direto. Se não tiver certeza absoluta, diga "Suspeita Principal")
        ### 3. 🧠 ANÁLISE TÉCNICA (Explique o porquê baseando-se nos sintomas)
        ### 4. 📋 CAUSAS PROVÁVEIS (Ordenadas da mais provável para a menos provável)
        ### 5. 🛠️ TESTES SUGERIDOS (Passos práticos para o mecânico/motorista)
        ### 6. 📝 RESUMO E CONCLUSÃO
        ### 7. 🚨 NÍVEL DE URGÊNCIA
    `;

    try {
        const response = await fetch('/api/diagnostico', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                prompt: prompt,
                audioData: noiseAudioData, 
                mimeType: noiseMimeType,   
                mediaFiles: driverMediaFiles 
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
        alert("Ocorreu um erro. Verifique se os arquivos não são muito grandes (limite aprox 4MB total).");
        resContainer.classList.add('hidden');
    } finally {
        btn.disabled = false;
        btn.innerHTML = oldHtml;
    }
}
