// modal-passaporte.js

// Variável global para controlar o modal
let modalPassaporte = null;

// Função para abrir o modal do passaporte (pode ser chamada de qualquer lugar)
function abrirModalPassaporte(carimbosRecebidos) {
    // Verificar se o modal já existe
    let modalOverlay = document.querySelector('.modal-passaporte-overlay');
    
    if (!modalOverlay) {
        // Criar overlay do modal
        modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-passaporte-overlay';
        
        // Criar conteúdo do modal
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-passaporte-content';
        
        // Clonar o passaporte-container (precisa existir na página)
        const passaporteOriginal = document.querySelector('.passaporte-container');
        
        if (!passaporteOriginal) {
            console.error('❌ Elemento .passaporte-container não encontrado!');
            return;
        }
        
        const passaporteClone = passaporteOriginal.cloneNode(true);
        
        // Garantir que todos os carimbos estejam visíveis conforme o estado atual
        const carimbosClone = passaporteClone.querySelectorAll('.carimbo');
        carimbosClone.forEach((carimbo, index) => {
            if (carimbosRecebidos && carimbosRecebidos[index]) {
                carimbo.style.display = 'block';
            } else {
                carimbo.style.display = 'none';
            }
        });
        
        modalContent.appendChild(passaporteClone);
        
        // Criar botão de fechar
        const botaoFechar = document.createElement('button');
        botaoFechar.className = 'botao-fechar-modal';
        botaoFechar.innerHTML = '×';
        botaoFechar.addEventListener('click', fecharModalPassaporte);
        
        modalContent.appendChild(botaoFechar);
        modalOverlay.appendChild(modalContent);
        
        // Adicionar evento para fechar ao clicar no overlay
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                fecharModalPassaporte();
            }
        });
        
        document.body.appendChild(modalOverlay);
        
        // Adicionar suporte para tecla ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                fecharModalPassaporte();
            }
        });
    } else {
        // Se o modal já existe, atualizar os carimbos
        const passaporteClone = modalOverlay.querySelector('.passaporte-container');
        if (passaporteClone) {
            const carimbosClone = passaporteClone.querySelectorAll('.carimbo');
            carimbosClone.forEach((carimbo, index) => {
                if (carimbosRecebidos && carimbosRecebidos[index]) {
                    carimbo.style.display = 'block';
                } else {
                    carimbo.style.display = 'none';
                }
            });
        }
    }
    
    // Mostrar o modal com animação
    setTimeout(() => {
        modalOverlay.classList.add('ativo');
    }, 10);
}

// Função para fechar o modal
function fecharModalPassaporte() {
    const modalOverlay = document.querySelector('.modal-passaporte-overlay');
    if (modalOverlay) {
        modalOverlay.classList.remove('ativo');
        
        // Remover do DOM após a animação
        setTimeout(() => {
            if (modalOverlay && !modalOverlay.classList.contains('ativo')) {
                modalOverlay.remove();
            }
        }, 300);
    }
}