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

    let xOffset = 0; // Posição horizontal inicial
    let yOffset = 0; // Posição vertical inicial
    let alturaAtualLinha = 0; // Armazena a altura da maior peça da linha

    pecas.forEach((peca) => {
        let pecaDiv = document.createElement('div');
        pecaDiv.classList.add('peca');
        pecaDiv.innerHTML = `${peca.nome}<br>${peca.comprimento}m x ${peca.largura}m`;

        // Define as dimensões considerando o sentido
        let larguraPeca = peca.sentido === 'enviesado' ? peca.comprimento : peca.largura;
        let alturaPeca = peca.sentido === 'enviesado' ? peca.largura : peca.comprimento;

        larguraPeca *= 100; // Escala para visualização
        alturaPeca *= 100;

        // Verifica se a peça cabe na largura restante da linha
        if (xOffset + larguraPeca > larguraTecido * 100) {
            xOffset = 0; // Vai para o início da próxima linha
            yOffset += alturaAtualLinha; // Move para baixo na altura da maior peça da linha
            alturaAtualLinha = 0; // Reseta a altura da linha
        }

        // Ajusta a posição e insere no plano
        pecaDiv.style.width = `${larguraPeca}px`;
        pecaDiv.style.height = `${alturaPeca}px`;
        pecaDiv.style.left = `${xOffset}px`;
        pecaDiv.style.top = `${yOffset}px`;

        // Atualiza as margens horizontais e altura da linha
        xOffset += larguraPeca;
        alturaAtualLinha = Math.max(alturaAtualLinha, alturaPeca);

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
