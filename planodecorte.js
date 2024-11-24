document.addEventListener("DOMContentLoaded", () => {
    const planoCorte = document.querySelector('.plano-corte');
    const adicionarPecaBtn = document.getElementById('adicionarPecaBtn');
    
    const alturaInicialFixa = 2000; // Altura fixa do tecido (em milímetros, ajustável)
    planoCorte.style.height = `${alturaInicialFixa / 10}px`; // Altura convertida para pixel (escala de 1:10)

    // Função para adicionar peças
    adicionarPecaBtn.addEventListener('click', () => {
        const nomePeca = document.getElementById('nomePeca').value.trim();
        const larguraPeca = parseFloat(document.getElementById('larguraPeca').value);
        const comprimentoPeca = parseFloat(document.getElementById('comprimentoPeca').value);
        const quantidadePeca = parseInt(document.getElementById('quantidadePeca').value, 10);

        if (!nomePeca || !larguraPeca || !comprimentoPeca || quantidadePeca < 1) {
            alert("Preencha todos os campos corretamente.");
            return;
        }

        for (let i = 0; i < quantidadePeca; i++) {
            const novaPeca = document.createElement('div');
            novaPeca.classList.add('peça');
            novaPeca.style.width = `${larguraPeca * 10}px`; // Largura em escala 1:10
            novaPeca.style.height = `${comprimentoPeca * 10}px`; // Comprimento em escala 1:10
            novaPeca.style.backgroundColor = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`; // Cor aleatória para diferenciação
            novaPeca.setAttribute('title', nomePeca); // Tooltip com o nome da peça

            // Posiciona automaticamente sem sobreposição
            const posicao = encontrarPosicaoDisponivel(planoCorte, novaPeca);
            if (posicao) {
                novaPeca.style.left = `${posicao.x}px`;
                novaPeca.style.top = `${posicao.y}px`;
                planoCorte.appendChild(novaPeca);
            } else {
                alert("Não há espaço suficiente no plano de corte para esta peça.");
                break;
            }
        }
    });

    // Função para encontrar espaço disponível no plano de corte
    function encontrarPosicaoDisponivel(plano, peca) {
        const planoWidth = plano.offsetWidth;
        const planoHeight = plano.offsetHeight;
        const pecaWidth = parseFloat(peca.style.width);
        const pecaHeight = parseFloat(peca.style.height);

        for (let y = 0; y <= planoHeight - pecaHeight; y += 10) {
            for (let x = 0; x <= planoWidth - pecaWidth; x += 10) {
                if (!verificarColisao(plano, x, y, pecaWidth, pecaHeight)) {
                    return { x, y };
                }
            }
        }
        return null; // Sem espaço disponível
    }

    // Função para verificar se há colisão entre peças
    function verificarColisao(plano, x, y, largura, altura) {
        const pecas = plano.querySelectorAll('.peça');
        for (const peca of pecas) {
            const pecaX = parseFloat(peca.style.left);
            const pecaY = parseFloat(peca.style.top);
            const pecaWidth = parseFloat(peca.style.width);
            const pecaHeight = parseFloat(peca.style.height);

            if (
                x < pecaX + pecaWidth &&
                x + largura > pecaX &&
                y < pecaY + pecaHeight &&
                y + altura > pecaY
            ) {
                return true;
            }
        }
        return false;
    }
});
