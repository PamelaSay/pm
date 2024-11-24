let larguraTecido = 0;
const alturaTecido = 1.00; // Altura fixo
let pecas = [];

function atualizarPlano() {
    larguraTecido = parseFloat(document.getElementById('largura').value);
    if (isNaN(larguraTecido) || larguraTecido <= 0) {
        alert("Por favor, insira uma largura válida para o tecido.");
        return;
    }

    // Atualiza a exibição do plano de corte
    document.getElementById("tecido").style.width = larguraTecido * 100 + "px";  // Largura do tecido
    document.getElementById("tecido").style.height = alturaTecido * 100 + "px"; // Altura fixa
}

function adicionarPeca() {
    const nomePeca = document.getElementById('nomePeca').value;
    const alturaPeca = parseFloat(document.getElementById('alturaPeca').value);
    const larguraPeca = parseFloat(document.getElementById('larguraPeca').value);
    const sentidoPeca = document.getElementById('sentidoPeca').value;
    const quantidadePeca = parseInt(document.getElementById('quantidadePeca').value);

    if (isNaN(alturaPeca) || alturaPeca <= 0 || isNaN(larguraPeca) || larguraPeca <= 0 || !nomePeca) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    // Adiciona as peças à lista
    pecas.push({ nome: nomePeca, altura: alturaPeca, largura: larguraPeca, sentido: sentidoPeca, quantidade: quantidadePeca });
    atualizarTabela();
    atualizarPlanoDeCorte();
}

function atualizarTabela() {
    const tabela = document.getElementById('tabelaPecas').getElementsByTagName('tbody')[0];
    tabela.innerHTML = ''; // Limpa a tabela antes de atualizar

    pecas.forEach((peca, index) => {
        const linha = tabela.insertRow();
        linha.innerHTML = `
            <td>${peca.nome}</td>
            <td>${peca.altura}m</td>
            <td>${peca.largura}m</td>
            <td>${peca.sentido}</td>
            <td>${peca.quantidade}</td>
            <td><button onclick="removerPeca(${index})">Remover</button></td>
        `;
    });
}

function removerPeca(index) {
    pecas.splice(index, 1); // Remove a peça do array
    atualizarTabela();
    atualizarPlanoDeCorte();
}

function atualizarPlanoDeCorte() {
    const tecidoDiv = document.getElementById("tecido");
    tecidoDiv.innerHTML = ''; // Limpa o plano de corte antes de atualizar

    pecas.forEach(peca => {
        for (let i = 0; i < peca.quantidade; i++) {
            const pecaDiv = document.createElement('div');
            pecaDiv.classList.add('peca');
            pecaDiv.style.width = peca.largura * 100 + 'px'; // Largura da peça
            pecaDiv.style.height = peca.altura * 100 + 'px'; // Altura da peça
            tecidoDiv.appendChild(pecaDiv);
        }
    });
}

function calcularMetragem() {
    let metragemTotal = 0;
    pecas.forEach(peca => {
        metragemTotal += peca.altura * peca.largura * peca.quantidade;
    });

    document.getElementById('resultado').textContent = `Metragem total necessária: ${metragemTotal.toFixed(2)} metros quadrados.`;
}

function imprimirPlano() {
    window.print();
}
