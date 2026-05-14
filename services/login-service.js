// ==========================================
// CONFIGURAÇÕES DO LOGIN PASSAPORTE CIENTÍFICO
// ==========================================

const TIPO_ALUNO = "aluno_passaporte_cientifico";

// URL da ponte SAML (start)
const SAML_BRIDGE_START_URL = "https://apps.univesp.br/saml-fpa/start";

// URL base da API (fixa para produção)
const API_BASE = "https://apps.univesp.br/recurso-educacional-aberto";

// URL de verificação do login
const API_VERIFY = (email, codigo) => 
  `${API_BASE}/passaporte-cientifico/verificar-login/${encodeURIComponent(email)}/${encodeURIComponent(codigo)}`;

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

// Obtém a URL atual sem parâmetros
function getCurrentReturnUrl() {
  return window.location.origin + window.location.pathname;
}

// Remove parâmetros da URL sem recarregar a página
function clearUrlParams() {
  const cleanUrl = window.location.origin + window.location.pathname;
  window.history.replaceState({}, document.title, cleanUrl);
}

// Salva dados do aluno no localStorage
function saveUserData(alunoData) {
  try {
    localStorage.setItem('aluno_passaporte_cientifico', JSON.stringify(alunoData));
    localStorage.setItem('aluno_logado', 'true');
    localStorage.setItem('login_timestamp', Date.now().toString());
    console.log('✅ Dados do usuário salvos com sucesso', alunoData);
    return true;
  } catch (error) {
    console.error('❌ Erro ao salvar no localStorage:', error);
    return false;
  }
}

// ==========================================
// FUNÇÃO PRINCIPAL DE LOGIN
// ==========================================

// Inicia o fluxo de login (redireciona para SAML)
function iniciarLoginPassaporte() {
  console.log('🚀 Iniciando fluxo de login Passaporte Científico...');
  
  const returnUrl = encodeURIComponent(getCurrentReturnUrl());
  const redirectUrl = `${SAML_BRIDGE_START_URL}?returnUrl=${returnUrl}&tipoAluno=${encodeURIComponent(TIPO_ALUNO)}`;
  
  console.log('📍 Redirecionando para:', redirectUrl);
  window.location.href = redirectUrl;
}

// Verifica o login após retorno da SAML
async function verificarLoginPassaporte(email, codigo) {
  console.log('🔍 Verificando login para:', email);
  
  const verifyUrl = API_VERIFY(email, codigo);
  console.log('📡 Chamando API:', verifyUrl);
  
  try {
    const response = await fetch(verifyUrl);
    const responseText = await response.text();
    
    console.log('📥 Resposta da API - Status:', response.status);
    
    if (!response.ok) {
      if (response.status === 401) {
        const lowerText = responseText.toLowerCase();
        if (lowerText.includes('expirado')) {
          throw new Error('Login expirado. Por favor, tente novamente.');
        } else if (lowerText.includes('inválido') || lowerText.includes('invalido')) {
          throw new Error('Código inválido. Por favor, tente novamente.');
        }
      } else if (response.status === 404) {
        throw new Error('Usuário não encontrado. Verifique se seu email está cadastrado.');
      }
      
      throw new Error(`Erro na verificação (${response.status}): ${responseText}`);
    }
    
    let alunoData;
    try {
      alunoData = JSON.parse(responseText);
    } catch (e) {
      throw new Error('Resposta da API não é um JSON válido');
    }
    
    const saved = saveUserData(alunoData);
    
    if (saved) {
      console.log('🎉 Login realizado com sucesso!');
      return { success: true, data: alunoData };
    } else {
      throw new Error('Não foi possível salvar os dados localmente');
    }
    
  } catch (error) {
    console.error('❌ Erro na verificação:', error);
    return { 
      success: false, 
      error: error.message || 'Erro desconhecido ao verificar login' 
    };
  }
}

