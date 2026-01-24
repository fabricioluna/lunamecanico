// ==========================================
// CONFIGURAÇÃO DA API (COLOQUE SUA CHAVE AQUI)
// ==========================================
const API_KEY = 'COLE_SUA_CHAVE_DO_GOOGLE_STUDIO_AQUI'; 

// ==========================================
// LÓGICA DE LOGIN
// ==========================================
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const passwordInput = document.getElementById('password-input');
    const errorMsg = document.getElementById('login-error');
    const loginScreen = document.getElementById('login-screen');
    const appScreen = document.getElementById('app-screen');

    // Senha definida: luna1989
    if (passwordInput.value === 'luna1989') {
        // Sucesso
        errorMsg.classList.add('hidden');
        
        // Efeito visual de transição
        loginScreen.style.opacity = '0';
        loginScreen.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            loginScreen.classList.add('hidden');
            appScreen.classList.remove('hidden');
            window.scrollTo(0,0);
        }, 500);

    } else {
        // Erro
        errorMsg.classList.remove('hidden');
        passwordInput.classList.add('border-red-500');
        
        // Animação de tremor
        passwordInput.style.animation = "shake 0.5s";
        setTimeout(() => passwordInput.style.animation = "none", 500);
    }
});

// Remove erro ao digitar
document.getElementById('password-input').addEventListener('input', function() {
    this.classList.remove('border-red-500');
    document.getElementById('login-error').classList.add('hidden');
});

// Função de Logout
function logout() {
    location.reload();
}

// ==========================================
// LÓGICA DA INTELIGÊNCIA ARTIFICIAL
// ==========================================
async function analisarComIA() {
    // 1. Pegar elementos
    const btn = document.getElementById('btn-analisar');
    const originalText = btn.innerHTML;
    const resultadoContainer = document.getElementById('resultado-container');
    const resultadoTexto = document.getElementById('resultado-texto');

    // 2. Pegar dados do formulário
    const modelo = document.getElementById('modelo').value;
    const relato = document.getElementById('relato').value;
    
    // Validação Simples
    if (!modelo || !relato) {
        alert("Ops! O Seu Luna precisa saber pelo menos o Modelo do carro e o Relato do problema.");
        return;
    }

    // Coletar checkboxes
    let sintomas = [];
    document.querySelectorAll('.sintoma:checked').forEach(el => sintomas.push(el.value));
    
    let gatilhos = [];
    document.querySelectorAll('.gatilho:checked').forEach(el => gatilhos.push(el.value));

    // 3. UI de Carregamento
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-cog fa-spin"></i> SEU LUNA ESTÁ PENSANDO...';
    btn.classList.add('opacity-75', 'cursor-not-allowed');

    // 4. Montar o Prompt
    const prompt = `
    Atue como o SEU LUNA, mecânico chefe da Luna Autopeças.
    
    DADOS DO CARRO:
    - Veículo: ${modelo}
    - Ano/KM: ${document.getElementById('ano').value} / ${document.getElementById('km').value}
    - Motor/Câmbio: ${document.getElementById('motor').value} / ${document.getElementById('cambio').value}
    
    PROBLEMA:
    - Relato: "${relato}"
    - Sintomas: ${sintomas.join(', ') || 'Nenhum marcado'}
    - Quando ocorre: ${document.getElementById('frequencia').value}, ${gatilhos.join(', ')}

    INSTRUÇÃO:
    Dê um diagnóstico amigável e técnico. Use formatação Markdown.
    Estrutura da resposta:
    1. Saudação do Seu Luna.
    2. O que parece ser (Diagnóstico provável).
    3. Por que isso acontece (Explicação).
    4. Sugestão do que fazer (Teste rápido ou serviço).
    `;

    // 5. Chamada API (Google Gemini)
    try {
        if(API_KEY === 'COLE_SUA_CHAVE_DO_GOOGLE_STUDIO_AQUI') {
            throw new Error("Chave da API não configurada no código.");
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const data = await response.json();
        const textResponse = data.candidates[0].content.parts[0].text;

        // 6. Exibir Resultado
        resultadoTexto.innerHTML = marked.parse(textResponse);
        resultadoContainer.classList.remove('hidden');
        resultadoContainer.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error(error);
        alert("Erro ao conectar com o Seu Luna: " + error.message);
    } finally {
        // Restaurar Botão
        btn.disabled = false;
        btn.innerHTML = originalText;
        btn.classList.remove('opacity-75', 'cursor-not-allowed');
    }
}

// CSS Inline para animação de shake (erro de senha)
const style = document.createElement('style');
style.innerHTML = `
@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
}
`;
document.head.appendChild(style);
