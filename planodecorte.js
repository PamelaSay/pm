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
    let larguraTecido = parseFloat(document.getElementById('largura').value);
    if (isNaN(larguraTecido)) {
        alert("Por favor, insira a largura do tecido.");
        return;
    }

    let alturaTecido = 1; // Configuração inicial de 1 metro
    planoTecido.style.width = larguraTecido * 100 + "px"; // Multiplica para visualização
    planoTecido.style.height = alturaTecido * 100 + "px";

    planoTecido.innerHTML = ''; // Limpar plano

    // Reposicionar indicadores
    let ourelas = document.createElement('div');
    ourelas.id = 'ourelas';
    planoTecido.appendChild(ourelas);

    let trama = document.createElement('div');
    trama.id = 'trama-indicator';
    trama.innerHTML = `<span>Trama (sentido do fio)</span>`;
    planoTecido.appendChild(trama);

    let fio = document.createElement('div');
    fio.id = 'fio-indicator';
    planoTecido.appendChild(fio);

    // Posicionar peças
    let xOffset = 20; // Começa após a ourela
    let yOffset = 20; // Começa após a trama
    let alturaAtualLinha = 0;

    pecas.forEach((peca) => {
        let pecaDiv = document.createElement('div');
        pecaDiv.classList.add('peca');
        pecaDiv.innerHTML = `${peca.nome}<br>${peca.comprimento}m x ${peca.largura}m`;

        // Define as dimensões da peça
        let larguraPeca = peca.sentido === 'trama' ? peca.comprimento : peca.largura;
        let alturaPeca = peca.sentido === 'trama' ? peca.largura : peca.comprimento;

        larguraPeca *= 100;
        alturaPeca *= 100;

        // Verifica se cabe na linha atual
        if (xOffset + larguraPeca > larguraTecido * 100 + 20) {
            xOffset = 20; // Nova linha
            yOffset += alturaAtualLinha;
            alturaAtualLinha = 0;
        }

        // Posiciona a peça
        pecaDiv.style.width = `${larguraPeca}px`;
        pecaDiv.style.height = `${alturaPeca}px`;
        pecaDiv.style.left = `${xOffset}px`;
        pecaDiv.style.top = `${yOffset}px`;

        // Atualiza margens e altura do plano
        xOffset += larguraPeca;
        alturaAtualLinha = Math.max(alturaAtualLinha, alturaPeca);

        planoTecido.appendChild(pecaDiv);
    });

    // Ajusta altura do tecido conforme necessário
    planoTecido.style.height = `${Math.max(yOffset + alturaAtualLinha, alturaTecido * 100)}px`;

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
