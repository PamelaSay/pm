let larguraTecido = 0;
let alturaTecido = 0;
const pecas = [];

function atualizarPlano() {
    // Pega os valores de largura e altura inseridos
    larguraTecido = parseFloat(document.getElementById('largura').value);
    alturaTecido = parseFloat(document.getElementById('altura').value);

    // Verifica se os valores são válidos
    if (isNaN(larguraTecido) || larguraTecido <= 0 || isNaN(alturaTecido) || alturaTecido <= 0) {
        alert("Por favor, insira uma largura e altura válidas para o tecido.");
        return;
    }

    // Calcula a largura do tecido com base nas peças
    const dimensoes = calcularDimensoesTecido();
    larguraTecido = dimensoes.largura;

    // Atualiza a exibição do plano de corte (com a altura fixada no valor inserido)
    const tecidoDiv = document.getElementById("tecido");
    tecidoDiv.style.width = larguraTecido * 100 + "px";  // Largura do tecido
    tecidoDiv.style.height = alturaTecido * 100 + "px"; // Altura do tecido (valor inserido)
}

function adicionarPeca() {
    const nomePeca = document.getElementById('nomePeca').value;
    const comprimentoPeca = parseFloat(document.getElementById('comprimentoPeca').value);
    const larguraPeca = parseFloat(document.getElementById('larguraPeca').value);
    const sentidoPeca = document.getElementById('sentidoPeca').value;
    const quantidadePeca = parseInt(document.getElementById('quantidadePeca').value);

    if (isNaN(comprimentoPeca) || comprimentoPeca <= 0 || isNaN(larguraPeca) || larguraPeca <= 0 || !nomePeca) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    // Adiciona as peças à lista
    pecas.push({ nome: nomePeca, comprimento: comprimentoPeca, largura: larguraPeca, sentido: sentidoPeca, quantidade: quantidadePeca });
    atualizarTabela();
    atualizarPlanoDeCorte();
    atualizarPlano(); // Atualiza o plano de corte com a nova altura e largura
}

function calcularDimensoesTecido() {
    let larguraTotal = 0;

    // Calcula a largura total com base nas peças
    pecas.forEach(peca => {
        if (peca.sentido === "horizontal") {
            larguraTotal += peca.largura * peca.quantidade;
        } else {
            larguraTotal = Math.max(larguraTotal, peca.largura); // A largura é a maior largura de peça
        }
    });

    return { largura: larguraTotal };
}

function atualizarTabela() {
    const tabela = document.getElementById('tabelaPecas').getElementsByTagName('tbody')[0];
    tabela.innerHTML = ''; // Limpa a tabela antes de atualizar

    pecas.forEach((peca, index) => {
        const linha = tabela.insertRow();
        linha.innerHTML = `
            <td>${peca.nome}</td>
            <td>${peca.comprimento}m</td>
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
    atualizarPlano(); // Recalcula a altura e a largura após a remoção
}

function atualizarPlanoDeCorte() {
    const tecidoDiv = document.getElementById("tecido");
    tecidoDiv.innerHTML = ''; // Limpa as peças no plano de corte

    // Adiciona as peças no plano de corte de acordo com as posições calculadas
    pecas.forEach(peca => {
        for (let i = 0; i < peca.quantidade; i++) {
            const pecaDiv = document.createElement('div');
            pecaDiv.classList.add('peca');
            pecaDiv.style.width = peca.sentido === "horizontal" ? peca.largura * 100 + "px" : peca.comprimento * 100 + "px";
            pecaDiv.style.height = peca.sentido === "horizontal" ? peca.comprimento * 100 + "px" : peca.largura * 100 + "px";

            // Calcula a posição das peças no plano de corte
            pecaDiv.style.top = (peca.sentido === "horizontal" ? 0 : i * peca.comprimento * 100) + "px";
            pecaDiv.style.left = (peca.sentido === "horizontal" ? i * peca.largura * 100 : 0) + "px";

            pecaDiv.innerText = peca.nome;
            tecidoDiv.appendChild(pecaDiv);
        }
    });
}

function imprimirPlano() {
    window.print();
}
