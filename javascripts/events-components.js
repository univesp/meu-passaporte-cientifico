/* Inserindo conteudos de componentes */

  // Função para inicializar os botões de compartilhamento
  function initSharing() {
    if (typeof $.fn.jsSocials !== 'undefined') {
      $(".sharing").jsSocials({
        shares: [
          {
            share: "facebook",
            logo: "fab fa-facebook-f",
          },
          {
            share: "twitter",
            logo: "fab fa-twitter",
          },
          {
            share: "whatsapp",
            logo: "fab fa-whatsapp",
          },
        ],
        url: window.location.href,
        text: 'Confira o REA ' + $(document).attr('title') + '.',
        showLabel: false,
        showCount: false,
        shareIn: "popup",
      });
    }
  }

  // Créditos
  const creditosContainer = document.querySelector('#creditos');
  creditosContainer.innerHTML = creditosContent;

  // Footer
  const footerContainer = document.querySelector('#footer');
  footerContainer.innerHTML = footerContent;


  // Inicializa os botões de compartilhamento APÓS inserir o footer
  initSharing();