// Obtém dados do usuário logado
function getUserData() {
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

// Verifica se o usuário já está logado
function isUserLoggedIn() {
  const logado = localStorage.getItem('aluno_logado') === 'true';
  const userData = getUserData();
  
  if (logado && userData) {
    try {
      console.log('👤 Usuário já logado:', userData.email || userData.nome || 'Usuário');
      return true;
    } catch (e) {
      console.warn('⚠️ Dados do usuário corrompidos');
      return false;
    }
  }
  return false;
}

// ==========================================
// VERIFICAÇÃO PERIÓDICA DO LOGIN
// ==========================================

let verificacaoInterval = null;

// Função para validar se o login atual ainda é válido (com opção de não recarregar)
async function validarLoginAtual(skipReload = false) {
  const userData = getUserData();
  if (!userData || !userData.email || !userData.codigoLogin) {
    console.log('❌ Nenhum dado de usuário encontrado para validar');
    return false;
  }
  
  console.log('🔍 Validando login atual com backend...', userData.email);
  
  try {
    const verifyUrl = API_VERIFY(userData.email, userData.codigoLogin);
    const response = await fetch(verifyUrl);
    
    console.log('📥 Resposta da validação - Status:', response.status);
    
    if (response.ok) {
      console.log('✅ Login ainda é válido');
      return true;
    } else {
      console.log('❌ Login expirado ou inválido');
      if (!skipReload) {
        forcarLogoutERecarregar();
      }
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao validar login:', error);
    return true;
  }
}

// Função para forçar logout e recarregar
function forcarLogoutERecarregar(shouldReload = true) {
  console.log('🔄 Forçando logout...');
  
  localStorage.removeItem('aluno_passaporte_cientifico');
  localStorage.removeItem('aluno_logado');
  localStorage.removeItem('login_timestamp');
  
  if (verificacaoInterval) {
    clearInterval(verificacaoInterval);
    verificacaoInterval = null;
  }
  
  if (shouldReload) {
    console.log('🔄 Recarregando página...');
    window.location.reload();
  }
}

// Inicia a verificação periódica (primeiro verifica imediatamente)
async function iniciarVerificacaoPeriodica() {
  // Para o intervalo anterior se existir
  if (verificacaoInterval) {
    clearInterval(verificacaoInterval);
    verificacaoInterval = null;
  }
  
  // PRIMEIRO: Verifica imediatamente ao entrar na página
  console.log('🔍 Executando verificação imediata de login...');
  const isValid = await validarLoginAtual(true); // true = não recarregar ainda
  
  if (!isValid) {
    console.log('⚠️ Login inválido na verificação inicial, forçando logout...');
    forcarLogoutERecarregar();
    return;
  }
  
  console.log('✅ Verificação inicial OK, iniciando verificação periódica a cada 30 segundos');

  // DEPOIS: Inicia o intervalo de 30 segundos
  verificacaoInterval = setInterval(async () => {
    if (isUserLoggedIn()) {
      const isValidPeriodico = await validarLoginAtual();
      if (!isValidPeriodico) {
        // O forcarLogoutERecarregar já é chamado dentro do validarLoginAtual
        if (verificacaoInterval) {
          clearInterval(verificacaoInterval);
          verificacaoInterval = null;
        }
      }
    }
  }, 30000);
}

// Faz logout (limpa dados do localStorage)
function logout() {
  console.log('👋 Realizando logout...');
  if (verificacaoInterval) {
    clearInterval(verificacaoInterval);
    verificacaoInterval = null;
  }
  localStorage.removeItem('aluno_passaporte_cientifico');
  localStorage.removeItem('aluno_logado');
  localStorage.removeItem('login_timestamp');
  console.log('✅ Logout realizado com sucesso');
}

// ==========================================
// INICIALIZAÇÃO AUTOMÁTICA
// ==========================================

async function autoCheckLoginReturn() {
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get('email');
  const codigo = urlParams.get('codigo');
  const tipoAluno = urlParams.get('tipoAluno');
  
  console.log('🔍 Verificando parâmetros na URL:', { email: email || 'null', codigo: codigo ? '***' : 'null', tipoAluno: tipoAluno || 'null' });
  
  if (email && codigo) {
    console.log('📨 Detectado retorno de login na URL');
    
    if (!tipoAluno || tipoAluno === TIPO_ALUNO) {
      mostrarLoadingLogin();
      const result = await verificarLoginPassaporte(email, codigo);
      clearUrlParams();
      
      if (result.success) {
        console.log('✅ Login confirmado, recarregando página...');
        window.location.reload();
      } else {
        console.error('❌ Falha no login:', result.error);
        mostrarErroLogin(result.error);
      }
    } else {
      console.warn('⚠️ Tipo de aluno incorreto:', tipoAluno);
      clearUrlParams();
    }
  } else {
    console.log('ℹ️ Nenhum parâmetro de login encontrado na URL');
  }
}

// Funções de UI
function mostrarLoadingLogin() {
  const loadingExistente = document.getElementById('loading-login');
  if (loadingExistente) loadingExistente.remove();
  
  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'loading-login';
  loadingDiv.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      color: white;
      flex-direction: column;
      font-family: 'Open Sans', sans-serif;
    ">
      <div style="
        width: 50px;
        height: 50px;
        border: 5px solid #f3f3f3;
        border-top: 5px solid #DD3A76;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 20px;
      "></div>
      <p>Validando seu login...</p>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    </div>
  `;
  document.body.appendChild(loadingDiv);
}

function removerLoadingLogin() {
  const loading = document.getElementById('loading-login');
  if (loading) loading.remove();
}

function mostrarErroLogin(mensagem) {
  removerLoadingLogin();
  
  const erroExistente = document.getElementById('error-login');
  if (erroExistente) erroExistente.remove();
  
  const errorDiv = document.createElement('div');
  errorDiv.id = 'error-login';
  errorDiv.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      min-width: 300px;
      background: #f44336;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      font-family: 'Open Sans', sans-serif;
      text-align: center;
      animation: slideDown 0.3s ease-out;
    ">
      <strong>❌ Erro no login</strong><br>
      ${mensagem}
    </div>
    <style>
      @keyframes slideDown {
        from {
          transform: translate(-50%, -100%);
          opacity: 0;
        }
        to {
          transform: translate(-50%, 0);
          opacity: 1;
        }
      }
    </style>
  `;
  document.body.appendChild(errorDiv);
  
  setTimeout(() => {
    const error = document.getElementById('error-login');
    if (error) error.remove();
  }, 5000);
}

// ==========================================
// INFORMAÇÕES DE CONFIGURAÇÃO (DEBUG)
// ==========================================

console.log('=== CONFIGURAÇÃO DO LOGIN SERVICE (PRODUÇÃO) ===');
console.log('API_BASE:', API_BASE);
console.log('Tipo aluno:', TIPO_ALUNO);
console.log('SAML URL:', SAML_BRIDGE_START_URL);
console.log('================================================');

// ==========================================
// EXPORTA FUNÇÕES PARA USO GLOBAL
// ==========================================

window.PassaporteCientifico = {
  iniciarLogin: iniciarLoginPassaporte,
  verificarLogin: verificarLoginPassaporte,
  isLogado: isUserLoggedIn,
  getUserData: getUserData,
  logout: logout,
  validarLogin: validarLoginAtual
};

// ==========================================
// INICIALIZAÇÃO
// ==========================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', async () => {
    await autoCheckLoginReturn();
    if (isUserLoggedIn()) {
      await iniciarVerificacaoPeriodica(); // Agora é async e já faz a verificação imediata
    }
  });
} else {
  (async () => {
    await autoCheckLoginReturn();
    if (isUserLoggedIn()) {
      await iniciarVerificacaoPeriodica();
    }
  })();
}

console.log('✅ Login Service carregado com sucesso!');