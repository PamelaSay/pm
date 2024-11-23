let pecas = [];
let larguraTecido;
let planoTecido = document.getElementById('tecido');

function adicionarPeca() {
    let nome = document.getElementById('nomePeca').value;
    let comprimento = parseFloat(document.getElementById('comprimentoPeca').value);
    let largura = parseFloat(document.getElementById('larguraPeca').value);
    let sentido = document.getElementById('sentidoPeca').value;

    if (nome === '' || isNaN(comprimento) || isNaN(largura)) {
        alert("Por favor, insira todos os dados corretamente.");
        return;
    }

    // Adicionar a peça ao array de peças
    pecas.push({ nome, comprimento, largura, sentido });
    atualizarPlano();
    limparCampos();
    listarPecas();
}

function atualizarPlano() {
    larguraTecido = parseFloat(document.getElementById('largura').value);
    if (isNaN(larguraTecido)) {
        alert("Por favor, insira a largura do tecido.");
        return;
    }

    planoTecido.innerHTML = ''; // Limpar o conteúdo anterior

    let xOffset = 0;
    let yOffset = 0;

    pecas.forEach((peca) => {
        let pecaDiv = document.createElement('div');
        pecaDiv.classList.add('peca');
        
        // Ajuste do tamanho e posicionamento dependendo do sentido
        if (peca.sentido === 'enviesado') {
            pecaDiv.style.width = peca.largura * 100 + 'px';
            pecaDiv.style.height = peca.comprimento * 100 + 'px';
            pecaDiv.style.transform = "rotate(45deg)"; // Rotaciona a peça para o enviesado
        } else {
            pecaDiv.style.width = peca.largura * 100 + 'px'; // A largura é multiplicada por 100 para visualização
            pecaDiv.style.height = peca.comprimento * 100 + 'px'; // O mesmo para o comprimento
        }
        
        pecaDiv.innerHTML = `${peca.nome}<br>${peca.comprimento}m x ${peca.largura}m`;

        // Ajustar a posição das peças para não sobrepor
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

        planoTecido.appendChild(pecaDiv);
    });

    calcularMetragem();
}

function limparCampos() {
    document.getElementById('nomePeca').value = '';
    document.getElementById('comprimentoPeca').value = '';
    document.getElementById('larguraPeca').value = '';
}

function calcularMetragem() {
    let areaTotal = pecas.reduce((total, peca) => total + (peca.comprimento * peca.largura), 0);
    let metragemNecessaria = areaTotal / larguraTecido;
    
    document.getElementById('resultado').innerHTML = `Você precisará de aproximadamente ${metragemNecessaria.toFixed(2)} metros de tecido.`;
}

function listarPecas() {
    let tabela = document.getElementById('tabelaPecas').getElementsByTagName('tbody')[0];
    tabela.innerHTML = ''; // Limpar a tabela antes de inserir novos dados

    pecas.forEach((peca, index) => {
        let row = tabela.insertRow();
        row.insertCell(0).textContent = peca.nome;
        row.insertCell(1).textContent = peca.comprimento + "m";
        row.insertCell(2).textContent = peca.largura + "m";
        row.insertCell(3).textContent = peca.sentido;

        let removerBtn = document.createElement('button');
        removerBtn.textContent = 'Remover';
        removerBtn.onclick = () => removerPeca(index);
        row.insertCell(4).appendChild(removerBtn);
    });
}

function removerPeca(index) {
    pecas.splice(index, 1);
    atualizarPlano();
    listarPecas();
}

function imprimirPlano() {
    window.print();
}

document.getElementById('largura').addEventListener('change', atualizarPlano);
