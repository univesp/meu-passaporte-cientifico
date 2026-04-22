document.addEventListener('DOMContentLoaded', function() {

    const datasDesbloqueio = CONFIG.getDatasDesbloqueio(); //Datas definidas em datas-config.js
  
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
  
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
            
            // Verificar se esta semana específica está concluída
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