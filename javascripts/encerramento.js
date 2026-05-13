document.addEventListener('DOMContentLoaded', async function() {  // Torna async
    
    // ===== MOSTRA LOADER IMEDIATAMENTE =====
    function mostrarLoader() {
        // Verifica se já existe um loader
        let loader = document.getElementById('loader-encerramento');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'loader-encerramento';
            loader.style.position = 'fixed';
            loader.style.top = '0';
            loader.style.left = '0';
            loader.style.width = '100%';
            loader.style.height = '100%';
            loader.style.backgroundColor = '#212121';
            loader.style.display = 'flex';
            loader.style.justifyContent = 'center';
            loader.style.alignItems = 'center';
            loader.style.zIndex = '9999';
            loader.innerHTML = `
                <div style="text-align: center; color: white;">
                    <img src="assets/Semana1/lumi-ultima-tela.png" style="width: 150px; animation: pulse 1.5s infinite;" alt="Carregando">
                    <p style="margin-top: 20px; font-family: 'Nunito', sans-serif; font-size: 20px;">Verificando sua jornada...</p>
                </div>
            `;
            
            // Adiciona animação de pulse
            const style = document.createElement('style');
            style.textContent = `
                @keyframes pulse {
                    0% { opacity: 0.6; transform: scale(0.95); }
                    50% { opacity: 1; transform: scale(1.05); }
                    100% { opacity: 0.6; transform: scale(0.95); }
                }
            `;
            document.head.appendChild(style);
            
            document.body.appendChild(loader);
        }
    }
    
    function esconderLoader() {
        const loader = document.getElementById('loader-encerramento');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                if (loader && loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
            }, 500);
        }
    }
    
    // Mostra loader imediatamente
    mostrarLoader();
    
    // ===== FUNÇÕES DE SINCRONIZAÇÃO (mesmas das outras páginas) =====
    
    function isUsuarioLogado() {
        const alunoLogado = localStorage.getItem('aluno_logado');
        return alunoLogado === 'true';
    }
    
    async function buscarDadosDoBanco() {
        if (!isUsuarioLogado()) {
            console.log('Usuário não logado, usando apenas localStorage');
            return null;
        }
        
        const userData = window.PassaporteCientifico?.getUserData();
        let email = userData?.email;
        let codigoLogin = userData?.codigoLogin;
        
        if (!email || !codigoLogin) {
            email = localStorage.getItem('aluno_email');
            codigoLogin = localStorage.getItem('aluno_codigo');
            
            if (!email || !codigoLogin) {
                console.log('Dados de usuário não encontrados');
                return null;
            }
        }
        
        try {
            console.log('Buscando dados do banco para sincronizar encerramento...');
            const response = await fetch('https://apps.univesp.br/recurso-educacional-aberto/passaporte-cientifico/diario/buscar', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'email': email,
                    'codigoLogin': codigoLogin
                }
            });
            
            if (!response.ok) {
                console.error('Erro na resposta do servidor:', response.status);
                return null;
            }
            
            const data = await response.json();
            console.log('Dados recebidos do banco:', data);
            return data;
            
        } catch (error) {
            console.error('Erro ao buscar dados do banco:', error);
            return null;
        }
    }
    
    function sincronizarTodasSemanas(dadosBanco) {
        if (!dadosBanco) return false;
        
        // Array para armazenar status dos carimbos
        const carimbosStatus = [false, false, false, false, false, false, false];
        
        // Sincroniza cada semana (1 a 7)
        for (let i = 1; i <= 7; i++) {
            const chaveSemana = `semana${i}Dados`;
            const dadosDaSemana = dadosBanco[chaveSemana];
            
            if (dadosDaSemana) {
                // Salva no localStorage
                localStorage.setItem(`semana${i}Dados`, JSON.stringify(dadosDaSemana));
                console.log(`Sincronizada semana${i} para encerramento:`, dadosDaSemana);
                
                // Atualiza status do carimbo
                if (dadosDaSemana.hasCarimbo === true) {
                    carimbosStatus[i - 1] = true;
                }
            }
        }
        
        // Salva o array completo de carimbos
        localStorage.setItem('passaporte_carimbos', JSON.stringify(carimbosStatus));
        console.log('Carimbos atualizados para encerramento:', carimbosStatus);
        
        return true;
    }
    
    // ===== FUNÇÃO PARA VERIFICAR SE A SEMANA 7 ESTÁ CONCLUÍDA =====
    function semana7Concluida() {
        const dadosKey = `semana7Dados`;
        const dados = localStorage.getItem(dadosKey);
        
        if (!dados) return false;
        
        try {
            const dadosObj = JSON.parse(dados);
            return dadosObj.concluida === true;
        } catch(e) {
            console.error('Erro ao ler semana7:', e);
            return false;
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
            console.log('✅ Todas as semanas concluídas! Mostrando conteúdo completo.');
            if (secaoNaoFinalizado) secaoNaoFinalizado.style.display = 'none';
            if (secaoCompleta1) secaoCompleta1.style.display = 'block';
            if (secaoCompleta2) secaoCompleta2.style.display = 'block';
        } else {
            console.log('⚠️ Ainda faltam semanas para concluir. Mostrando mensagem de pendência.');
            if (secaoNaoFinalizado) secaoNaoFinalizado.style.display = 'block';
            if (secaoCompleta1) secaoCompleta1.style.display = 'none';
            if (secaoCompleta2) secaoCompleta2.style.display = 'none';
        }
    }
    
    // ===== FUNÇÃO PARA ATUALIZAR TEXTO DA MENSAGEM DE PENDÊNCIA =====
    function atualizarMensagemPendencia() {
        const secaoNaoFinalizado = document.querySelector('.encerramento-nao-finalizado');
        if (!secaoNaoFinalizado) return;
        
        const semana7ConcluidaStatus = semana7Concluida();
        const todasConcluidas = todasSemanasConcluidas();
        
        // Se todas estão concluídas, não precisa mostrar mensagem de pendência
        if (todasConcluidas) return;
        
        // Encontra o parágrafo que contém a mensagem da semana 7
        const paragrafos = secaoNaoFinalizado.querySelectorAll('.text-encerramento');
        
        if (!semana7ConcluidaStatus) {
            // Semana 7 não concluída - mostra mensagem específica
            if (paragrafos.length >= 2) {
                paragrafos[0].innerHTML = '⚠️ Você ainda não concluiu a <b>Trilha da Semana 7</b>!';
                paragrafos[1].innerHTML = 'Complete a última semana para ter acesso ao seu portfólio completo e à mensagem de encerramento.';
            }
        } else {
            // Semana 7 concluída, mas outras semanas não - mensagem padrão
            if (paragrafos.length >= 2) {
                paragrafos[0].innerHTML = 'Parabéns por concluir a Trilha da Semana 7!';
                paragrafos[1].innerHTML = 'Conclua as trilhas de todas as outras semanas e retorne a essa página para ter acesso ao seu portfólio completo!';
            }
        }
    }
    
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
    
    // ===== CARREGAMENTO PRINCIPAL - SINCRONIZA PRIMEIRO =====
    
    try {
        // 1. Primeiro, busca e sincroniza dados do banco (se logado)
        if (isUsuarioLogado()) {
            console.log('Usuário logado, sincronizando dados do banco para encerramento...');
            const dadosBanco = await buscarDadosDoBanco();
            if (dadosBanco) {
                sincronizarTodasSemanas(dadosBanco);
                console.log('✅ Todas as semanas sincronizadas com o banco para encerramento');
            } else {
                console.log('⚠️ Não foi possível buscar dados do banco, usando localStorage existente');
            }
        } else {
            console.log('Usuário não logado, usando apenas localStorage para encerramento');
        }
        
        // 2. Verifica se a semana 7 está concluída
        const semana7ConcluidaStatus = semana7Concluida();
        console.log('Status da semana 7:', semana7ConcluidaStatus ? 'Concluída' : 'Não concluída');
        
        // 3. Se a semana 7 NÃO estiver concluída, redireciona para semana-7.html
        if (!semana7ConcluidaStatus) {
            console.log('Semana 7 não concluída. Redirecionando para semana-7.html...');
            // Esconde loader antes de redirecionar
            esconderLoader();
            window.location.href = 'semana-7.html';
            return; // Interrompe a execução
        }
        
        // 4. Se chegou aqui, semana 7 está concluída, então verifica o resto
        atualizarVisibilidadeConteudo();
        atualizarMensagemPendencia();
        
    } catch (error) {
        console.error('Erro durante o carregamento:', error);
    } finally {
        // Esconde o loader após tudo estar pronto
        esconderLoader();
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

    // ===== BOTÃO REINICIAR SEMANA 7 NA SEÇÃO NÃO-FINALIZADO (NOVO) =====
    const botaoReiniciarSemana7NaoFinalizado = document.querySelector('.botao-reiniciar-semana7-encerramento-nao-finalizado');
    if (botaoReiniciarSemana7NaoFinalizado) {
        botaoReiniciarSemana7NaoFinalizado.addEventListener('click', async function() {
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
    
    // ===== SCROLL SUAVE PARA O TOPO =====
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
});