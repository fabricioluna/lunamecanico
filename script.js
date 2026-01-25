document.addEventListener('DOMContentLoaded', function() {
    
    // =======================================================
    // 1. LÓGICA DE LOGIN
    // =======================================================
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const passwordInput = document.getElementById('password-input');
            const errorMsg = document.getElementById('login-error');
            const loginScreen = document.getElementById('login-screen');
            const appScreen = document.getElementById('app-screen');

            // Remove espaços extras
            const senhaDigitada = passwordInput.value.trim();

            if (senhaDigitada === 'luna1989') {
                // Sucesso
                errorMsg.classList.add('hidden');
                
                // Animação de saída
                loginScreen.style.opacity = '0';
                loginScreen.style.transition = 'opacity 0.5s ease';
                
                setTimeout(() => {
                    loginScreen.style.display = 'none';
                    appScreen.classList.remove('hidden');
                    window.scrollTo(0,0);
                }, 500);

            } else {
                // Erro
                errorMsg.classList.remove('hidden');
                passwordInput.classList.add('border-red-500');
                passwordInput.classList.remove('border-amber-500/30');
            }
        });
        
        // Remove erro ao digitar
        const passInput = document.getElementById('password-input');
        passInput.addEventListener('input', function() {
            this.classList.remove('border-red-500');
            this.classList.add('border-amber-500/30');
            document.getElementById('login-error').classList.add('hidden');
        });
    }

    // =======================================================
    // 2. CONFIGURAÇÃO DO BOTÃO DE ANÁLISE
    // =======================================================
    const btnAnalisar = document.getElementById('btn-analisar');
    if (btnAnalisar) {
        btnAnalisar.addEventListener('click', analisarComIA);
    }
});

// Função de Logout
function logout() {
    location.reload();
}

