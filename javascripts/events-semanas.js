document.addEventListener('DOMContentLoaded', function() {

  // Elementos
  const bullets = document.querySelectorAll('.bullet-item');
  const casas = document.querySelectorAll('.casa-content');
  const setaEsquerda = document.querySelector('.arrows-container img:first-child');
  const setaDireita = document.querySelector('.arrows-container img:last-child');
  const semanaContentBox = document.querySelector('.semana-content-box');
  
  let casaAtual = 0; // Índice da casa atual (0 = casa1, 1 = casa2, etc)

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
      console.warn(`⚠️ Aviso: Número de casas (${casas.length}) diferente do número de bullets (${bullets.length})`);
  }

  //console.log(`✅ Total de casas: ${casas.length}`);
  //console.log(`✅ Total de bullets: ${bullets.length}`);

  // Função para atualizar o padding da semana-content-box usando classes
  function atualizarPaddingSemanaBox(index) {
      // Lista de todas as classes de padding possíveis
      const paddingClasses = [
          'casa1-padding',
          'casa2-padding', 
          'casa3-padding',
          'casa4-padding',
          'casa5-padding',
          'casa6-padding'
      ];
      
      // Remover todas as classes de padding
      paddingClasses.forEach(cls => {
          semanaContentBox.classList.remove(cls);
      });
      
      // Adicionar a classe correspondente à casa atual (index + 1 porque as casas começam em 1)
      semanaContentBox.classList.add(`casa${index + 1}-padding`);
      //console.log(`📦 Classe de padding adicionada: casa${index + 1}-padding`);
  }

  // Função para mostrar uma casa específica
  function mostrarCasa(index) {
      // Validar índice
      if (index < 0 || index >= casas.length) {
          console.error(`❌ Índice inválido: ${index}`);
          return;
      }
      
      //console.log(`📺 Mostrando casa ${index + 1}`);
      
      // Esconder todas as casas
      casas.forEach((casa, i) => {
          casa.style.display = 'none';
      });
      
      // Mostrar a casa selecionada
      casas[index].style.display = 'flex'; // ou 'block' dependendo do seu layout
      
      // Atualizar bullets
      bullets.forEach((bullet, i) => {
          if (i === index) {
              bullet.classList.add('bullet-ativo');
          } else {
              bullet.classList.remove('bullet-ativo');
          }
      });
      
      // Atualizar padding do container principal usando classes
      atualizarPaddingSemanaBox(index);
      
      // Atualizar setas
      atualizarSetas(index);
      
      // Guardar índice atual
      casaAtual = index;
  }

  // Função para atualizar estado das setas
  function atualizarSetas(index) {
      // Verificar se as setas existem
      if (!setaEsquerda || !setaDireita) {
          console.warn('⚠️ Setas não encontradas');
          return;
      }
      
      if (index === 0) {
          // Primeira casa: seta esquerda desativada, direita ativada
          setaEsquerda.src = 'assets/arquivos_gerais_semanas/seta-esquerda-desativa.svg';
          setaDireita.src = 'assets/arquivos_gerais_semanas/seta-direita-ativa.svg';
          setaEsquerda.style.opacity = '0.5';
          setaDireita.style.opacity = '1';
          
          // Desabilitar clique na seta esquerda
          setaEsquerda.style.pointerEvents = 'none';
          setaDireita.style.pointerEvents = 'auto';
          
      } else if (index === casas.length - 1) {
          // Última casa: seta esquerda ativada, direita desativada
          setaEsquerda.src = 'assets/arquivos_gerais_semanas/seta-esquerda-ativa.svg';
          setaDireita.src = 'assets/arquivos_gerais_semanas/seta-direita-desativa.svg';
          setaEsquerda.style.opacity = '1';
          setaDireita.style.opacity = '0.5';
          
          // Desabilitar clique na seta direita
          setaEsquerda.style.pointerEvents = 'auto';
          setaDireita.style.pointerEvents = 'none';
          
      } else {
          // Casas do meio: ambas ativadas
          setaEsquerda.src = 'assets/arquivos_gerais_semanas/seta-esquerda-ativa.svg';
          setaDireita.src = 'assets/arquivos_gerais_semanas/seta-direita-ativa.svg';
          setaEsquerda.style.opacity = '1';
          setaDireita.style.opacity = '1';
          
          // Ambas habilitadas para clique
          setaEsquerda.style.pointerEvents = 'auto';
          setaDireita.style.pointerEvents = 'auto';
      }
  }

  // Função para navegar para a casa anterior
  function casaAnterior() {
      if (casaAtual > 0) {
          mostrarCasa(casaAtual - 1);
      }
  }

  // Função para navegar para a próxima casa
  function proximaCasa() {
      if (casaAtual < casas.length - 1) {
          mostrarCasa(casaAtual + 1);
      }
  }

  // Adicionar evento de clique nos bullets
  bullets.forEach((bullet, index) => {
      bullet.addEventListener('click', function() {
          //console.log(`🎯 Bullet ${index + 1} clicado`);
          mostrarCasa(index);
      });
      
      // Adicionar atributos de acessibilidade
      bullet.setAttribute('role', 'button');
      bullet.setAttribute('tabindex', '0');
      bullet.setAttribute('aria-label', `Ir para casa ${index + 1}`);
  });

  // Adicionar evento de clique nas setas
  if (setaEsquerda) {
      setaEsquerda.addEventListener('click', function() {
          console.log('⬅️ Seta esquerda clicada');
          casaAnterior();
      });
      
      // Acessibilidade para seta esquerda
      setaEsquerda.setAttribute('role', 'button');
      setaEsquerda.setAttribute('tabindex', '0');
      setaEsquerda.setAttribute('aria-label', 'Casa anterior');
  }

  if (setaDireita) {
      setaDireita.addEventListener('click', function() {
          //console.log('➡️ Seta direita clicada');
          proximaCasa();
      });
      
      // Acessibilidade para seta direita
      setaDireita.setAttribute('role', 'button');
      setaDireita.setAttribute('tabindex', '0');
      setaDireita.setAttribute('aria-label', 'Próxima casa');
  }

  // Adicionar suporte para teclado (setas do teclado)
  document.addEventListener('keydown', function(e) {
      // Só funciona se não estiver digitando em um input
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          if (e.key === 'ArrowLeft') {
              e.preventDefault();
              //console.log('⬅️ Seta esquerda do teclado');
              casaAnterior();
          } else if (e.key === 'ArrowRight') {
              e.preventDefault();
              //console.log('➡️ Seta direita do teclado');
              proximaCasa();
          }
      }
  });

  // Adicionar suporte para tecla Enter nos bullets (acessibilidade)
  bullets.forEach((bullet, index) => {
      bullet.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              mostrarCasa(index);
          }
      });
  });

  // Adicionar suporte para tecla Enter nas setas (acessibilidade)
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

  // Iniciar com a primeira casa visível
  mostrarCasa(0);

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
    fotoLocal.style.position = 'relative'; // Para posicionamento absoluto do botão
    fotoLocal.appendChild(btnRemover);
    
    // Ao clicar na div (exceto no botão remover)
    fotoLocal.addEventListener('click', function(e) {
        // Se clicou no botão remover, não abrir seletor
        if (e.target === btnRemover) {
            return;
        }
        
        // Se não tem imagem, abrir seletor
        if (!temImagem) {
            inputFile.click();
        }
        // Se tem imagem, não faz nada (só mostra o X)
    });
    
    // Quando um arquivo for selecionado
    inputFile.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(event) {
                // Remover conteúdo atual (incluindo texto)
                fotoLocal.innerHTML = '';
                
                // Recriar e adicionar o botão remover
                fotoLocal.appendChild(btnRemover);
                
                // Criar e adicionar a imagem
                const img = document.createElement('img');
                img.src = event.target.result;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                img.style.borderRadius = 'inherit';
                
                fotoLocal.appendChild(img);
                temImagem = true;
                
                // Remover borda dashed quando tem imagem
                fotoLocal.style.border = 'none';
                
                // Mostrar botão remover
                btnRemover.style.display = 'flex';
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    // Evento para remover imagem
    btnRemover.addEventListener('click', function(e) {
        e.stopPropagation(); // Impedir que o clique chegue na div
        
        // Restaurar conteúdo original
        fotoLocal.innerHTML = textoOriginal;
        
        // Restaurar borda dashed
        fotoLocal.style.border = ''; // Volta ao estilo original do CSS
        
        // Re-adicionar o botão remover (que foi removido ao limpar innerHTML)
        fotoLocal.appendChild(btnRemover);
        
        // Esconder botão remover
        btnRemover.style.display = 'none';
        
        temImagem = false;
        inputFile.value = ''; // Limpar input file
        
        // Restaurar position relative se necessário
        fotoLocal.style.position = 'relative';
    });
    
    // Esconder botão remover quando não tem imagem
    btnRemover.style.display = 'none';
}