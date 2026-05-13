document.addEventListener('DOMContentLoaded', async function() {  // Torna async

    const datasDesbloqueio = CONFIG.getDatasDesbloqueio();
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    // ===== FUNÇÕES DE SINCRONIZAÇÃO (igual às do events-semanas.js) =====
    
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
            console.log('Buscando dados do banco para sincronizar jornadas...');
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
                console.log(`Sincronizada semana${i}:`, dadosDaSemana);
                
                // Atualiza status do carimbo
                if (dadosDaSemana.hasCarimbo === true) {
                    carimbosStatus[i - 1] = true;
                }
            }
        }
        
        // Salva o array completo de carimbos
        localStorage.setItem('passaporte_carimbos', JSON.stringify(carimbosStatus));
        console.log('Carimbos atualizados:', carimbosStatus);
        
        return true;
    }
    
    // ===== CARREGAMENTO PRINCIPAL =====
    
    // 1. Primeiro, busca e sincroniza dados do banco (se logado)
    if (isUsuarioLogado()) {
        console.log('Usuário logado, sincronizando dados do banco...');
        const dadosBanco = await buscarDadosDoBanco();
        if (dadosBanco) {
            sincronizarTodasSemanas(dadosBanco);
            console.log('✅ Todas as semanas sincronizadas com o banco');
        } else {
            console.log('⚠️ Não foi possível buscar dados do banco, usando localStorage existente');
        }
    } else {
        console.log('Usuário não logado, usando apenas localStorage');
    }
    
    // 2. Agora renderiza as jornadas com os dados já sincronizados
    const jornadas = document.querySelectorAll('.jornada');
    
    jornadas.forEach((jornada, index) => {
        const dataDesbloqueio = datasDesbloqueio[index];
        dataDesbloqueio.setHours(0, 0, 0, 0);
        
        const dia = dataDesbloqueio.getDate().toString().padStart(2, '0');
        const mes = (dataDesbloqueio.getMonth() + 1).toString().padStart(2, '0');
        const ano = dataDesbloqueio.getFullYear();
        const dataFormatada = `${dia}/${mes}/${ano}`;
        
        const dataSpan = jornada.querySelector('.data-jornada-liberada');
        if (dataSpan) {
            dataSpan.textContent = dataFormatada;
        }
        
        const estaDesbloqueada = hoje >= dataDesbloqueio;
        const cadeadoContainer = jornada.querySelector('.cadeado-container');
        const checkContainer = jornada.querySelector('.check-container');
        
        if (estaDesbloqueada) {
            jornada.classList.remove('jornada-bloqueada');
            jornada.classList.add('jornada-ativa');
            
            // Verificar se esta semana específica está concluída (agora do localStorage já sincronizado)
            const semanaDados = localStorage.getItem(`semana${index + 1}Dados`);
            let concluida = false;
            
            if (semanaDados) {
                try {
                    const dados = JSON.parse(semanaDados);
                    concluida = dados.concluida === true;
                } catch(e) {
                    concluida = false;
                }
            }
            
            if (concluida) {
                // Concluída: mostra check, esconde cadeado
                if (checkContainer) checkContainer.style.display = 'block';
                if (cadeadoContainer) cadeadoContainer.style.display = 'none';
            } else {
                // Desbloqueada mas não concluída: esconde ambos
                if (checkContainer) checkContainer.style.display = 'none';
                if (cadeadoContainer) cadeadoContainer.style.display = 'none';
            }
            
            jornada.style.cursor = 'pointer';
            jornada.addEventListener('click', function() {
                window.location.href = `semana-${index + 1}.html`;
            });
            
        } else {
            jornada.classList.add('jornada-bloqueada');
            jornada.classList.remove('jornada-ativa');
            
            // Bloqueada: mostra cadeado, esconde check
            if (cadeadoContainer) cadeadoContainer.style.display = 'flex';
            if (checkContainer) checkContainer.style.display = 'none';
        }
    });
    
    const btnVoltar = document.querySelector('.btn-voltar');
    if (btnVoltar) {
        btnVoltar.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
    
});