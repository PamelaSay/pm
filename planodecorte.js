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

    // Limpar o conteúdo anterior
    const tecido = document.getElementById('tecido');
    tecido.innerHTML = ''; 

    let xOffset = 0;
    let yOffset = 0;

    pecas.forEach((peca) => {
        let pecaDiv = document.createElement('div');
        pecaDiv.classList.add('peca');
        pecaDiv.style.width = peca.largura * 100 + 'px';
        pecaDiv.style.height = peca.comprimento * 100 + 'px';
        pecaDiv.innerHTML = `${peca.nome}<br>${peca.comprimento}m x ${peca.largura}m`;

        // Ajustar a posição das peças
        if (xOffset + peca.largura <= larguraTecido) {
            pecaDiv.style.left = xOffset * 100 + 'px';
            pecaDiv.style.top = yOffset * 100 + 'px';
            xOffset += peca.largura;
        } else {
            xOffset = peca.largura;
            yOffset += 1;
            pecaDiv.style.left = 0;
            pecaDiv.style.top = yOffset * 100 + 'px';
        }

        tecido.appendChild(pecaDiv);
    });

    calcularMetragem();
}

function limparCampos() {
    document.getElementById('nomePeca').value = '';
    document.getElementById('comprimentoPeca').value = '';
    document.getElementById('larguraPeca').value = '';
}

function calcularMetragem() {
    // Calcular a área total das peças
    let areaTotal = pecas.reduce((total, peca) => total + (peca.comprimento * peca.largura), 0);

    // Calcular a metragem necessária com base na largura do tecido
    let metragemNecessaria = areaTotal / larguraTecido;
    
    // Exibir o resultado
    document.getElementById('resultado').innerHTML = `Você precisará de aproximadamente ${metragemNecessaria.toFixed(2)} metros de tecido.`;
}

// Função para imprimir o plano de corte
function imprimirPlano() {
    let originalContents = document.body.innerHTML;
    let printContents = document.querySelector('.container').innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
}
