document.addEventListener('DOMContentLoaded', function() {

    // Tela recarregada sempre inicia no topo
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

    // Elementos
    const bullets = document.querySelectorAll('.bullet-item');
    const bulletsContainer = document.querySelector('.bullets');
    const casas = document.querySelectorAll('.casa-content');
    const setaEsquerda = document.querySelector('.arrows-container img:first-child');
    const setaDireita = document.querySelector('.arrows-container img:last-child');
    const setasContainer = document.querySelector('.arrows-container');
    const setaEsquerdaMobile = document.querySelector('#arrows-container-mobile .arrow-left-container');
    const setaDireitaMobile = document.querySelector('#arrows-container-mobile .arrow-right-container');
    const semanaContentBox = document.querySelector('.semana-content-box');
    const passaporteContainer = document.querySelector('.passaporte-container');
    const botaoCarimbo = document.querySelector('.botao-carimbo-trilha');
    const botaoConclusao = document.querySelector('.botao-conclusao-trilha-container');
    const botoesConclusaoContainer = document.querySelector('.buttons-conclusao-container');
    const conteudoBloqueado = document.querySelector('#conteudoBloqueado');
    const conteudoDesbloqueado = document.querySelector('#conteudoDesbloqueado');
    
    // ===== IDENTIFICAR A SEMANA ATUAL =====
    const semanaId = semanaContentBox.id; // "semana1", "semana2", etc.
    const numeroSemana = parseInt(semanaId.replace('semana', ''));

    // LÓGICA PARA BLOQUEIO / DESBLOQUEIO DE CONTEÚDO
    const datasDesbloqueio = CONFIG.getDatasDesbloqueio(); //Datas definidas em datas-config.js
    
    // Data atual
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    // Criar array baseado na data
    let semanaDesbloqueada = datasDesbloqueio.map(dataDesbloqueio => {
        const data = new Date(dataDesbloqueio);
        data.setHours(0, 0, 0, 0);
        return hoje >= data;
    });

    for (let i = 0; i < semanaDesbloqueada.length; i++) {

       if(numeroSemana === i+1) {

        // Insere a data no campo determinado no html no formato dd/mm
        const dataSpan = document.querySelector('.data-desbloqueio');
        if (dataSpan) {
            const data = datasDesbloqueio[i];
            const dia = data.getDate().toString().padStart(2, '0');
            const mes = (data.getMonth() + 1).toString().padStart(2, '0');
            dataSpan.innerText = `${dia}/${mes}`;
        }

        // Desbloqueia/Bloqueia a semana
        if(semanaDesbloqueada[i]) {
            conteudoDesbloqueado.style.display = 'block';
            bulletsContainer.style.display = 'flex';
            conteudoBloqueado.style.display = 'none';
        } else {
            conteudoDesbloqueado.style.display = 'none';
            bulletsContainer.style.display = 'none';
            conteudoBloqueado.style.display = 'flex';
        }
       }        
    }
    
    // Elementos da Casa 6 (sempre a última casa)
    const tituloCasa6 = document.getElementById('tituloCasa6');
    const textoCasa6 = document.getElementById('textoCasa6');
    const ultimaTelaCasa6 = document.querySelector('.casa6-ultima-tela');
    
    // Array com os IDs dos carimbos (7 carimbos para 7 semanas)
    const carimbos = [
      document.getElementById('carimbo1'),
      document.getElementById('carimbo2'),
      document.getElementById('carimbo3'),
      document.getElementById('carimbo4'),
      document.getElementById('carimbo5'),
      document.getElementById('carimbo6'),
      document.getElementById('carimbo7')
    ];
    
    let casaAtual = 0;
    let modoConclusaoAtivo = false;
    
    // ===== FUNÇÕES DO LOCALSTORAGE =====
    const STORAGE_KEY = 'passaporte_carimbos';
    
    // Carregar estado dos carimbos do localStorage
    function carregarCarimbosStorage() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('Erro ao carregar localStorage:', e);
                return [false, false, false, false, false, false, false];
            }
        }
        return [false, false, false, false, false, false, false];
    }
    
    // Salvar estado dos carimbos no localStorage
    function salvarCarimbosStorage() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(carimbosRecebidos));
    }
    
    // Função para carregar o status de conclusão da semana (agora lê dos dados)
    function carregarConclusaoStorage() {
        const dadosSalvos = localStorage.getItem(`${semanaId}Dados`);
        if (dadosSalvos) {
            try {
                const dados = JSON.parse(dadosSalvos);
                return dados.concluida === true;
            } catch(e) {
                return false;
            }
        }
        return false;
    }
    
    // Estado dos carimbos (false = não recebido, true = recebido)
    let carimbosRecebidos = carregarCarimbosStorage();
    let semanaConcluida = carregarConclusaoStorage();
  
    // Verificações iniciais
    if (casas.length === 0) {
        console.error('❌ Nenhuma casa encontrada!');
        return;
    }
  
    if (bullets.length === 0) {
        console.error('❌ Nenhum bullet encontrado!');
        return;
    }
  
    if (!semanaContentBox) {
        console.error('❌ Elemento .semana-content-box não encontrado!');
        return;
    }
  
    if (casas.length !== bullets.length) {
        console.warn(`Aviso: Número de casas (${casas.length}) diferente do número de bullets (${bullets.length})`);
    }
  
    // Função para inicializar os carimbos
    function inicializarCarimbos() {
        carimbos.forEach(carimbo => {
            if (carimbo) {
                carimbo.style.display = 'none';
            }
        });
    }
  
    function atualizarCarimbos() {
        carimbos.forEach((carimbo, index) => {
            if (carimbo && carimbosRecebidos[index]) {
                carimbo.style.display = 'block';
            }
        });
    }

    // Função para salvar dados do usuário
    function salvarDadosUsuario() {
        try {
            const dadosExistentes = localStorage.getItem(`${semanaId}Dados`);
            let dados = dadosExistentes ? JSON.parse(dadosExistentes) : {};
            
            dados.nomeAluno = document.getElementById('nomeAluno')?.value || '';
            dados.local = document.getElementById('localVisita')?.value || '';
            dados.dataCheckIn = document.querySelector('.data-checkIn')?.textContent || '';
            dados.descricaoLocal = document.getElementById('descricaoLocal')?.value || '';
            dados.atividade = document.getElementById('registroAtividade')?.value || '';
            dados.aprendizado = document.getElementById('registroAprendizado')?.value || '';
            dados.reflexoes = document.getElementById('registroReflexoes')?.value || '';
            dados.dataSalvamento = new Date().toISOString();
            
            localStorage.setItem(`${semanaId}Dados`, JSON.stringify(dados));
        } catch(e) {
            console.error('Erro ao salvar:', e);
        }
    }
        
    // Função para carregar dados do usuário
    function carregarDadosUsuario() {
        try {
            const dadosSalvos = localStorage.getItem(`${semanaId}Dados`);
            if (!dadosSalvos) return;
            
            const dados = JSON.parse(dadosSalvos);
            
            document.getElementById('nomeAluno') && (document.getElementById('nomeAluno').value = dados.nomeAluno || '');
            document.getElementById('localVisita') && (document.getElementById('localVisita').value = dados.local || '');
            document.getElementById('descricaoLocal') && (document.getElementById('descricaoLocal').value = dados.descricaoLocal || '');
            document.getElementById('registroAtividade') && (document.getElementById('registroAtividade').value = dados.atividade || '');
            document.getElementById('registroAprendizado') && (document.getElementById('registroAprendizado').value = dados.aprendizado || '');
            document.getElementById('registroReflexoes') && (document.getElementById('registroReflexoes').value = dados.reflexoes || '');
            
            // Carregar o status de conclusão
            if (dados.concluida !== undefined) {
                semanaConcluida = dados.concluida;
            }
        } catch(e) {
            console.error('Erro ao carregar:', e);
        }
    }
  
    // Função para resetar o estado da Casa 6
    function resetarCasa6() {
        if (tituloCasa6) tituloCasa6.style.display = 'block';
        if (textoCasa6) textoCasa6.style.display = 'block';
        if (botaoCarimbo) botaoCarimbo.style.display = 'block';
        if (ultimaTelaCasa6) ultimaTelaCasa6.style.display = 'none';
        
        if (passaporteContainer && casaAtual === casas.length - 1) {
            passaporteContainer.style.display = 'flex';
            atualizarCarimbos();
        }
        
        if (botoesConclusaoContainer) {
            botoesConclusaoContainer.style.display = 'none';
        }
        
        if (botaoConclusao) {
            botaoConclusao.style.display = 'flex';
            const botao = botaoConclusao.querySelector('button');
            if (botao) botao.textContent = 'Concluir';
        }
        
        if (bulletsContainer) {
            bulletsContainer.style.display = 'flex';
        }
        
        if (setasContainer) {
            setasContainer.style.display = 'flex';
        }
        
        modoConclusaoAtivo = false;
    }
  
    // Função para ativar o modo de conclusão
    function ativarModoConclusao() {
        salvarDadosUsuario();

        // Marcar semana como concluída dentro do objeto de dados
        const dadosSalvos = localStorage.getItem(`${semanaId}Dados`);
        if (dadosSalvos) {
            const dados = JSON.parse(dadosSalvos);
            dados.concluida = true;
            dados.dataConclusao = new Date().toISOString();
            localStorage.setItem(`${semanaId}Dados`, JSON.stringify(dados));
        }

        semanaConcluida = true;

        // Se for a semana 7, redirecionar para encerramento.html
        if (numeroSemana === 7) {
            window.location.href = 'encerramento.html';
            return;
        }

        casas.forEach((casa, i) => {
            casa.style.display = 'none';
        });
        
        const ultimaCasa = document.getElementById(`casa${casas.length}`);
        if (ultimaCasa) {
            ultimaCasa.style.display = 'flex';
        }
        
        if (tituloCasa6) tituloCasa6.style.display = 'none';
        if (textoCasa6) textoCasa6.style.display = 'none';
        if (botaoCarimbo) botaoCarimbo.style.display = 'none';
        if (ultimaTelaCasa6) {
            ultimaTelaCasa6.style.display = 'flex';
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });
        } 
        
        if (passaporteContainer) {
            passaporteContainer.style.display = 'none';
        }
        
        if (botaoConclusao) {
            botaoConclusao.style.display = 'none';
        }
        
        if (botoesConclusaoContainer) {
            botoesConclusaoContainer.style.display = 'flex';
        }
        
        if (bulletsContainer) {
            bulletsContainer.style.display = 'none';
        }
        
        if (setasContainer) {
            setasContainer.style.display = 'none';
        }
        
        modoConclusaoAtivo = true;
    }
  
    function atualizarBotaoCarimbo() {
        if (!botaoCarimbo) return;
        
        if (modoConclusaoAtivo) {
            botaoCarimbo.style.display = 'none';
            return;
        }
        
        if (numeroSemana >= 1 && numeroSemana <= 7) {
            const indiceCarimbo = numeroSemana - 1;
            
            if (carimbosRecebidos[indiceCarimbo]) {
                botaoCarimbo.style.backgroundColor = '#818181';
                botaoCarimbo.style.cursor = 'default';
                botaoCarimbo.style.pointerEvents = 'none';
                botaoCarimbo.disabled = true;
                botaoCarimbo.textContent = 'Carimbo recebido';
                botaoCarimbo.style.display = 'block';
            } else {
                botaoCarimbo.style.backgroundColor = '';
                botaoCarimbo.style.cursor = 'pointer';
                botaoCarimbo.style.pointerEvents = 'auto';
                botaoCarimbo.style.opacity = '1';
                botaoCarimbo.disabled = false;
                botaoCarimbo.textContent = 'Receber carimbo';
                botaoCarimbo.style.display = 'block';
            }
        }
    }
  
    function atualizarBotaoConclusao(index) {
        if (!botaoConclusao) return;
        
        const carimboAtualRecebido = carimbosRecebidos[numeroSemana - 1];
        
        if (index === casas.length - 1 && carimboAtualRecebido) {
            botaoConclusao.style.display = 'flex';
            
            if (semanaConcluida && !modoConclusaoAtivo) {
                ativarModoConclusao();
            } else if (!semanaConcluida && modoConclusaoAtivo) {
                resetarCasa6();
            }
        } else {
            botaoConclusao.style.display = 'none';
            if (modoConclusaoAtivo) {
                resetarCasa6();
            }
        }
    }
  
    function atualizarVisibilidadePassaporte(index) {
        if (!passaporteContainer) return;
        
        if (modoConclusaoAtivo) {
            passaporteContainer.style.display = 'none';
            return;
        }
        
        if (index === casas.length - 1) {
            passaporteContainer.style.display = 'flex';
            atualizarCarimbos();
        } else {
            passaporteContainer.style.display = 'none';
        }
    }
  
    function atualizarPaddingSemanaBox(index) {
        const paddingClasses = [
            'casa1-padding',
            'casa2-padding', 
            'casa3-padding',
            'casa4-padding',
            'casa5-padding',
            'casa6-padding'
        ];
        
        paddingClasses.forEach(cls => {
            semanaContentBox.classList.remove(cls);
        });
        
        semanaContentBox.classList.add(`casa${index + 1}-padding`);
    }
  
    function mostrarCasa(index) {
        if (index < 0 || index >= casas.length) {
            console.error(`❌ Índice inválido: ${index}`);
            return;
        }
        
        casas.forEach((casa, i) => {
            casa.style.display = 'none';
        });
        
        casas[index].style.display = 'flex';
        
        bullets.forEach((bullet, i) => {
            if (i === index) {
                bullet.classList.add('bullet-ativo');
            } else {
                bullet.classList.remove('bullet-ativo');
            }
        });
        
        atualizarPaddingSemanaBox(index);
        atualizarVisibilidadePassaporte(index);
        atualizarBotaoCarimbo();
        atualizarBotaoConclusao(index);
        atualizarSetas(index);
        
        casaAtual = index;
    }
  
    function atualizarSetas(index) {
        if (!setaEsquerda || !setaDireita) {
            console.warn('Setas não encontradas');
            return;
        }
        
        const caminhoSetasAtivas = `assets/Semana${numeroSemana}/`;
        
        // Elementos desktop
        if (index === 0) {
            setaEsquerda.src = 'assets/arquivos_gerais_semanas/seta-esquerda-desativa.svg';
            setaDireita.src = `${caminhoSetasAtivas}seta-direita-ativa.svg`;
            setaEsquerda.style.opacity = '0.5';
            setaDireita.style.opacity = '1';
            setaEsquerda.style.pointerEvents = 'none';
            setaDireita.style.pointerEvents = 'auto';
            
            // Atualizar elementos mobile
            if (setaEsquerdaMobile) {
                const imgEsq = setaEsquerdaMobile.querySelector('img');
                const spanEsq = setaEsquerdaMobile.querySelector('span');
                if (imgEsq) {
                    imgEsq.src = 'assets/arquivos_gerais_semanas/seta-esquerda-desativa.svg';
                    imgEsq.style.opacity = '0.5';
                }
                if (spanEsq) spanEsq.style.opacity = '0.5';
                setaEsquerdaMobile.style.pointerEvents = 'none';
            }
            
            if (setaDireitaMobile) {
                const imgDir = setaDireitaMobile.querySelector('img');
                const spanDir = setaDireitaMobile.querySelector('span');
                if (imgDir) {
                    imgDir.src = `${caminhoSetasAtivas}seta-direita-ativa.svg`;
                    imgDir.style.opacity = '1';
                }
                if (spanDir) spanDir.style.opacity = '1';
                setaDireitaMobile.style.pointerEvents = 'auto';
            }
            
        } else if (index === casas.length - 1) {
            setaEsquerda.src = `${caminhoSetasAtivas}seta-esquerda-ativa.svg`;
            setaDireita.src = 'assets/arquivos_gerais_semanas/seta-direita-desativa.svg';
            setaEsquerda.style.opacity = '1';
            setaDireita.style.opacity = '0.5';
            setaEsquerda.style.pointerEvents = 'auto';
            setaDireita.style.pointerEvents = 'none';
            
            // Atualizar elementos mobile
            if (setaEsquerdaMobile) {
                const imgEsq = setaEsquerdaMobile.querySelector('img');
                const spanEsq = setaEsquerdaMobile.querySelector('span');
                if (imgEsq) {
                    imgEsq.src = `${caminhoSetasAtivas}seta-esquerda-ativa.svg`;
                    imgEsq.style.opacity = '1';
                }
                if (spanEsq) spanEsq.style.opacity = '1';
                setaEsquerdaMobile.style.pointerEvents = 'auto';
            }
            
            if (setaDireitaMobile) {
                const imgDir = setaDireitaMobile.querySelector('img');
                const spanDir = setaDireitaMobile.querySelector('span');
                if (imgDir) {
                    imgDir.src = 'assets/arquivos_gerais_semanas/seta-direita-desativa.svg';
                    imgDir.style.opacity = '0.5';
                }
                if (spanDir) spanDir.style.opacity = '0.5';
                setaDireitaMobile.style.pointerEvents = 'none';
            }
            
        } else {
            setaEsquerda.src = `${caminhoSetasAtivas}seta-esquerda-ativa.svg`;
            setaDireita.src = `${caminhoSetasAtivas}seta-direita-ativa.svg`;
            setaEsquerda.style.opacity = '1';
            setaDireita.style.opacity = '1';
            setaEsquerda.style.pointerEvents = 'auto';
            setaDireita.style.pointerEvents = 'auto';
            
            // Atualizar elementos mobile
            if (setaEsquerdaMobile) {
                const imgEsq = setaEsquerdaMobile.querySelector('img');
                const spanEsq = setaEsquerdaMobile.querySelector('span');
                if (imgEsq) {
                    imgEsq.src = `${caminhoSetasAtivas}seta-esquerda-ativa.svg`;
                    imgEsq.style.opacity = '1';
                }
                if (spanEsq) spanEsq.style.opacity = '1';
                setaEsquerdaMobile.style.pointerEvents = 'auto';
            }
            
            if (setaDireitaMobile) {
                const imgDir = setaDireitaMobile.querySelector('img');
                const spanDir = setaDireitaMobile.querySelector('span');
                if (imgDir) {
                    imgDir.src = `${caminhoSetasAtivas}seta-direita-ativa.svg`;
                    imgDir.style.opacity = '1';
                }
                if (spanDir) spanDir.style.opacity = '1';
                setaDireitaMobile.style.pointerEvents = 'auto';
            }
        }
    }
  
    function casaAnterior() {
        if (casaAtual > 0) {
            mostrarCasa(casaAtual - 1);
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
        }
    }
  
    function proximaCasa() {
        if (casaAtual < casas.length - 1) {
            mostrarCasa(casaAtual + 1);
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
        }
    }
  
    // Evento para o botão "Receber carimbo"
    if (botaoCarimbo) {
        botaoCarimbo.addEventListener('click', function() {
            if (numeroSemana >= 1 && numeroSemana <= 7) {
                const indiceCarimbo = numeroSemana - 1;
                
                if (!carimbosRecebidos[indiceCarimbo]) {
                    carimbosRecebidos[indiceCarimbo] = true;
                    salvarCarimbosStorage();
                    
                    if (carimbos[indiceCarimbo]) {
                        carimbos[indiceCarimbo].style.display = 'block';
                        
                        botaoCarimbo.style.backgroundColor = '#818181'; 
                        botaoCarimbo.style.cursor = 'default';
                        botaoCarimbo.style.pointerEvents = 'none';
                        botaoCarimbo.disabled = true;
                        botaoCarimbo.textContent = 'Carimbo recebido';
                        
                        atualizarBotaoConclusao(casaAtual);
                    }
                }
            }
        });
    }
  
    // Evento para o botão "Concluir"
    if (botaoConclusao) {
        const botao = botaoConclusao.querySelector('button');
        
        if (botao) {
            botao.addEventListener('click', function() {
                if (modoConclusaoAtivo) {
                    resetarCasa6();
                    atualizarBotaoConclusao(casaAtual);
                } else {
                    ativarModoConclusao();
                }
            });
        }
    }

    // Evento para o botão "Recomeçar trilha"
    const botaoRecomecar = document.querySelector('.buttons-conclusao-container button:first-child');
    if (botaoRecomecar) {
        botaoRecomecar.addEventListener('click', function() {
            if (numeroSemana >= 1 && numeroSemana <= 7) {
                // Remover os dados da semana atual
                localStorage.removeItem(`${semanaId}Dados`);
                // Recarregar a página
                location.reload();
            }
        });
    }

    // Evento para o botão "Voltar para as jornadas"
    const botaoVoltarJornadas = document.querySelector('.buttons-conclusao-container button:nth-child(2)');
    if (botaoVoltarJornadas) {
        botaoVoltarJornadas.addEventListener('click', function() {
            window.location.href = 'jornadas.html';
        });
    }

    // Evento para o botão "Meu passaporte"
    const botaoMeuPassaporte = document.querySelector('.buttons-conclusao-container button:nth-child(3)');
    if (botaoMeuPassaporte) {
        botaoMeuPassaporte.addEventListener('click', function() {
            abrirModalPassaporte(carimbosRecebidos);
        });
    }
  
    // Eventos dos bullets
    bullets.forEach((bullet, index) => {
        bullet.addEventListener('click', function() {
            mostrarCasa(index);
        });
        
        bullet.setAttribute('role', 'button');
        bullet.setAttribute('tabindex', '0');
        bullet.setAttribute('aria-label', `Ir para casa ${index + 1}`);
    });
  
    // Eventos das setas
    if (setaEsquerda) {
        setaEsquerda.addEventListener('click', function() {
            casaAnterior();
        });
        setaEsquerda.setAttribute('role', 'button');
        setaEsquerda.setAttribute('tabindex', '0');
        setaEsquerda.setAttribute('aria-label', 'Casa anterior');
    }
  
    if (setaDireita) {
        setaDireita.addEventListener('click', function() {
            proximaCasa();
        });
        setaDireita.setAttribute('role', 'button');
        setaDireita.setAttribute('tabindex', '0');
        setaDireita.setAttribute('aria-label', 'Próxima casa');
    }

    // Eventos dos containers mobile
    if (setaEsquerdaMobile) {
        setaEsquerdaMobile.addEventListener('click', function() {
            casaAnterior();
        });
        setaEsquerdaMobile.setAttribute('role', 'button');
        setaEsquerdaMobile.setAttribute('tabindex', '0');
        setaEsquerdaMobile.setAttribute('aria-label', 'Casa anterior');
    }

    if (setaDireitaMobile) {
        setaDireitaMobile.addEventListener('click', function() {
            proximaCasa();
        });
        setaDireitaMobile.setAttribute('role', 'button');
        setaDireitaMobile.setAttribute('tabindex', '0');
        setaDireitaMobile.setAttribute('aria-label', 'Próxima casa');
    }
  
    // Suporte para teclado
    document.addEventListener('keydown', function(e) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                casaAnterior();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                proximaCasa();
            }
        }
    });
  
    bullets.forEach((bullet, index) => {
        bullet.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                mostrarCasa(index);
            }
        });
    });
  
    if (setaEsquerda) {
        setaEsquerda.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                casaAnterior();
            }
        });
    }
  
    if (setaDireita) {
        setaDireita.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                proximaCasa();
            }
        });
    }
  
    carregarDadosUsuario();
    inicializarCarimbos();
    atualizarCarimbos();
    
    if (passaporteContainer) {
        passaporteContainer.style.display = 'none';
    }
    
    if (botaoConclusao) {
        botaoConclusao.style.display = 'none';
    }
    
    if (botoesConclusaoContainer) {
        botoesConclusaoContainer.style.display = 'none';
    }
    
    if (ultimaTelaCasa6) {
        ultimaTelaCasa6.style.display = 'none';
    }
    
    if (semanaConcluida) {
        ativarModoConclusao();
    } else {
        mostrarCasa(0);
    }
  
  });
  
  // Atualizar data do check-in
  const dataCheckIn = document.querySelector('.data-checkIn');
  if (dataCheckIn) {
      const hoje = new Date();
      const dia = String(hoje.getDate()).padStart(2, '0');
      const mes = String(hoje.getMonth() + 1).padStart(2, '0');
      const ano = hoje.getFullYear();
      dataCheckIn.textContent = `${dia}/${mes}/${ano}`;
  }
  
  // Upload de imagem para a div .foto-local
  const fotoLocal = document.querySelector('.foto-local');
  if (fotoLocal) {
      const inputFile = document.createElement('input');
      inputFile.type = 'file';
      inputFile.accept = 'image/*';
      inputFile.style.display = 'none';
      document.body.appendChild(inputFile);
      
      let temImagem = false;
      const textoOriginal = fotoLocal.innerHTML;
      
      const btnRemover = document.createElement('button');
      btnRemover.innerHTML = '×';
      btnRemover.style.position = 'absolute';
      btnRemover.style.top = '5px';
      btnRemover.style.right = '5px';
      btnRemover.style.width = '25px';
      btnRemover.style.height = '25px';
      btnRemover.style.borderRadius = '50%';
      btnRemover.style.backgroundColor = '#A33E40';
      btnRemover.style.color = 'white';
      btnRemover.style.border = 'none';
      btnRemover.style.fontSize = '20px';
      btnRemover.style.fontWeight = 'bold';
      btnRemover.style.cursor = 'pointer';
      btnRemover.style.display = 'none';
      btnRemover.style.zIndex = '10';
      btnRemover.style.justifyContent = 'center';
      btnRemover.style.alignItems = 'center';
      btnRemover.style.lineHeight = '1';
      btnRemover.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
      
      fotoLocal.style.position = 'relative';
      fotoLocal.appendChild(btnRemover);
      
      fotoLocal.addEventListener('click', function(e) {
          if (e.target === btnRemover) return;
          if (!temImagem) inputFile.click();
      });
      
      inputFile.addEventListener('change', function(e) {
          const file = e.target.files[0];
          if (file) {
              const reader = new FileReader();
              reader.onload = function(event) {
                  fotoLocal.innerHTML = '';
                  fotoLocal.appendChild(btnRemover);
                  const img = document.createElement('img');
                  img.src = event.target.result;
                  img.style.width = '100%';
                  img.style.height = '100%';
                  img.style.objectFit = 'cover';
                  img.style.borderRadius = 'inherit';
                  fotoLocal.appendChild(img);
                  temImagem = true;
                  fotoLocal.style.border = 'none';
                  btnRemover.style.display = 'flex';
              };
              reader.readAsDataURL(file);
          }
      });
      
      btnRemover.addEventListener('click', function(e) {
          e.stopPropagation();
          fotoLocal.innerHTML = textoOriginal;
          fotoLocal.style.border = '';
          fotoLocal.appendChild(btnRemover);
          btnRemover.style.display = 'none';
          temImagem = false;
          inputFile.value = '';
          fotoLocal.style.position = 'relative';
      });
      
      btnRemover.style.display = 'none';
  }

  // Loading State Inicial
  window.addEventListener('load', function() {
    setTimeout(function() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }, 1500);
});