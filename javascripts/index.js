$(document).ready(function(){

  // HEADER DINÂMICO
  $(window).scroll(function(){
    var nav = $(".header-dinamico .container");
    var scroll = $(window).scrollTop();
    if(scroll == 0){
      nav.fadeIn();
    } else {
      nav.fadeOut();
    }
  });

  // ==========================================
  // FUNÇÕES AUXILIARES DE FORMATAÇÃO
  // ==========================================
  
  function formatarEmailParaExibicao(email) {
    if (!email) return 'Usuário';
    const parteAteBr = email.split('.br')[0];
    return parteAteBr;
  }
  
  // ==========================================
  // FUNÇÕES DE LOGIN
  // ==========================================
  
  function isUserLoggedIn() {
    if (window.PassaporteCientifico && window.PassaporteCientifico.isLogado) {
      return window.PassaporteCientifico.isLogado();
    }
    return localStorage.getItem('aluno_logado') === 'true';
  }
  
  function getUserData() {
    if (window.PassaporteCientifico && window.PassaporteCientifico.getUserData) {
      return window.PassaporteCientifico.getUserData();
    }
    const userData = localStorage.getItem('aluno_passaporte_cientifico');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (e) {
        return null;
      }
    }
    return null;
  }
  
  // ==========================================
  // CONFIGURAÇÕES DOS BOTÕES
  // ==========================================
  
  const botaoLogin = document.querySelector('#buttonFazerLogin');
  
  if (botaoLogin) {
    botaoLogin.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Se já está logado, não faz nada (botão travado)
      if (isUserLoggedIn()) {
        console.log('🔒 Usuário já está logado. Botão travado.');
        return;
      }
      
      // Inicia o fluxo de login (usuário não logado)
      if (window.PassaporteCientifico && window.PassaporteCientifico.iniciarLogin) {
        window.PassaporteCientifico.iniciarLogin();
      } else {
        console.error('Erro: Serviço de login não carregado');
        alert('Serviço de login não disponível. Recarregue a página e tente novamente.');
      }
    });
  }
  
  // Navegação para a Introdução
  const botaoIntroducao = document.querySelector('#buttonIntroducao');
  const sectionBemVindo = document.querySelector('#introducao-bemVindo');
  
  if (botaoIntroducao && sectionBemVindo) {
    botaoIntroducao.addEventListener('click', () => {
      sectionBemVindo.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  }
  
  
  
  // ==========================================
  // ATUALIZA INTERFACE DO USUÁRIO LOGADO
  // ==========================================
  
  if (isUserLoggedIn()) {
    const userData = getUserData();
    if (userData) {
      console.log('👤 Usuário logado:', userData);
      
      const emailFormatado = formatarEmailParaExibicao(userData.email);
      const textoExibido = userData.nome || emailFormatado || 'Usuário';
      
      // Atualiza o user-status se existir
      const userStatusElement = document.getElementById('user-status');
      if (userStatusElement) {
        userStatusElement.innerHTML = `
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="color: #2A5555;">
              <i class="material-icons" style="font-size: 18px;">account_circle</i>
              Olá, ${textoExibido}!
            </span>
          </div>
        `;
      }
      
      // Atualiza o botão de login para mostrar que está logado, mas desabilitado
      if (botaoLogin) {
        botaoLogin.innerHTML = `
          <img src="assets/introducao/icone_login.png" alt="ícone de login">
          <span>${textoExibido}</span>
        `;
        botaoLogin.disabled = true;
        botaoLogin.style.opacity = '0.6';
        botaoLogin.style.cursor = 'not-allowed';
        botaoLogin.title = 'Você já está logado. Aguarde a expiração do login para entrar com outra conta.';
      }
    }
  }
  
});