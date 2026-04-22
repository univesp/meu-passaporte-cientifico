// Configuração centralizada de datas
const CONFIG = {
  // Datas de desbloqueio das semanas (Ano, Mês, Dia)
  datasDesbloqueio: [
      { ano: 2026, mes: 4, dia: 14 },  // semana 1
      { ano: 2026, mes: 4, dia: 15 },  // semana 2
      { ano: 2026, mes: 4, dia: 15 },  // semana 3
      { ano: 2026, mes: 4, dia: 15 },  // semana 4
      { ano: 2026, mes: 4, dia: 15 },  // semana 5
      { ano: 2026, mes: 4, dia: 15 },  // semana 6
      { ano: 2026, mes: 4, dia: 17 }   // semana 7
  ],
  
  // Função auxiliar para criar data no formato Brasil
  dataBrasil: function(ano, mes, dia) {
      return new Date(ano, mes - 1, dia);
  },
  
  // Função para obter o array de datas como Date objects
  getDatasDesbloqueio: function() {
      return this.datasDesbloqueio.map(data => 
          this.dataBrasil(data.ano, data.mes, data.dia)
      );
  }
};