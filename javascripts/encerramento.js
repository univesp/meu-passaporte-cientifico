document.addEventListener('DOMContentLoaded', function() {
    
    // ===== FUNÇÃO PARA VERIFICAR SE TODAS AS SEMANAS FORAM CONCLUÍDAS =====
    function todasSemanasConcluidas() {
        // Verificar cada semana de 1 a 7
        for (let i = 1; i <= 7; i++) {
            const dadosKey = `semana${i}Dados`;
            const dados = localStorage.getItem(dadosKey);
            
            // Se não existir dados para a semana, não está concluída
            if (!dados) {
                return false;
            }
            
            try {
                const dadosObj = JSON.parse(dados);
                // Verificar se o campo concluida é true
                if (dadosObj.concluida !== true) {
                    return false;
                }
            } catch(e) {
                console.error(`Erro ao ler semana${i}:`, e);
                return false;
            }
        }
        return true;
    }
    
    // ===== FUNÇÃO PARA MOSTRAR/ESCONDER AS SEÇÕES DE ACORDO COM O STATUS =====
    function atualizarVisibilidadeConteudo() {
        const todasConcluidas = todasSemanasConcluidas();
        
        // Seção que mostra que falta concluir semanas (encerramento-nao-finalizado)
        const secaoNaoFinalizado = document.querySelector('.encerramento-nao-finalizado');
        
        // Seções que mostram o conteúdo completo
        const secaoCompleta1 = document.querySelector('section:not(.encerramento-nao-finalizado)#introducao-inicio');
        const secaoCompleta2 = document.getElementById('introducao-oQueVoceVaiProduzir');
        
        if (todasConcluidas) {
            // Todas as semanas foram concluídas - mostrar conteúdo completo, esconder o não-finalizado
            if (secaoNaoFinalizado) secaoNaoFinalizado.style.display = 'none';
            if (secaoCompleta1) secaoCompleta1.style.display = 'block';
            if (secaoCompleta2) secaoCompleta2.style.display = 'block';
        } else {
            // Falta concluir alguma semana - mostrar mensagem de não-finalizado, esconder conteúdo completo
            if (secaoNaoFinalizado) secaoNaoFinalizado.style.display = 'block';
            if (secaoCompleta1) secaoCompleta1.style.display = 'none';
            if (secaoCompleta2) secaoCompleta2.style.display = 'none';
        }
        
        // Log para debug
        //console.log('Todas semanas concluídas?', todasConcluidas);
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
    
    // ===== BOTÃO 3: REINICIAR TRILHA DA SEMANA 7 =====
    const botaoReiniciarSemana7 = document.querySelector('.botoes-inicio button:nth-child(3)');
    if (botaoReiniciarSemana7) {
        botaoReiniciarSemana7.addEventListener('click', function() {
            // Remover os dados da semana 7 (incluindo a flag concluida)
            localStorage.removeItem('semana7Dados');
            
            // Também remover o carimbo da semana 7 se existir
            const carimbos = localStorage.getItem('passaporte_carimbos');
            if (carimbos) {
                try {
                    const carimbosArray = JSON.parse(carimbos);
                    carimbosArray[6] = false; // semana 7 é índice 6
                    localStorage.setItem('passaporte_carimbos', JSON.stringify(carimbosArray));
                } catch(e) {
                    console.error('Erro ao resetar carimbo:', e);
                }
            }
            
            // Redirecionar para a semana 7
            window.location.href = 'semana-7.html';
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