// Selecionar todos os bullets
const bullets = document.querySelectorAll('.bullet-item');

// Ativar o primeiro bullet por padrão
if (bullets.length > 0) {
    bullets[0].classList.add('bullet-ativo');
}

// Adicionar evento de clique
bullets.forEach(bullet => {
    bullet.addEventListener('click', function() {
        // Remover ativo de todos
        bullets.forEach(b => {
            b.classList.remove('bullet-ativo');
        });
        
        // Ativar o clicado
        this.classList.add('bullet-ativo');
    });
});