// =======================================================
// 🔑 CONFIGURAÇÃO
// =======================================================
// Substitua pela sua chave real do Google AI Studio
const API_KEY = 'COLE_SUA_CHAVE_AQUI'; 

document.addEventListener('DOMContentLoaded', function() {
    
    // ---------------------------------------------------
    // 1. LÓGICA DE LOGIN
    // ---------------------------------------------------
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
                // Login Sucesso
                errorMsg.classList.add('hidden');
                
                // Animação Fade Out
                loginScreen.style.opacity = '0';
                loginScreen.style.transition = 'opacity 0.5s ease';
                
                setTimeout(() => {
                    loginScreen.style.display = 'none';
                    appScreen.classList.remove('hidden');
                    // Reset scroll
                    window.scrollTo(0,0);
                }, 500);

            } else {
                // Erro
                errorMsg.classList.remove('hidden');
                passwordInput.classList.add('border-red-500');
                passwordInput.classList.remove('border-amber-500/30');
            }
        });

        // Limpar erro ao digitar
        const passInput = document.getElementById('password-input');
        passInput.addEventListener('input', function() {
            this.classList.remove('border-red-500');
            this.classList.add('border-amber-500/30');
            document.getElementById('login-error').classList.add('hidden');
        });
    }

    // ---------------------------------------------------
    // 2. BOTÃO DE ANÁLISE (IA)
    // ---------------------------------------------------
    const btnAnalisar = document.getElementById('btn-analisar');
    if (btnAnalisar) {
        btnAnalisar.addEventListener('click', analisarComIA);
    }
});

// Função Logout
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

    // Coleta de Dados
    const modelo = document.getElementById('modelo').value;
    const relato = document.getElementById('relato').value;
    const placa = document.getElementById('placa').value;
    const ano = document.getElementById('ano').value;
    const km = document.getElementById('km').value;
    const motor = document.getElementById('motor').value;
    const cambio = document.getElementById('cambio').value;

    // Checkboxes (Sintomas e Gatilhos)
    let sintomas = [];
    document.querySelectorAll('.sintoma:checked').forEach(el => sintomas.push(el.value));
    
    let gatilhos = [];
    document.querySelectorAll('.gatilho:checked').forEach(el => gatilhos.push(el.value));
    
    // Radio Button (Frequência)
    const frequenciaEl = document.querySelector('input[name="frequencia"]:checked');
    const frequencia = frequenciaEl ? frequenciaEl.value : "Não informado";
    
    const condicao = document.getElementById('condicao').value;

    // Validação
    if (!modelo || !relato) {
        alert("Opa! O Seu Luna precisa saber pelo menos o Modelo do carro e o Relato do problema.");
        return;
    }

    // UI Loading
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-cog fa-spin"></i> O SEU LUNA ESTÁ PENSANDO...';
    btn.classList.add('opacity-75', 'cursor-not-allowed');

    // Prompt
    const prompt = `
    Atue como o SEU LUNA, um mecânico experiente, simpático e honesto da Luna Autopeças.
    
    DADOS DO CLIENTE:
    - Veículo: ${modelo} ${placa ? `(${placa})` : ''}
    - Detalhes: Ano ${ano}, KM ${km}, Motor ${motor}, Câmbio ${cambio}
    
    QUEIXA:
    "${relato}"
    
    OBSERVAÇÕES TÉCNICAS:
    - Sintomas marcados: ${sintomas.join(', ') || 'Nenhum'}
    - Contexto: Acontece ${frequencia}. Condição: ${condicao}.
    - Histórico recente: ${gatilhos.join(', ') || 'Nada relevante'}

    INSTRUÇÃO:
    Gere um diagnóstico técnico em Markdown.
    1. Saudação do Seu Luna (use emojis).
    2. Título do provável defeito.
    3. Explicação simples do porquê (Causalidade).
    4. Lista de 3 principais suspeitas (Ranking).
    5. Recomendação de teste ou serviço na oficina.
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

        // Renderizar
        resultadoTexto.innerHTML = marked.parse(textResponse);
        resultadoContainer.classList.remove('hidden');
        
        // Scroll
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
