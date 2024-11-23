let pecas = [];
let larguraTecido;

function adicionarPeca() {
    let nome = document.getElementById('nomePeca').value;
    let comprimento = parseFloat(document.getElementById('comprimentoPeca').value);
    let largura = parseFloat(document.getElementById('larguraPeca').value);

    if (nome === '' || isNaN(comprimento) || isNaN(largura)) {
        alert("Por favor, insira todos os dados corretamente.");
        return;
    }

    // Adicionar a peça ao array de peças
    pecas.push({ nome, comprimento, largura });
    atualizarPlano();
    limparCampos();
}

function atualizarPlano() {
    larguraTecido = parseFloat(document.getElementById('largura').value);
    if (isNaN(larguraTecido)) {
        alert("Por favor, insira a largura do tecido.");
        return;
    }

    let planoTecido = document.getElementById('tecido');
    planoTecido.innerHTML = ''; // Limpar o conteúdo anterior

    let xOffset = 0;
    let yOffset = 0;
    let linhaAtual = 0;

    pecas.forEach((peca, index) => {
        let pecaDiv = document.createElement('div');
        pecaDiv.classList.add('peca');
        pecaDiv.style.width = peca.largura * 100 + 'px';
        pecaDiv.style.height = peca.comprimento * 100 + 'px';
        pecaDiv.innerHTML = `${peca.nome}<br>${peca.comprimento}m x ${peca.largura}m`;

        // Botão para remover a peça
        let botaoRemover = document.createElement('button');
        botaoRemover.innerHTML = "Remover";
        botaoRemover.onclick = () => removerPeca(index);
        pecaDiv.appendChild(botaoRemover);

        // Ajustar a posição das peças
        if (xOffset + peca.largura <= larguraTecido) {
            pecaDiv.style.left = xOffset * 100 + 'px';
            pecaDiv.style.top = yOffset * 100 + 'px';
            xOffset += peca.largura;
        } else {
            xOffset = peca.largura;
            yOffset += linhaAtual;
            linhaAtual = peca.comprimento;
            pecaDiv.style.left = 0;
            pecaDiv.style.top = yOffset * 100 + 'px';
        }

        planoTecido.appendChild(pecaDiv);
    });

    // Ajustar a altura do plano de corte dinamicamente
    document.getElementById('tecido').style.height = (yOffset + linhaAtual) * 100 + 'px';

    calcularMetragem();
}

function limparCampos() {
    document.getElementById('nomePeca').value = '';
    document.getElementById('comprimentoPeca').value = '';
    document.getElementById('larguraPeca').value = '';
}

function removerPeca(index) {
    pecas.splice(index, 1);
    atualizarPlano();
}

function calcularMetragem() {
    let alturaNecessaria = 0;
    let larguraOcupada = 0;

    pecas.forEach((peca) => {
        if (larguraOcupada + peca.largura > larguraTecido) {
            alturaNecessaria += peca.comprimento;
            larguraOcupada = peca.largura;
        } else {
            larguraOcupada += peca.largura;
            alturaNecessaria = Math.max(alturaNecessaria, peca.comprimento);
        }
    });

    document.getElementById('resultado').innerHTML = `Você precisará de aproximadamente ${alturaNecessaria.toFixed(2)} metros de tecido.`;
}

function imprimirPlano() {
    let originalContents = document.body.innerHTML;
    let printContents = document.querySelector('.container').innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
}