// =======================================================
// 3. LÓGICA DO SEU LUNA (CONEXÃO COM VERCEL/IA)
// =======================================================
async function analisarComIA() {
    const btn = document.getElementById('btn-analisar');
    const originalContent = btn.innerHTML;
    const resultadoContainer = document.getElementById('resultado-container');
    const resultadoTexto = document.getElementById('resultado-texto');

    // ---------------------------------------------------
    // A. COLETA DE DADOS (FORMULÁRIO COMPLETO)
    // ---------------------------------------------------

    // Helper para pegar valores de checkboxes marcados
    const getCheckedValues = (className) => {
        let values = [];
        document.querySelectorAll(`.${className}:checked`).forEach(el => values.push(el.value));
        return values;
    };

    // 1. Identificação
    const modelo = document.getElementById('modelo').value;
    const ano = document.getElementById('ano').value;
    const km = document.getElementById('km').value;
    const motor = document.getElementById('motor').value;
    const cambio = document.getElementById('cambio').value;

    // 2. Sintomas Gerais + Inputs "Outros"
    let sintomas = getCheckedValues('sintoma');
    
    const outraLuz = document.getElementById('outra-luz')?.value;
    if(outraLuz) sintomas.push(`Outra Luz: ${outraLuz}`);

    const outroMotor = document.getElementById('outro-motor')?.value;
    if(outroMotor) sintomas.push(`Outro Motor: ${outroMotor}`);

    const outraDirecao = document.getElementById('outra-direcao')?.value;
    if(outraDirecao) sintomas.push(`Outra Direção: ${outraDirecao}`);

    const outroFreio = document.getElementById('outro-freio')?.value;
    if(outroFreio) sintomas.push(`Outro Freio: ${outroFreio}`);

    // 3. Ruídos
    let ruidos = getCheckedValues('ruido');
    const outroRuido = document.getElementById('outro-ruido')?.value;
    if(outroRuido) ruidos.push(`Outro Ruído: ${outroRuido}`);

    // 4. Condições
    let condicoes = getCheckedValues('condicao');
    const outraCondicao = document.getElementById('outra-condicao')?.value;
    if(outraCondicao) condicoes.push(`Outra Condição: ${outraCondicao}`);

    // 5. Histórico
    let historico = getCheckedValues('historico');
    const manutencao = document.getElementById('manutencao-recente')?.value;
    if(manutencao) historico.push(`Manutenção Recente: ${manutencao}`);
    
    const outroHistorico = document.getElementById('outro-historico')?.value;
    if(outroHistorico) historico.push(`Outro Histórico: ${outroHistorico}`);

    // 6. Cheiros
    let cheiros = getCheckedValues('cheiro');
    const outroCheiro = document.getElementById('outro-cheiro')?.value;
    if(outroCheiro) cheiros.push(`Outro Cheiro: ${outroCheiro}`);

    // 7. Fluidos
    let fluidos = getCheckedValues('fluido');
    const outroFluido = document.getElementById('outro-fluido')?.value;
    if(outroFluido) fluidos.push(`Outro Fluido: ${outroFluido}`);

    // 8. Transmissão
    let transmissao = getCheckedValues('transmissao');
    const outraTransmissao = document.getElementById('outra-transmissao')?.value;
    if(outraTransmissao) transmissao.push(`Outra Transmissão: ${outraTransmissao}`);

    // 9. Elétrica
    let eletrica = getCheckedValues('eletrica');
    const idadeBateria = document.getElementById('idade-bateria')?.value;
    const outraEletrica = document.getElementById('outra-eletrica')?.value;
    if(outraEletrica) eletrica.push(`Outra Elétrica: ${outraEletrica}`);

    // 10. Frequência
    const frequenciaEl = document.querySelector('input[name="frequencia"]:checked');
    const frequencia = frequenciaEl ? frequenciaEl.value : "Não informado";

    // Resumo/Relato
    const relato = document.getElementById('relato').value;

    // ---------------------------------------------------
    // B. VALIDAÇÃO
    // ---------------------------------------------------
    if (!modelo) {
        alert("Por favor, preencha pelo menos o Modelo do veículo.");
        // Rola a tela para o topo para mostrar o campo
        document.getElementById('modelo').scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    // ---------------------------------------------------
    // C. PREPARAÇÃO DO PROMPT
    // ---------------------------------------------------
    
    // UI Loading
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-cog fa-spin"></i> O SEU LUNA ESTÁ ANALISANDO...';
    btn.classList.add('opacity-75', 'cursor-not-allowed');

    const prompt = `
    Atue como o SEU LUNA, mecânico chefe experiente e simpático da Luna Autopeças.
    Analise este diagnóstico automotivo detalhado:

    1. VEÍCULO: ${modelo} | Ano: ${ano} | KM: ${km} | Motor: ${motor} | Câmbio: ${cambio}
    
    2. SINTOMAS PRINCIPAIS: ${sintomas.join(', ') || 'Nenhum marcado'}
    3. RUÍDOS IDENTIFICADOS: ${ruidos.join(', ') || 'Nenhum'}
    4. CONDIÇÕES DE OCORRÊNCIA: ${condicoes.join(', ') || 'Nenhuma específica'}
    5. HISTÓRICO RECENTE: ${historico.join(', ') || 'Nada relevante'}
    6. CHEIROS: ${cheiros.join(', ') || 'Nenhum'}
    7. FLUIDOS/VAZAMENTOS: ${fluidos.join(', ') || 'Nenhum'}
    8. TRANSMISSÃO: ${transmissao.join(', ') || 'Sem queixas'}
    9. ELÉTRICA: ${eletrica.join(', ') || 'Sem queixas'} (Bateria: ${idadeBateria} anos)
    10. FREQUÊNCIA: ${frequencia}
    
    RELATO DO MOTORISTA: "${relato}"

    INSTRUÇÃO:
    Gere um relatório técnico em Markdown, direto e educativo.
    1. Saudação do Seu Luna (use emojis).
    2. 🎯 DIAGNÓSTICO PRINCIPAL: Qual é o defeito mais provável?
    3. 🧠 POR QUE ISSO ACONTECE? Explique a lógica cruzando os dados (Ex: "O cheiro X + barulho Y indica Z").
    4. 📋 OUTRAS POSSIBILIDADES (Top 3): O que mais pode ser?
    5. 🔧 RECOMENDAÇÃO: Qual teste pedir para o mecânico fazer primeiro?
    `;

    // ---------------------------------------------------
    // D. ENVIO PARA API (VERCEL)
    // ---------------------------------------------------
    try {
        // Agora chamamos a SUA API na Vercel, não o Google direto
        const response = await fetch('/api/diagnostico', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: prompt }) 
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        // O texto da IA vem dentro da estrutura do Gemini
        // Ajuste conforme o retorno do seu arquivo api/diagnostico.js
        // Se o seu api/diagnostico.js retorna o objeto completo do Google:
        const textResponse = data.candidates[0].content.parts[0].text;

        // Renderizar na tela
        resultadoTexto.innerHTML = marked.parse(textResponse);
        resultadoContainer.classList.remove('hidden');
        
        // Scroll suave até o resultado
        setTimeout(() => {
            resultadoContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);

    } catch (error) {
        console.error(error);
        alert("Ocorreu um
