document.addEventListener('DOMContentLoaded', function() {
    
  // ===== DADOS DAS SEMANAS =====
  const semanaDados = [
      {
          "semana": 1,
          "background": "url('../assets/Semana1/biblioteca.jpg')",
          "titulo": "A Ciência como Construção Humana",
          "subtitulo": "Microexpedição de Conceitos",
          "cor": "#A33E40"
      },
      {
          "semana": 2,
          "background": "url('../assets/Semana2/bg_2.jpg')",
          "titulo": "História da Astronomia e Mudanças Paradigmáticas",
          "subtitulo": "Viagem pelas Estrelas e Ideias",
          "cor": "#013475"
      },
      {
          "semana": 3,
          "background": "url('../assets/Semana3/bg_3.jpg')",
          "titulo": "Ciência e Religião: Paradigmas em Confronto",
          "subtitulo": "Rotas do Diálogo e do Conflito",
          "cor": "#026949"
      },
      {
          "semana": 4,
          "background": "url('../assets/Semana4/bg_4.jpg')",
          "titulo": "Ciência na Terra e Dinâmica Planetária",
          "subtitulo": "Trilhas da Terra em Movimento",
          "cor": "#3D6317"
      },
      {
          "semana": 5,
          "background": "url('../assets/Semana5/bg_5.jpg')",
          "titulo": "O ambiente e a relação com a ciência e a tecnologia",
          "subtitulo": "Missão Sustentabilidade em Ação",
          "cor": "#33675B"
      },
      {
          "semana": 6,
          "background": "url('../assets/Semana6/bg_6.jpg')",
          "titulo": "Vida microscópica e Biologia molecular",
          "subtitulo": "Jornada pelo Mundo Microscópico",
          "cor": "#3F2850"
      },
      {
          "semana": 7,
          "background": "url('../assets/Semana7/bg_7.jpg')",
          "titulo": "Bioética e Biotecnologia Moderna",
          "subtitulo": "Desafios Éticos da Biotecnologia",
          "cor": "#114B52"
      }
  ];

  // ===== ELEMENTOS DO DOM =====
  const botoesPortfolio = document.querySelectorAll('.portfolio-button-item');
  const semanaContainer = document.querySelector('.semana-portfolio-container');
  const tituloElement = document.getElementById('titulo');
  const subtituloElement = document.getElementById('subtitulo');
  const textareas = document.querySelectorAll('.textarea-portfolio');
  
  // Mapeamento dos textareas (0: atividade, 1: aprendizado, 2: reflexoes)
  const textareaIds = ['atividade', 'aprendizado', 'reflexoes'];
  
  // ===== FUNÇÃO PARA CARREGAR DADOS DO LOCALSTORAGE =====
  function carregarDadosDaSemana(semana) {
      const dadosKey = `semana${semana}Dados`;
      const dadosSalvos = localStorage.getItem(dadosKey);
      
      if (dadosSalvos) {
          try {
              const dados = JSON.parse(dadosSalvos);
              return dados;
          } catch(e) {
              console.error(`Erro ao carregar dados da semana ${semana}:`, e);
              return null;
          }
      }
      return null;
  }
  
  // ===== FUNÇÃO PARA PREENCHER OS TEXTAREAS =====
  function preencherTextareas(semana) {
      const dados = carregarDadosDaSemana(semana);
      
      // Limpar todos os textareas primeiro
      textareas.forEach(textarea => {
          textarea.value = '';
      });
      
      if (dados) {
          // Preencher com os dados salvos
          if (textareas[0] && dados.atividade) textareas[0].value = dados.atividade;
          if (textareas[1] && dados.aprendizado) textareas[1].value = dados.aprendizado;
          if (textareas[2] && dados.reflexoes) textareas[2].value = dados.reflexoes;
      } else {
          // Se não há dados salvos, deixar campos vazios ou com placeholder
          //console.log(`Semana ${semana}: nenhum dado salvo encontrado`);
      }
  }
  
  // ===== FUNÇÃO PARA ATUALIZAR O ESTILO DA SEMANA ATIVA =====
  function atualizarEstiloBotaoAtivo(botaoAtivo) {
      // Resetar todos os botões
      botoesPortfolio.forEach(botao => {
          botao.style.backgroundColor = '';
          botao.style.color = '';
      });
      
      // Estilizar o botão ativo
      if (botaoAtivo) {
          botaoAtivo.style.backgroundColor = '#FFAB42';
          botaoAtivo.style.color = '#000';
      }
  }
  
  // ===== FUNÇÃO PARA RENDERIZAR O CONTEÚDO DA SEMANA =====
  function renderizarSemana(semana) {
      // Encontrar os dados da semana (semana vem como string "Semana 1", então extraímos o número)
      const semanaNumero = parseInt(semana.replace('Semana ', ''));
      const dadosSemana = semanaDados.find(d => d.semana === semanaNumero);
      
      if (!dadosSemana) return;
      
      // Atualizar background do container
      semanaContainer.style.backgroundImage = dadosSemana.background;
      semanaContainer.style.backgroundSize = 'cover';
      semanaContainer.style.backgroundPosition = 'center';
      semanaContainer.style.backgroundRepeat = 'no-repeat';
      
      // Atualizar título e subtítulo
      tituloElement.innerHTML = `<b>${dadosSemana.titulo}</b>`;
      subtituloElement.textContent = dadosSemana.subtitulo;
      
      // Atualizar cores dos elementos
      tituloElement.style.color = dadosSemana.cor;
      subtituloElement.style.color = dadosSemana.cor;
      
      // Atualizar cor dos títulos dos content-titulo
      const contentTitulos = document.querySelectorAll('.content-titulo h3');
      contentTitulos.forEach(h3 => {
          h3.style.color = dadosSemana.cor;
      });
      
      // Atualizar cor da linha (::after) de cada content-titulo
      const contentTituloDivs = document.querySelectorAll('.content-titulo');
      contentTituloDivs.forEach(div => {
          // Remover style anterior se existir
          div.style.setProperty('--linha-cor', dadosSemana.cor);
      });
      
      // Adicionar/style a cor da linha via CSS custom property
      const style = document.createElement('style');
      style.id = 'dynamic-line-color';
      style.textContent = `
          .content-titulo::after {
              background-color: ${dadosSemana.cor} !important;
          }
      `;
      
      // Remover estilo anterior se existir
      const oldStyle = document.getElementById('dynamic-line-color');
      if (oldStyle) {
          oldStyle.remove();
      }
      document.head.appendChild(style);
      
      // Carregar os dados dos textareas
      preencherTextareas(semanaNumero);
  }
  
      // ===== EVENTO DE CLICK NOS BOTÕES =====
      botoesPortfolio.forEach(botao => {
        botao.addEventListener('click', function() {
            const semana = this.textContent; // "Passaporte", "Semana 1", "Semana 2", etc.
            
            // Se for "Passaporte", lidamos de forma diferente (você pode implementar depois)
            if (semana === 'Passaporte') {
              // Carregar os carimbos do localStorage
              const carimbosSalvos = localStorage.getItem('passaporte_carimbos');
              let carimbosRecebidos = [false, false, false, false, false, false, false];
              if (carimbosSalvos) {
                  try {
                      carimbosRecebidos = JSON.parse(carimbosSalvos);
                  } catch(e) {
                      console.error('Erro ao carregar carimbos:', e);
                  }
              }
              // Chamar a função do modal-passaporte.js
              if (typeof abrirModalPassaporte === 'function') {
                  abrirModalPassaporte(carimbosRecebidos);
              } else {
                  console.error('❌ Função abrirModalPassaporte não encontrada!');
              }
              return;
          }
            
            // Atualizar estilo do botão ativo
            atualizarEstiloBotaoAtivo(this);
            
            // Renderizar o conteúdo da semana
            renderizarSemana(semana);
            
            // ===== SCROLL SUAVE PARA A SECTION =====
            const semanaContainer = document.querySelector('.semana-portfolio-container');
            if (semanaContainer) {
                semanaContainer.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
  
  // ===== ATIVAR SEMANA 1 POR PADRÃO AO CARREGAR A PÁGINA =====
  function ativarSemana1PorPadrao() {
      const botaoSemana1 = document.getElementById('semana1PortfolioButton');
      if (botaoSemana1) {
          // Atualizar estilo
          atualizarEstiloBotaoAtivo(botaoSemana1);
          // Renderizar semana 1
          renderizarSemana('Semana 1');
      }
  }
  
  // ===== BOTÃO VOLTAR PARA AS JORNADAS =====
  const voltarJornadasBtn = document.querySelector('#jornadasButton:first-child');
  if (voltarJornadasBtn) {
      voltarJornadasBtn.addEventListener('click', function() {
          window.location.href = 'jornadas.html';
      });
  }
  
  // ===== BOTÃO VOLTAR PARA A INTRODUÇÃO =====
  const voltarIntroducaoBtn = document.querySelector('#jornadasButton:last-child');
  if (voltarIntroducaoBtn) {
      voltarIntroducaoBtn.addEventListener('click', function() {
          window.location.href = 'index.html';
      });
  }
  
  // ===== BOTÃO BAIXAR PORTFÓLIO =====
  const portfolioButton = document.getElementById('portfolioButton');
  if (portfolioButton) {
      portfolioButton.addEventListener('click', function() {
          //console.log('Baixar portfólio - implementar depois');
          // TODO: Implementar geração de PDF ou download dos dados
      });
  }
  
  // ===== INICIALIZAR PÁGINA =====
  ativarSemana1PorPadrao();
  
  // Scroll suave para o topo
  window.scrollTo({
      top: 0,
      behavior: 'smooth'
  });
  
});