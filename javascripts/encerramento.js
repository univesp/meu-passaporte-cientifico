document.addEventListener('DOMContentLoaded', function() {
    
  // ===== BOTÃO 1: VOLTAR PARA AS JORNADAS =====
  const botaoVoltarJornadas = document.querySelector('.botoes-inicio button:first-child');
  if (botaoVoltarJornadas) {
      botaoVoltarJornadas.addEventListener('click', function() {
          window.location.href = 'jornadas.html';
      });
  }
  
  // ===== BOTÃO 2: IR PARA O PORTFÓLIO =====
  const botaoIrPortfolio = document.querySelector('.botoes-inicio button:nth-child(2)');
  if (botaoIrPortfolio) {
      botaoIrPortfolio.addEventListener('click', function() {
          window.location.href = 'portfolio.html';
      });
  }
  
  // ===== BOTÃO 3: REINICIAR TRILHA DA SEMANA 7 =====
  const botaoReiniciarSemana7 = document.querySelector('.botoes-inicio button:nth-child(3)');
  if (botaoReiniciarSemana7) {
      botaoReiniciarSemana7.addEventListener('click', function() {
          // Apenas mudar a flag de conclusão para false
          localStorage.setItem('semana7_concluida', 'false');
          
          // Redirecionar para a semana 7
          window.location.href = 'semana-7.html';
      });
  }
  
  // ===== SCROLL SUAVE PARA O TOPO =====
  window.scrollTo({
      top: 0,
      behavior: 'smooth'
  });
  
});