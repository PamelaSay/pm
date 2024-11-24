let larguraTecido = 0;
let alturaTecido = 0;
const pecas = [];

function atualizarPlano() {
    larguraTecido = parseFloat(document.getElementById('largura').value);
    if (isNaN(larguraTecido) || larguraTecido <= 0) {
        alert("Por favor, insira uma largura válida para o tecido.");
        return;
    }

    // Calcula a largura e altura do tecido com base nas peças adicionadas
    const dimensoes = calcularDimensoesTecido();
    larguraTecido = dimensoes.largura;
    alturaTecido = dimensoes.altura;

    // Atualiza a exibição do plano de corte
    const tecidoDiv = document.getElementById("tecido");
    tecidoDiv.style.width = larguraTecido * 100 + "px";  // Largura do tecido
    tecidoDiv.style.height = alturaTecido * 100 + "px"; // Altura do tecido
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
    let alturaTotal = 0;

    pecas.forEach(peca => {
        if (peca.sentido === "horizontal") {
            larguraTotal += peca.largura * peca.quantidade;
            alturaTotal = Math.max(alturaTotal, peca.comprimento); // A altura é a maior altura de peça
        } else {
            larguraTotal = Math.max(larguraTotal, peca.largura); // A largura é a maior largura de peça
            alturaTotal += peca.comprimento * peca.quantidade;
        }
    });

    return { largura: larguraTotal, altura: alturaTotal };
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
