document.addEventListener("DOMContentLoaded", () => {
    const planoCorte = document.querySelector('.plano-corte');
    const adicionarPecaBtn = document.getElementById('adicionarPecaBtn');

    // Dimensões do plano de corte
    const larguraPlano = 1200; // 1200 mm de largura (ajustável)
    const alturaPlano = 2000; // 2000 mm de altura (ajustável)
    planoCorte.style.width = `${larguraPlano / 10}px`;
    planoCorte.style.height = `${alturaPlano / 10}px`;

    // Adiciona uma nova peça ao clicar no botão
    adicionarPecaBtn.addEventListener("click", () => {
        const nomePeca = document.getElementById("nomePeca").value.trim();
        const larguraPeca = parseFloat(document.getElementById("larguraPeca").value);
        const comprimentoPeca = parseFloat(document.getElementById("comprimentoPeca").value);
        const quantidadePeca = parseInt(document.getElementById("quantidadePeca").value, 10);

        if (!nomePeca || !larguraPeca || !comprimentoPeca || quantidadePeca < 1) {
            alert("Preencha todos os campos corretamente.");
            return;
        }

        for (let i = 0; i < quantidadePeca; i++) {
            const novaPeca = document.createElement("div");
            novaPeca.classList.add("peça");
            novaPeca.style.width = `${larguraPeca * 10}px`; // Escala 1:10
            novaPeca.style.height = `${comprimentoPeca * 10}px`;
            novaPeca.textContent = nomePeca; // Nome da peça como texto interno

            // Posicionamento automático
            const posicao = encontrarPosicaoDisponivel(planoCorte, novaPeca);
            if (posicao) {
                novaPeca.style.left = `${posicao.x}px`;
                novaPeca.style.top = `${posicao.y}px`;
                planoCorte.appendChild(novaPeca);
            } else {
                alert(`Sem espaço suficiente para a peça ${nomePeca}.`);
                break;
            }
        }
    });

    // Função para encontrar a posição disponível no plano
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

    // Verifica se uma peça colide com outra
    function verificarColisao(plano, x, y, largura, altura) {
        const pecas = plano.querySelectorAll(".peça");
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
                return true; // Há colisão
            }
        }
        return false; // Sem colisão
    }
});
