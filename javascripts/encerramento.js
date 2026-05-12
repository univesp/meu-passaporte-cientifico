document.addEventListener('DOMContentLoaded', function() {
    
    // ===== FUNÇÃO PARA ENVIAR DADOS VAZIOS PARA O BANCO (SEMANA 7) =====
    async function enviarResetParaBanco() {
        // Verifica se está logado
        if (!window.PassaporteCientifico?.isLogado()) return;
        
        const userData = window.PassaporteCientifico?.getUserData();
        if (!userData?.email || !userData?.codigoLogin) return;
        
        // Dados vazios para a semana 7
        const dadosVazios = {
            nomeAluno: '',
            local: '',
            dataCheckIn: '',
            descricaoLocal: '',
            atividade: '',
            aprendizado: '',
            reflexoes: '',
            hasCarimbo: false,
            concluida: false
        };
        
        const body = {
            semana7Dados: dadosVazios
        };
        
        console.log('Enviando reset da semana 7 para API:', body);
        
        try {
            const response = await fetch('https://apps.univesp.br/recurso-educacional-aberto/passaporte-cientifico/diario/salvar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'email': userData.email,
                    'codigoLogin': userData.codigoLogin
                },
                body: JSON.stringify(body)
            });
            
            const data = await response.json();
            console.log('✅ Reset da semana 7 salvo no banco:', data);
        } catch (error) {
            console.error('❌ Erro ao resetar semana 7 no banco:', error);
        }
    }
    
    // ===== FUNÇÃO PARA VERIFICAR SE TODAS AS SEMANAS FORAM CONCLUÍDAS =====
    function todasSemanasConcluidas() {
        for (let i = 1; i <= 7; i++) {
            const dadosKey = `semana${i}Dados`;
            const dados = localStorage.getItem(dadosKey);
            
            if (!dados) return false;
            
            try {
                const dadosObj = JSON.parse(dados);
                if (dadosObj.concluida !== true) return false;
            } catch(e) {
                console.error(`Erro ao ler semana${i}:`, e);
                return false;
            }
        }
        return true;
    }
    
    // ===== FUNÇÃO PARA MOSTRAR/ESCONDER AS SEÇÕES =====
    function atualizarVisibilidadeConteudo() {
        const todasConcluidas = todasSemanasConcluidas();
        
        const secaoNaoFinalizado = document.querySelector('.encerramento-nao-finalizado');
        const secaoCompleta1 = document.querySelector('section:not(.encerramento-nao-finalizado)#introducao-inicio');
        const secaoCompleta2 = document.getElementById('introducao-oQueVoceVaiProduzir');
        
        if (todasConcluidas) {
            if (secaoNaoFinalizado) secaoNaoFinalizado.style.display = 'none';
            if (secaoCompleta1) secaoCompleta1.style.display = 'block';
            if (secaoCompleta2) secaoCompleta2.style.display = 'block';
        } else {
            if (secaoNaoFinalizado) secaoNaoFinalizado.style.display = 'block';
            if (secaoCompleta1) secaoCompleta1.style.display = 'none';
            if (secaoCompleta2) secaoCompleta2.style.display = 'none';
        }
    }
    
    // ===== BOTÃO 1: VOLTAR PARA AS JORNADAS =====
    const botaoVoltarJornadas = document.querySelector('.botoes-inicio button:first-child');
    if (botaoVoltarJornadas) {
        botaoVoltarJornadas.addEventListener('click', function() {
            window.location.href = 'jornadas.html';
        });
    }
    
    // ===== BOTÃO 2: IR PARA O PORTFÓLIO =====
    const botaoIrPortfolio = document.querySelector('.botoes-inicio button:nth-child(2)');
    if (botaoIrPortfolio) {
        botaoIrPortfolio.addEventListener('click', function() {
            window.location.href = 'portfolio.html';
        });
    }
    
    // ===== BOTÃO 3: REINICIAR TRILHA DA SEMANA 7 (SEM ALERT) =====
    const botaoReiniciarSemana7 = document.querySelector('.botoes-inicio button:nth-child(3)');
    if (botaoReiniciarSemana7) {
        botaoReiniciarSemana7.addEventListener('click', async function() {
            // 1. Remove os dados da semana 7 do localStorage
            localStorage.removeItem('semana7Dados');
            
            // 2. Remove o carimbo da semana 7 do array de carimbos
            const carimbos = localStorage.getItem('passaporte_carimbos');
            if (carimbos) {
                try {
                    const carimbosArray = JSON.parse(carimbos);
                    carimbosArray[6] = false;
                    localStorage.setItem('passaporte_carimbos', JSON.stringify(carimbosArray));
                } catch(e) {
                    console.error('Erro ao resetar carimbo:', e);
                }
            }
            
            // 3. Envia dados vazios para o banco
            await enviarResetParaBanco();
            
            // 4. Redirecionar para a semana 7
            window.location.href = 'semana-7.html';
        });
    }
    
    // ===== BOTÕES DA SEÇÃO NÃO-FINALIZADO =====
    const botaoVoltarJornadasNaoFinalizado = document.querySelector('.encerramento-nao-finalizado .button-style');
    if (botaoVoltarJornadasNaoFinalizado) {
        botaoVoltarJornadasNaoFinalizado.addEventListener('click', function() {
            window.location.href = 'jornadas.html';
        });
    }
    
    // ===== SCROLL SUAVE PARA O TOPO =====
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    // ===== EXECUTAR A VERIFICAÇÃO AO CARREGAR A PÁGINA =====
    atualizarVisibilidadeConteudo();
});