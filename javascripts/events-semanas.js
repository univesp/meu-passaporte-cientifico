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
    const semanaContentBox = document.querySelector('.semana-content-box');
    const passaporteContainer = document.querySelector('.passaporte-container');
    const botaoCarimbo = document.querySelector('.botao-carimbo-trilha');
    const botaoConclusao = document.querySelector('.botao-conclusao-trilha-container');
    const botoesConclusaoContainer = document.querySelector('.buttons-conclusao-container');
    
    // ===== IDENTIFICAR A SEMANA ATUAL =====
    const semanaId = semanaContentBox.id; // "semana1", "semana2", etc.
    const numeroSemana = parseInt(semanaId.replace('semana', ''));
    //console.log(`Semana atual: ${numeroSemana}`);
    
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
    
    let casaAtual = 0; // Índice da casa atual (0 = casa1, 1 = casa2, etc)
    let modoConclusaoAtivo = false; // Flag para controlar se está no modo de conclusão
    
    // ===== FUNÇÕES DO LOCALSTORAGE =====
    const STORAGE_KEY = 'passaporte_carimbos';
    const CONCLUSAO_KEY = `semana${numeroSemana}_concluida`; 
    
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
    
    // Carregar estado de conclusão da semana (AGORA DINÂMICO)
    function carregarConclusaoStorage() {
        const stored = localStorage.getItem(CONCLUSAO_KEY);
        return stored === 'true';
    }
    
    // Salvar estado dos carimbos no localStorage
    function salvarCarimbosStorage() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(carimbosRecebidos));
    }
    
    // Salvar estado de conclusão da semana (AGORA DINÂMICO)
    function salvarConclusaoStorage(concluida) {
        localStorage.setItem(CONCLUSAO_KEY, concluida);
    }
    
    // Estado dos carimbos (false = não recebido, true = recebido)
    let carimbosRecebidos = carregarCarimbosStorage();
    let semanaConcluida = carregarConclusaoStorage();
  
    // Verificações iniciais
    if (casas.length === 0) {
        console.error('❌ Nenhuma casa encontrada! Verifique se as divs têm a classe "casa-content"');
        return;
    }
  
    if (bullets.length === 0) {
        console.error('❌ Nenhum bullet encontrado! Verifique se as divs têm a classe "bullet-item"');
        return;
    }
  
    if (!semanaContentBox) {
        console.error('❌ Elemento .semana-content-box não encontrado!');
        return;
    }
  
    if (casas.length !== bullets.length) {
        console.warn(`Aviso: Número de casas (${casas.length}) diferente do número de bullets (${bullets.length})`);
    }
  
    // Função para inicializar os carimbos (todos escondidos inicialmente)
    function inicializarCarimbos() {
        carimbos.forEach(carimbo => {
            if (carimbo) {
                carimbo.style.display = 'none';
            }
        });
    }
  
    // Função para atualizar a visibilidade dos carimbos baseado no estado
    function atualizarCarimbos() {
        carimbos.forEach((carimbo, index) => {
            if (carimbo && carimbosRecebidos[index]) {
                carimbo.style.display = 'block'; // Mostrar carimbo recebido
            }
        });
    }
  
    // Função para resetar o estado da Casa 6 (voltar ao normal)
    function resetarCasa6() {
        if (tituloCasa6) tituloCasa6.style.display = 'block';
        if (textoCasa6) textoCasa6.style.display = 'block';
        if (botaoCarimbo) botaoCarimbo.style.display = 'block';
        if (ultimaTelaCasa6) ultimaTelaCasa6.style.display = 'none';
        
        // Mostrar passaporte novamente
        if (passaporteContainer && casaAtual === casas.length - 1) {
            passaporteContainer.style.display = 'flex';
            atualizarCarimbos();
        }
        
        // Esconder container de botões de conclusão
        if (botoesConclusaoContainer) {
            botoesConclusaoContainer.style.display = 'none';
        }
        
        // Mostrar botão de conclusão simples
        if (botaoConclusao) {
            botaoConclusao.style.display = 'flex';
            const botao = botaoConclusao.querySelector('button');
            if (botao) botao.textContent = 'Concluir';
        }
        
        // Mostrar bullets container
        if (bulletsContainer) {
            bulletsContainer.style.display = 'flex';
        }
        
        // Mostrar setas container
        if (setasContainer) {
            setasContainer.style.display = 'flex';
        }
        
        modoConclusaoAtivo = false;
    }
  
    // Função para ativar o modo de conclusão (mostrar apenas a casa 6 com última tela)
    function ativarModoConclusao() {
        // Esconder todas as casas primeiro
        casas.forEach((casa, i) => {
            casa.style.display = 'none';
        });
        
        // Mostrar apenas a última casa (casa 6)
        const ultimaCasa = document.getElementById(`casa${casas.length}`);
        if (ultimaCasa) {
            ultimaCasa.style.display = 'flex';
        }
        
        // Dentro da última casa, esconder elementos iniciais e mostrar última tela
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
        
        // Esconder passaporte
        if (passaporteContainer) {
            passaporteContainer.style.display = 'none';
        }
        
        // Esconder botão de conclusão simples
        if (botaoConclusao) {
            botaoConclusao.style.display = 'none';
        }
        
        // Mostrar container com os três botões
        if (botoesConclusaoContainer) {
            botoesConclusaoContainer.style.display = 'flex';
        }
        
        // Esconder bullets container
        if (bulletsContainer) {
            bulletsContainer.style.display = 'none';
        }
        
        // Esconder setas container
        if (setasContainer) {
            setasContainer.style.display = 'none';
        }
        
        modoConclusaoAtivo = true;
        
        // Salvar que a semana foi concluída
        semanaConcluida = true;
        salvarConclusaoStorage(true);
    }
  
    // Função para atualizar o estado do botão de carimbo baseado nos carimbos recebidos
    function atualizarBotaoCarimbo() {
        if (!botaoCarimbo) return;
        
        // Se estiver no modo conclusão, esconder botão de carimbo
        if (modoConclusaoAtivo) {
            botaoCarimbo.style.display = 'none';
            return;
        }
        
        // Verificar se o carimbo da semana atual já foi recebido
        if (numeroSemana >= 1 && numeroSemana <= 7) {
            const indiceCarimbo = numeroSemana - 1;
            
            if (carimbosRecebidos[indiceCarimbo]) {
                // Carimbo já recebido - desabilitar botão
                botaoCarimbo.style.backgroundColor = '#818181';
                botaoCarimbo.style.cursor = 'default';
                botaoCarimbo.style.pointerEvents = 'none';
                botaoCarimbo.disabled = true;
                botaoCarimbo.textContent = 'Carimbo recebido';
                botaoCarimbo.style.display = 'block';
            } else {
                // Carimbo não recebido - habilitar botão
                botaoCarimbo.style.backgroundColor = ''; // Volta ao original
                botaoCarimbo.style.cursor = 'pointer';
                botaoCarimbo.style.pointerEvents = 'auto';
                botaoCarimbo.style.opacity = '1';
                botaoCarimbo.disabled = false;
                botaoCarimbo.textContent = 'Receber carimbo';
                botaoCarimbo.style.display = 'block';
            }
        }
    }
  
    // Função para atualizar a visibilidade do botão de conclusão
    function atualizarBotaoConclusao(index) {
        if (!botaoConclusao) return;
        
        // Verificar se está na última casa E se o carimbo da semana atual foi recebido
        const carimboAtualRecebido = carimbosRecebidos[numeroSemana - 1]; // Carimbo da semana atual
        
        if (index === casas.length - 1 && carimboAtualRecebido) {
            botaoConclusao.style.display = 'flex'; // Mostrar botão
            
            // Se a semana já foi concluída, ativar modo conclusão automaticamente
            if (semanaConcluida && !modoConclusaoAtivo) {
                ativarModoConclusao();
            } else if (!semanaConcluida && modoConclusaoAtivo) {
                resetarCasa6();
            }
        } else {
            botaoConclusao.style.display = 'none'; // Esconder botão
            // Se não estiver na última casa, resetar modo conclusão
            if (modoConclusaoAtivo) {
                resetarCasa6();
            }
        }
    }
  
    // Função para mostrar/esconder o passaporte-container baseado na casa atual
    function atualizarVisibilidadePassaporte(index) {
        if (!passaporteContainer) return;
        
        // Se estiver no modo conclusão, não mostrar passaporte
        if (modoConclusaoAtivo) {
            passaporteContainer.style.display = 'none';
            return;
        }
        
        // Última casa
        if (index === casas.length - 1) {
            passaporteContainer.style.display = 'flex'; // Mostrar na última casa
            // Atualizar carimbos sempre que o passaporte for mostrado
            atualizarCarimbos();
        } else {
            passaporteContainer.style.display = 'none'; // Esconder nas outras casas
        }
    }
  
    // Função para atualizar o padding da semana-content-box usando classes
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
  
    // Função para mostrar uma casa específica
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
        atualizarBotaoConclusao(index); // Atualizar botão de conclusão
        atualizarSetas(index);
        
        casaAtual = index;
    }
  
    // Função para atualizar estado das setas
    function atualizarSetas(index) {
        if (!setaEsquerda || !setaDireita) {
            console.warn('Setas não encontradas');
            return;
        }
        
        // Caminho base para as setas ativas da semana atual
        const caminhoSetasAtivas = `assets/Semana${numeroSemana}/`;
        
        if (index === 0) {
            setaEsquerda.src = 'assets/arquivos_gerais_semanas/seta-esquerda-desativa.svg';
            setaDireita.src = `${caminhoSetasAtivas}seta-direita-ativa.svg`;
            setaEsquerda.style.opacity = '0.5';
            setaDireita.style.opacity = '1';
            
            setaEsquerda.style.pointerEvents = 'none';
            setaDireita.style.pointerEvents = 'auto';
            
        } else if (index === casas.length - 1) {
            setaEsquerda.src = `${caminhoSetasAtivas}seta-esquerda-ativa.svg`;
            setaDireita.src = 'assets/arquivos_gerais_semanas/seta-direita-desativa.svg';
            setaEsquerda.style.opacity = '1';
            setaDireita.style.opacity = '0.5';
            
            setaEsquerda.style.pointerEvents = 'auto';
            setaDireita.style.pointerEvents = 'none';
            
        } else {
            setaEsquerda.src = `${caminhoSetasAtivas}seta-esquerda-ativa.svg`;
            setaDireita.src = `${caminhoSetasAtivas}seta-direita-ativa.svg`;
            setaEsquerda.style.opacity = '1';
            setaDireita.style.opacity = '1';
            
            setaEsquerda.style.pointerEvents = 'auto';
            setaDireita.style.pointerEvents = 'auto';
        }
    }
  
    // Função para navegar para a casa anterior
    function casaAnterior() {
        if (casaAtual > 0) {
            mostrarCasa(casaAtual - 1);
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
        }
    }
  
    // Função para navegar para a próxima casa
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
                        
                        // Atualizar botão de conclusão após receber carimbo
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
                    // Se estiver no modo conclusão, voltar para o estado normal
                    resetarCasa6();
                    atualizarBotaoConclusao(casaAtual);
                } else {
                    // Ativar modo conclusão
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
                const indiceCarimbo = numeroSemana - 1;
                
                // Restaurar semana_concluida para false no localStorage (USANDO A CHAVE DINÂMICA)
                localStorage.setItem(CONCLUSAO_KEY, 'false');
                
                // Restaurar carimbo correspondente para false no localStorage
                /*
                if (carimbosRecebidos[indiceCarimbo]) {
                    carimbosRecebidos[indiceCarimbo] = false;
                    salvarCarimbosStorage();
                }
                */
                
                //console.log(`Semana ${numeroSemana} reiniciada!`);
                
                // Recarregar a página
                location.reload();
            }
        });
    }

    // Evento para o botão "Voltar para as jornadas"
    const botaoVoltarJornadas = document.querySelector('.buttons-conclusao-container button:nth-child(2)');
    if (botaoVoltarJornadas) {
        botaoVoltarJornadas.addEventListener('click', function() {
            window.location.href = '/jornadas.html';
        });
    }

    // Evento para o botão "Meu passaporte"
    // Código no arquivo: modal-passaporte.js
    const botaoMeuPassaporte = document.querySelector('.buttons-conclusao-container button:nth-child(3)');
    if (botaoMeuPassaporte) {
        botaoMeuPassaporte.addEventListener('click', function() {
            abrirModalPassaporte(carimbosRecebidos);
        });
    }
  
    // Adicionar evento de clique nos bullets
    bullets.forEach((bullet, index) => {
        bullet.addEventListener('click', function() {
            mostrarCasa(index);
        });
        
        bullet.setAttribute('role', 'button');
        bullet.setAttribute('tabindex', '0');
        bullet.setAttribute('aria-label', `Ir para casa ${index + 1}`);
    });
  
    // Adicionar evento de clique nas setas
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
  
    // Adicionar suporte para teclado
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
  
    // Suporte para tecla Enter nos bullets
    bullets.forEach((bullet, index) => {
        bullet.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                mostrarCasa(index);
            }
        });
    });
  
    // Suporte para tecla Enter nas setas
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
  
    // Inicializar tudo
    inicializarCarimbos();
    atualizarCarimbos();
    
    if (passaporteContainer) {
        passaporteContainer.style.display = 'none';
    }
    
    if (botaoConclusao) {
        botaoConclusao.style.display = 'none'; // Começa escondido
    }
    
    if (botoesConclusaoContainer) {
        botoesConclusaoContainer.style.display = 'none'; // Começa escondido
    }
    
    // Garantir que a última tela comece escondida
    if (ultimaTelaCasa6) {
        ultimaTelaCasa6.style.display = 'none';
    }
    
    // SE A SEMANA JÁ FOI CONCLUÍDA, ATIVAR MODO CONCLUSÃO IMEDIATAMENTE
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
      // Criar input file escondido
      const inputFile = document.createElement('input');
      inputFile.type = 'file';
      inputFile.accept = 'image/*';
      inputFile.style.display = 'none';
      document.body.appendChild(inputFile);
      
      // Estado inicial (sem imagem)
      let temImagem = false;
      const textoOriginal = fotoLocal.innerHTML; // Salvar texto original
      
      // Criar botão de remover (X) - inicialmente escondido
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
      
      // Adicionar botão à div
      fotoLocal.style.position = 'relative';
      fotoLocal.appendChild(btnRemover);
      
      // Ao clicar na div (exceto no botão remover)
      fotoLocal.addEventListener('click', function(e) {
          if (e.target === btnRemover) {
              return;
          }
          
          if (!temImagem) {
              inputFile.click();
          }
      });
      
      // Quando um arquivo for selecionado
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
      
      // Evento para remover imagem
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