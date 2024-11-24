let larguraTecido = 0;
const comprimentoTecido = 1.00; // Comprimento fixo
let pecas = [];

// Atualiza o plano de corte com base na largura do tecido
function atualizarPlano() {
    larguraTecido = parseFloat(document.getElementById('largura').value);
    if (isNaN(larguraTecido) || larguraTecido <= 0) {
        alert("Por favor, insira uma largura válida para o tecido.");
        return;
    }

    // Atualiza o estilo do plano de corte
    const tecidoDiv = document.getElementById("tecido");
    tecidoDiv.style.width = larguraTecido * 100 + "px"; // Largura proporcional
    tecidoDiv.style.height = comprimentoTecido * 100 + "px"; // Comprimento fixo
}

// Adiciona uma peça ao plano de corte
function adicionarPeca() {
    const nomePeca = document.getElementById('nomePeca').value.trim();
    const comprimentoPeca = parseFloat(document.getElementById('comprimentoPeca').value);
    const larguraPeca = parseFloat(document.getElementById('larguraPeca').value);
    const sentidoPeca = document.getElementById('sentidoPeca').value;
    const quantidadePeca = parseInt(document.getElementById('quantidadePeca').value);

    if (!nomePeca || isNaN(comprimentoPeca) || comprimentoPeca <= 0 || 
        isNaN(larguraPeca) || larguraPeca <= 0 || isNaN(quantidadePeca) || quantidadePeca <= 0) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    // Adiciona a peça à lista
    pecas.push({ nome: nomePeca, comprimento: comprimentoPeca, largura: larguraPeca, sentido: sentidoPeca, quantidade: quantidadePeca });
    atualizarTabela();
    atualizarPlanoDeCorte();
}

// Atualiza a tabela de peças
function atualizarTabela() {
    const tabela = document.getElementById('tabelaPecas').getElementsByTagName('tbody')[0];
    tabela.innerHTML = ''; // Limpa a tabela antes de atualizar

    pecas.forEach((peca, index) => {
        const linha = tabela.insertRow();
        linha.innerHTML = `
            <td>${peca.nome}</td>
            <td>${peca.comprimento.toFixed(2)}m</td>
            <td>${peca.largura.toFixed(2)}m</td>
            <td>${peca.sentido}</td>
            <td>${peca.quantidade}</td>
            <td><button onclick="removerPeca(${index})">Remover</button></td>
        `;
    });
}

// Remove uma peça da lista
function removerPeca(index) {
    pecas.splice(index, 1); // Remove a peça pelo índice
    atualizarTabela();
    atualizarPlanoDeCorte();
}

// Atualiza o plano de corte com as peças adicionadas
function atualizarPlanoDeCorte() {
    const tecidoDiv = document.getElementById("tecido");
    tecidoDiv.innerHTML = ''; // Limpa o plano de corte antes de atualizar

    pecas.forEach(peca => {
        for (let i = 0; i < peca.quantidade; i++) {
            const pecaDiv = document.createElement('div');
            pecaDiv.classList.add('peca');
            pecaDiv.style.width = peca.largura * 100 + 'px'; // Largura proporcional
            pecaDiv.style.height = peca.comprimento * 100 + 'px'; // Comprimento proporcional
            pecaDiv.style.border = "1px solid #000"; // Adiciona borda para visualização
            pecaDiv.style.margin = "2px"; // Espaço entre peças
            tecidoDiv.appendChild(pecaDiv);
        }
    });
}

// Calcula a metragem total necessária
function calcularMetragem() {
    let metragemTotal = 0;
    pecas.forEach(peca => {
        metragemTotal += peca.comprimento * peca.largura * peca.quantidade;
    });

    document.getElementById('resultado').textContent = `Metragem total necessária: ${metragemTotal.toFixed(2)} metros quadrados.`;
}

// Imprime o plano de corte
function imprimirPlano() {
    window.print();
}

