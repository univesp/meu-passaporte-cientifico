$(document).ready(function(){

  //////////////////////////////////////////////////////////////////
  // HEADER DINÂMICO
  // Mostra header somente no início da página.
  // Descomentar caso utilizada a classe .header-dinamico. Caso contrário, deletar.

    $(window).scroll(function(){
      var nav = $(".header-dinamico .container");
      var scroll = $(window).scrollTop();
      if(scroll == 0){
        nav.fadeIn();
      } else {
        nav.fadeOut();
      }
    });

  //////////////////////////////////////////////////////////////////

  // Seu código abaixo

  // Navegação para a Introdução
  const botaoIntroducao = document.querySelector('#buttonIntroducao');
  const sectionBemVindo = document.querySelector('#introducao-bemVindo');

  botaoIntroducao.addEventListener('click', () => {
    sectionBemVindo.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });

  // Navega para a tela de Jornadas
  const botaoJornadas = document.querySelector('#buttonJornadas');

  botaoJornadas.addEventListener('click', () => {
    window.location.href = '/jornadas.html';
  })

})
