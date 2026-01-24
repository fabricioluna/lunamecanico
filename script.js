// =======================================================
// 🔑 CONFIGURAÇÃO
// =======================================================
const API_KEY = 'COLE_SUA_CHAVE_AQUI'; 

document.addEventListener('DOMContentLoaded', function() {
    
    // LÓGICA DE LOGIN
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const passwordInput = document.getElementById('password-input');
            const errorMsg = document.getElementById('login-error');
            const loginScreen = document.getElementById('login-screen');
            const appScreen = document.getElementById('app-screen');

            const senhaDigitada = passwordInput.value.trim();

            if (senhaDigitada === 'luna1989') {
                errorMsg.classList.add('hidden');
                loginScreen.style.opacity = '0';
                loginScreen.style.transition = 'opacity 0.5s ease';
                setTimeout(() => {
                    loginScreen.style.display = 'none';
                    appScreen.classList.remove('hidden');
                    window.scrollTo(0,0);
                }, 500);
            } else {
                errorMsg.classList.remove('hidden');
                passwordInput.classList.add('border-red-500');
                passwordInput.classList.remove('border-amber-500/30');
            }
        });
        
        const passInput = document.getElementById('password-input');
        passInput.addEventListener('input', function() {
            this.classList.remove('border-red-500');
            this.classList.add('border-amber-500/30');
            document.getElementById('login-error').classList.add('hidden');
        });
    }

    const btnAnalisar = document.getElementById('btn-analisar');
    if (btnAnalisar) {
        btnAnalisar.addEventListener('click', analisarComIA);
    }
});

function logout() {
    location.reload();
}

// ---------------------------------------------------
// 3. LÓGICA DO SEU LUNA (GEMINI API)
// ---------------------------------------------------
async function analisarComIA() {
    const btn = document.getElementById('btn-analisar');
    const originalContent = btn.innerHTML;
    const resultadoContainer = document.getElementById('resultado-container');
    const resultadoTexto = document.getElementById('resultado-texto');

    // 1. IDENTIFICAÇÃO
    const modelo = document.getElementById('modelo').value;
    const ano = document.getElementById('ano').value;
    const km = document.getElementById('km').value;
    const motor = document.getElementById('motor').value;
    const cambio = document.getElementById('cambio').value;

    // Helper para pegar checkboxes
    const getCheckedValues = (className) => {
        let values = [];
        document.querySelectorAll(`.${className}:checked`).forEach(el => values.push(el.value));
        return values;
    };

    // 2. SINTOMAS
    const sintomas = getCheckedValues('sintoma');
    const outraLuz = document.getElementById('outra-luz').value;
    if(outraLuz) sintomas.push(`Outra Luz: ${outraLuz}`);

    // 3. RUÍDOS
    const ruidos = getCheckedValues('ruido');

    // 4. CONDIÇÕES
    const condicoes = getCheckedValues('condicao');

    // 5. HISTÓRICO
    const historico = getCheckedValues('historico');
    const manutencao = document.getElementById('manutencao-recente').value;
    if(manutencao) historico.push(`Manutenção recente: ${manutencao}`);

    // 6. CHEIROS
    const cheiros = getCheckedValues('cheiro');

    // 7. FLUIDOS
    const fluidos = getCheckedValues('fluido');

    // 8. TRANSMISSÃO
    const transmissao = getCheckedValues('transmissao');

    // 9. ELÉTRICA
    const eletrica = getCheckedValues('eletrica');
    const idadeBateria = document.getElementById('idade-bateria').value;

    // 10. FREQUÊNCIA
    const frequenciaEl = document.querySelector('input[name="frequencia"]:checked');
    const frequencia = frequenciaEl ? frequenciaEl.value : "Não informado";

    // RESUMO
    const relato = document.getElementById('relato').value;

    // Validação
    if (!modelo) {
        alert("Por favor, preencha pelo menos o Modelo do veículo.");
        return;
    }

    // UI Loading
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-cog fa-spin"></i> O SEU LUNA ESTÁ DIAGNOSTICANDO...';
    btn.classList.add('opacity-75', 'cursor-not-allowed');

    // Prompt Detalhado
    const prompt = `
    Atue como o SEU LUNA, mecânico especialista da Luna Autopeças.
    Analise este Formulário de Diagnóstico Inicial completo:

    1. VEÍCULO: ${modelo} | Ano: ${ano} | KM: ${km} | Motor: ${motor} | Câmbio: ${cambio}
    
    2. SINTOMAS PRINCIPAIS: ${sintomas.join(', ') || 'Nada marcado'}
    3. RUÍDOS: ${ruidos.join(', ') || 'Nenhum'}
    4. CONDIÇÕES: ${condicoes.join(', ') || 'Nenhuma específica'}
    5. HISTÓRICO: ${historico.join(', ') || 'Nada relevante'}
    6. CHEIROS: ${cheiros.join(', ') || 'Nenhum'}
    7. FLUIDOS/VAZAMENTOS: ${fluidos.join(', ') || 'Nenhum'}
    8. TRANSMISSÃO: ${transmissao.join(', ') || 'Ok'}
    9. ELÉTRICA: ${eletrica.join(', ') || 'Ok'} (Bateria: ${idadeBateria} anos)
    10. FREQUÊNCIA: ${frequencia}
    
    RESUMO DO CLIENTE: "${relato}"

    INSTRUÇÃO:
    Gere um diagnóstico técnico em Markdown.
    1. Saudação do Seu Luna.
    2. DIAGNÓSTICO PRINCIPAL (Título do defeito mais provável).
    3. ANÁLISE DETALHADA: Explique por que chegou a essa conclusão cruzando os sintomas (Ex: Cheiro de ovo podre + Luz injeção = Catalisador).
    4. PROBABILIDADES: Liste as 3 causas mais prováveis em ordem.
    5. RECOMENDAÇÃO: Qual teste fazer primeiro na oficina?
    `;

    try {
        if(API_KEY === 'COLE_SUA_CHAVE_AQUI') {
            throw new Error("Chave da API não configurada.");
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const data = await response.json();

        if (data.error) throw new Error(data.error.message);

        const textResponse = data.candidates[0].content.parts[0].text;

        resultadoTexto.innerHTML = marked.parse(textResponse);
        resultadoContainer.classList.remove('hidden');
        
        setTimeout(() => {
            resultadoContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);

    } catch (error) {
        alert("Erro no diagnóstico: " + error.message);
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalContent;
        btn.classList.remove('opacity-75', 'cursor-not-allowed');
    }
}
