let pecas = [];
let larguraTecido;

function adicionarPeca() {
    let nome = document.getElementById('nome').value;
    let comprimento = parseFloat(document.getElementById('comprimento').value);
    let largura = parseFloat(document.getElementById('larguraPeca').value);

    if (nome === '' || isNaN(comprimento) || isNaN(largura)) {
        alert("Por favor, insira todos os dados corretamente.");
        return;
    }

    let area = comprimento * largura;
    pecas.push({ nome, comprimento, largura, area });
    atualizarPlano();
    limparCampos();
}

function atualizarPlano() {
    larguraTecido = parseFloat(document.getElementById('largura').value);
    if (isNaN(larguraTecido)) {
        alert("Por favor, insira a largura do tecido.");
        return;
    }

    // Limpar o conteúdo anterior do plano de corte
    const tecido = document.getElementById('tecido');
    tecido.innerHTML = ''; 

    let xOffset = 0; // Posição X onde as peças começam a ser posicionadas
    let yOffset = 0; // Posição Y onde as peças começam a ser posicionadas
    let linha = 0; // Para indicar se as peças estão sendo colocadas na mesma linha ou na próxima

    // Reorganizar as peças conforme a largura do tecido
    pecas.forEach((peca) => {
        let pecaDiv = document.createElement('div');
        pecaDiv.classList.add('peca');
        pecaDiv.style.width = peca.largura * 100 + 'px'; // Ajustando para a visualização
        pecaDiv.style.height = peca.comprimento * 100 + 'px';
        pecaDiv.innerHTML = `${peca.nome}<br>${peca.comprimento}m x ${peca.largura}m`;

        if (xOffset + peca.largura <= larguraTecido) {
            // Se a peça cabe na linha atual, posiciona ela na horizontal
            pecaDiv.style.left = xOffset * 100 + 'px';
            pecaDiv.style.top = yOffset * 100 + 'px';
            xOffset += peca.largura; // Atualizar posição X para a próxima peça na linha
        } else {
            // Se a peça não cabe, começa uma nova linha
            xOffset = peca.largura; // Iniciar nova linha com a largura da peça
            yOffset += 1; // Descer para a próxima linha
            pecaDiv.style.left = 0;
            pecaDiv.style.top = yOffset * 100 + 'px';
        }

        tecido.appendChild(pecaDiv);
    });

    calcularMetragem(); // Recalcular a metragem do tecido
}

function limparCampos() {
    document.getElementById('nome').value = '';
    document.getElementById('comprimento').value = '';
    document.getElementById('larguraPeca').value = '';
}

function calcularMetragem() {
    // Calcular a área total das peças
    let areaTotal = pecas.reduce((total, peca) => total + peca.area, 0);
    
    // Calcular a metragem necessária dividindo pela largura do tecido
    let metragemNecessaria = areaTotal / larguraTecido;
    
    // Exibir a metragem necessária
    document.getElementById('resultado').innerHTML = `Você precisará de aproximadamente ${metragemNecessaria.toFixed(2)} metros de tecido.`;
}
