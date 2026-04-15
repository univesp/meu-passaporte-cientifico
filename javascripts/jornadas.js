document.addEventListener('DOMContentLoaded', function() {

  // Datas de desbloqueio de cada jornada (Ano, Mês, Dia)
  function dataBrasil(ano, mes, dia) {
      return new Date(ano, mes - 1, dia);
  }

  const datasDesbloqueio = [
      dataBrasil(2026, 4, 14), // jornada 1
      dataBrasil(2026, 4, 15), // jornada 2
      dataBrasil(2026, 4, 15), // jornada 3
      dataBrasil(2026, 4, 15),  // jornada 4
      dataBrasil(2026, 4, 15), // jornada 5
      dataBrasil(2026, 4, 15), // jornada 6
      dataBrasil(2026, 4, 17)  // jornada 7
  ];

  // Data atual
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  // Pegar todas as jornadas
  const jornadas = document.querySelectorAll('.jornada');

  jornadas.forEach((jornada, index) => {
      const dataDesbloqueio = datasDesbloqueio[index];
      dataDesbloqueio.setHours(0, 0, 0, 0);
      
      // Formatar data para dd/mm/aaaa
      const dia = dataDesbloqueio.getDate().toString().padStart(2, '0');
      const mes = (dataDesbloqueio.getMonth() + 1).toString().padStart(2, '0');
      const ano = dataDesbloqueio.getFullYear();
      const dataFormatada = `${dia}/${mes}/${ano}`;
      
      // Inserir a data no span
      const dataSpan = jornada.querySelector('.data-jornada-liberada');
      if (dataSpan) {
          dataSpan.textContent = dataFormatada;
      }
      
      // Verificar se está desbloqueada
      const estaDesbloqueada = hoje >= dataDesbloqueio;
      
      // Pegar o cadeado-container
      const cadeadoContainer = jornada.querySelector('.cadeado-container');
      
      if (estaDesbloqueada) {
          jornada.classList.remove('jornada-bloqueada');
          jornada.classList.add('jornada-ativa');
          
          // Remover ou esconder o cadeado-container
          if (cadeadoContainer) {
              cadeadoContainer.style.display = 'none';
          }
          
          // Tornar clicável - redirecionar para a semana correspondente
          jornada.style.cursor = 'pointer';
          jornada.addEventListener('click', function() {
              window.location.href = `semana-${index + 1}.html`;
          });
      } else {
          // Garantir que está bloqueada
          jornada.classList.add('jornada-bloqueada');
          jornada.classList.remove('jornada-ativa');
          
          // Garantir que o cadeado-container está visível
          if (cadeadoContainer) {
              cadeadoContainer.style.display = 'flex';
          }
      }
  });

  // Botão voltar
  const btnVoltar = document.querySelector('.btn-voltar');
  if (btnVoltar) {
      btnVoltar.addEventListener('click', function() {
          window.history.back();
      });
  }

});