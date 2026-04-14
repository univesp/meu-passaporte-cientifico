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
  
  // ===== FUNÇÃO PARA CARREGAR DADOS DO LOCALSTORAGE =====
  function carregarDadosDaSemana(semana) {
      const dadosKey = `semana${semana}Dados`;
      const dadosSalvos = localStorage.getItem(dadosKey);
      
      if (dadosSalvos) {
          try {
              return JSON.parse(dadosSalvos);
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
      
      textareas.forEach(textarea => {
          textarea.value = '';
      });
      
      if (dados) {
          if (textareas[0] && dados.atividade) textareas[0].value = dados.atividade;
          if (textareas[1] && dados.aprendizado) textareas[1].value = dados.aprendizado;
          if (textareas[2] && dados.reflexoes) textareas[2].value = dados.reflexoes;
      }
  }
  
  // ===== FUNÇÃO PARA FORMATAR DATA =====
  function formatarDataBrasil(dataString) {
      if (!dataString) return 'Não preenchido';
      const partes = dataString.split('/');
      if (partes.length === 3) return dataString;
      return 'Não preenchido';
  }
  
  // ===== FUNÇÃO PARA GERAR HTML DE UMA SEMANA PARA O PDF =====
  function gerarHTMLSemanaParaPDF(semanaNumero, dadosSemana, dadosUsuario) {
    const cor = dadosSemana.cor;
    
    // Mapeamento das imagens dos personagens por semana
    const imagensPersonagens = {
        1: 'assets/Semana1/lumi-ultima-tela.png',
        2: 'assets/Semana2/lumi-ultima-tela.png',
        3: 'assets/Semana1/lumi-ultima-tela.png',
        4: 'assets/Semana4/lumi-ultima-tela.png',
        5: 'assets/Semana5/lumi-ultima-tela.png',
        6: 'assets/Semana6/lumi-ultima-tela.png',
        7: 'assets/Semana7/lumi-ultima-tela.png'
    };
    
    const imagemPersonagem = imagensPersonagens[semanaNumero];
    
    return `
        <div style="page-break-after: always; margin-bottom: 20px; font-family: 'Nunito', sans-serif;">
            <div style="display: flex; align-items: center; justify-content: center; gap: 15px; border-bottom: 2px solid ${cor}; padding-bottom: 10px; margin-bottom: 20px;">
                <h1 style="color: ${cor}; margin: 0;">Portfólio - Semana ${semanaNumero}</h1>
                <img src="${imagemPersonagem}" alt="Personagem Lumi" style="width: 80px; height: auto;">
            </div>
            <p style="text-align: center; font-size: 18px; font-weight: bold;">${dadosSemana.titulo}</p>
            <p style="text-align: center; font-size: 16px; margin-bottom: 30px;">${dadosSemana.subtitulo}</p>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 10px; margin-bottom: 30px;">
                <h3 style="color: ${cor}; margin-top: 0;">Informações da Visita</h3>
                <p><strong>Nome do aluno(a):</strong> ${dadosUsuario?.nomeAluno || 'Não preenchido'}</p>
                <p><strong>Local visitado:</strong> ${dadosUsuario?.local || 'Não preenchido'}</p>
                <p><strong>Data da visita:</strong> ${formatarDataBrasil(dadosUsuario?.dataCheckIn) || 'Não preenchido'}</p>
                <p><strong>Descrição do local:</strong> ${dadosUsuario?.descricaoLocal || 'Não preenchido'}</p>
            </div>
            
            <div style="margin-bottom: 30px;">
                <h3 style="color: ${cor}; border-left: 4px solid ${cor}; padding-left: 10px;">Registros da atividade</h3>
                <p style="white-space: pre-wrap; background-color: #fafafa; padding: 15px; border-radius: 8px;">${dadosUsuario?.atividade || 'Não preenchido'}</p>
            </div>
            
            <div style="margin-bottom: 30px;">
                <h3 style="color: ${cor}; border-left: 4px solid ${cor}; padding-left: 10px;">O que eu aprendi</h3>
                <p style="white-space: pre-wrap; background-color: #fafafa; padding: 15px; border-radius: 8px;">${dadosUsuario?.aprendizado || 'Não preenchido'}</p>
            </div>
            
            <div style="margin-bottom: 30px;">
                <h3 style="color: ${cor}; border-left: 4px solid ${cor}; padding-left: 10px;">Reflexões</h3>
                <p style="white-space: pre-wrap; background-color: #fafafa; padding: 15px; border-radius: 8px;">${dadosUsuario?.reflexoes || 'Não preenchido'}</p>
            </div>
            
            <hr style="margin-top: 40px;">
            <p style="text-align: center; color: #666; font-size: 12px;">Documento gerado pelo Meu Passaporte Científico - Univesp</p>
        </div>
    `;
  }
  
  // ===== FUNÇÃO PARA GERAR O PDF COMPLETO =====
  async function gerarPortfolioCompleto() {
      const btn = document.getElementById('portfolioButton');
      const textoOriginal = btn.innerHTML;
      btn.innerHTML = '<i class="material-icons" style="font-size: 18px;">hourglass_empty</i> Gerando Portfólio...';
      btn.disabled = true;
      
      try {
          const { jsPDF } = window.jspdf;
          const pdf = new jsPDF({
              unit: 'mm',
              format: 'a4',
              orientation: 'portrait'
          });
          
          let primeiraPagina = true;
          
          // Para cada semana de 1 a 7
          for (let i = 1; i <= 7; i++) {
              const dadosSemana = semanaDados.find(d => d.semana === i);
              const dadosUsuario = carregarDadosDaSemana(i);
              
              // Gerar HTML da semana
              const htmlSemana = gerarHTMLSemanaParaPDF(i, dadosSemana, dadosUsuario);
              
              // Criar elemento temporário
              const tempDiv = document.createElement('div');
              tempDiv.style.position = 'absolute';
              tempDiv.style.left = '-9999px';
              tempDiv.style.top = '0';
              tempDiv.style.width = '800px';
              tempDiv.style.backgroundColor = 'white';
              tempDiv.style.padding = '40px';
              tempDiv.innerHTML = htmlSemana;
              document.body.appendChild(tempDiv);
              
              await new Promise(resolve => setTimeout(resolve, 100));
              
              const canvas = await html2canvas(tempDiv, { 
                  scale: 2, 
                  backgroundColor: '#ffffff',
                  logging: false
              });
              
              const imgData = canvas.toDataURL('image/jpeg', 1.0);
              const imgWidth = 190;
              const imgHeight = (canvas.height * imgWidth) / canvas.width;
              
              if (!primeiraPagina) {
                  pdf.addPage();
              }
              primeiraPagina = false;
              
              pdf.addImage(imgData, 'JPEG', 10, 0, imgWidth, imgHeight);
              
              document.body.removeChild(tempDiv);
          }
          
          // Salvar o PDF
          pdf.save('Meu_Passaporte_Cientifico_Portfolio.pdf');
          
          btn.innerHTML = textoOriginal;
          btn.disabled = false;
          
      } catch (error) {
          console.error('Erro ao gerar PDF:', error);
          btn.innerHTML = textoOriginal;
          btn.disabled = false;
          alert('Ocorreu um erro ao gerar o portfólio. Tente novamente.');
      }
  }
  
  // ===== FUNÇÃO PARA ATUALIZAR O ESTILO DO BOTÃO ATIVO =====
  function atualizarEstiloBotaoAtivo(botaoAtivo) {
      botoesPortfolio.forEach(botao => {
          botao.style.backgroundColor = '';
          botao.style.color = '';
      });
      
      if (botaoAtivo) {
          botaoAtivo.style.backgroundColor = '#FFAB42';
          botaoAtivo.style.color = '#000';
      }
  }
  
  // ===== FUNÇÃO PARA RENDERIZAR O CONTEÚDO DA SEMANA =====
  function renderizarSemana(semana) {
      const semanaNumero = parseInt(semana.replace('Semana ', ''));
      const dadosSemana = semanaDados.find(d => d.semana === semanaNumero);
      
      if (!dadosSemana) return;
      
      semanaContainer.style.backgroundImage = dadosSemana.background;
      semanaContainer.style.backgroundSize = 'cover';
      semanaContainer.style.backgroundPosition = 'center';
      semanaContainer.style.backgroundRepeat = 'no-repeat';
      
      tituloElement.innerHTML = `<b>${dadosSemana.titulo}</b>`;
      subtituloElement.textContent = dadosSemana.subtitulo;
      
      tituloElement.style.color = dadosSemana.cor;
      subtituloElement.style.color = dadosSemana.cor;
      
      const contentTitulos = document.querySelectorAll('.content-titulo h3');
      contentTitulos.forEach(h3 => {
          h3.style.color = dadosSemana.cor;
      });
      
      const style = document.createElement('style');
      style.id = 'dynamic-line-color';
      style.textContent = `
          .content-titulo::after {
              background-color: ${dadosSemana.cor} !important;
          }
      `;
      
      const oldStyle = document.getElementById('dynamic-line-color');
      if (oldStyle) {
          oldStyle.remove();
      }
      document.head.appendChild(style);
      
      preencherTextareas(semanaNumero);
  }
  
  // ===== EVENTO DE CLICK NOS BOTÕES =====
  botoesPortfolio.forEach(botao => {
      botao.addEventListener('click', function() {
          const semana = this.textContent;
          
          if (semana === 'Passaporte') {
              const carimbosSalvos = localStorage.getItem('passaporte_carimbos');
              let carimbosRecebidos = [false, false, false, false, false, false, false];
              if (carimbosSalvos) {
                  try {
                      carimbosRecebidos = JSON.parse(carimbosSalvos);
                  } catch(e) {
                      console.error('Erro ao carregar carimbos:', e);
                  }
              }
              if (typeof abrirModalPassaporte === 'function') {
                  abrirModalPassaporte(carimbosRecebidos);
              } else {
                  console.error('❌ Função abrirModalPassaporte não encontrada!');
              }
              return;
          }
          
          atualizarEstiloBotaoAtivo(this);
          renderizarSemana(semana);
          
          const semanaContainerEl = document.querySelector('.semana-portfolio-container');
          if (semanaContainerEl) {
              semanaContainerEl.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
              });
          }
      });
  });
  
  // ===== ATIVAR SEMANA 1 POR PADRÃO =====
  function ativarSemana1PorPadrao() {
      const botaoSemana1 = document.getElementById('semana1PortfolioButton');
      if (botaoSemana1) {
          atualizarEstiloBotaoAtivo(botaoSemana1);
          renderizarSemana('Semana 1');
      }
  }
  
  // ===== BOTÕES DE NAVEGAÇÃO =====
  const voltarJornadasBtn = document.querySelector('#jornadasButton:first-child');
  if (voltarJornadasBtn) {
      voltarJornadasBtn.addEventListener('click', function() {
          window.location.href = 'jornadas.html';
      });
  }
  
  const voltarIntroducaoBtn = document.querySelector('#jornadasButton:last-child');
  if (voltarIntroducaoBtn) {
      voltarIntroducaoBtn.addEventListener('click', function() {
          window.location.href = 'index.html';
      });
  }
  
  // ===== BOTÃO BAIXAR PORTFÓLIO COMPLETO =====
  const portfolioButton = document.getElementById('portfolioButton');
  if (portfolioButton) {
      // Remove evento anterior e adiciona novo
      const novoBotao = portfolioButton.cloneNode(true);
      portfolioButton.parentNode.replaceChild(novoBotao, portfolioButton);
      
      novoBotao.addEventListener('click', function(e) {
          e.preventDefault();
          gerarPortfolioCompleto();
      });
  }
  
  // ===== INICIALIZAR PÁGINA =====
  ativarSemana1PorPadrao();
  
  window.scrollTo({
      top: 0,
      behavior: 'smooth'
  });
  
});