let pecas = [];
let larguraTecido;
let planoTecido = document.getElementById('tecido');
let pecasLista = document.getElementById('pecas-lista');

function adicionarPeca() {
    let nome = document.getElementById('nomePeca').value;
    let comprimento = parseFloat(document.getElementById('comprimentoPeca').value);
    let largura = parseFloat(document.getElementById('larguraPeca').value);
    let posicionamento = document.getElementById('posicionamento').value;

    if (nome === '' || isNaN(comprimento) || isNaN(largura)) {
        alert("Por favor, insira todos os dados corretamente.");
        return;
    }

    pecas.push({ nome, comprimento, largura, posicionamento });
    atualizarPlano();
    limparCampos();
}

function atualizarPlano() {
    larguraTecido = parseFloat(document.getElementById('largura').value);
    if (isNaN(larguraTecido)) {
        alert("Por favor, insira a ourela do tecido.");
        return;
    }

    planoTecido.innerHTML = ''; // Limpar o plano anterior
    pecasLista.innerHTML = ''; // Limpar a lista anterior

    let xOffset = 0;
    let yOffset = 0;
    let alturaMaxima = 0;

    pecas.forEach((peca, index) => {
        let pecaDiv = document.createElement('div');
        pecaDiv.classList.add('peca');
        pecaDiv.style.width = peca.largura * 100 + 'px';
        pecaDiv.style.height = peca.comprimento * 100 + 'px';
        pecaDiv.innerHTML = `${peca.nome}<br>${peca.comprimento}m x ${peca.largura}m`;

        if (xOffset + peca.largura <= larguraTecido) {
            pecaDiv.style.left = xOffset * 100 + 'px';
            pecaDiv.style.top = yOffset * 100 + 'px';
            xOffset += peca.largura;
        } else {
            xOffset = peca.largura;
            yOffset += alturaMaxima;
            alturaMaxima = peca.comprimento;
            pecaDiv.style.left = 0;
            pecaDiv.style.top = yOffset * 100 + 'px';
        }

        planoTecido.appendChild(pecaDiv);

        let itemLista = document.createElement('div');
        itemLista.innerHTML = `${peca.nome} (${peca.comprimento}m x ${peca.largura}m) - ${peca.posicionamento} <button onclick="removerPeca(${index})">Remover</button>`;
        pecasLista.appendChild(itemLista);
    });

    calcularMetragem();
}

function removerPeca(index) {
    pecas.splice(index, 1);
    atualizarPlano();
}

function calcularMetragem() {
    let alturaTotal = pecas.reduce((total, peca) => total + (peca.comprimento), 0);
    document.getElementById('resultado').innerHTML = `Você precisará de ${alturaTotal.toFixed(2)} metros de tecido.`;
}

function limparCampos() {
    document.getElementById('nomePeca').value = '';
    document.getElementById('comprimentoPeca').value = '';
    document.getElementById('larguraPeca').value = '';
}
