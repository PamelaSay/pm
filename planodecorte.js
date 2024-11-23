// Lista para armazenar as peças adicionadas
let pecas = [];

// Adicionar peça
function adicionarPeca() {
    const nome = document.getElementById("nomePeca").value;
    const comprimento = parseFloat(document.getElementById("comprimentoPeca").value);
    const largura = parseFloat(document.getElementById("larguraPeca").value);
    const sentido = document.getElementById("sentidoPeca").value;

    if (!nome || isNaN(comprimento) || isNaN(largura)) {
        alert("Preencha todos os campos corretamente.");
        return;
    }

    pecas.push({ nome, comprimento, largura, sentido });
    atualizarTabela();
    limparCampos();
}

// Atualizar tabela de peças
function atualizarTabela() {
    const tabela = document.getElementById("tabelaPecas").querySelector("tbody");
    tabela.innerHTML = ""; // Limpar tabela
    pecas.forEach((peca, index) => {
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${peca.nome}</td>
            <td>${peca.comprimento}</td>
            <td>${peca.largura}</td>
            <td>${peca.sentido}</td>
            <td><button onclick="removerPeca(${index})">Remover</button></td>
        `;
        tabela.appendChild(linha);
    });
}

// Remover peça
function removerPeca(index) {
    pecas.splice(index, 1);
    atualizarTabela();
}

// Limpar campos de entrada
function limparCampos() {
    document.getElementById("nomePeca").value = "";
    document.getElementById("comprimentoPeca").value = "";
    document.getElementById("larguraPeca").value = "";
    document.getElementById("sentidoPeca").value = "ourelha";
}

// Calcular metragem total considerando o sentido
function calcularMetragem() {
    const ourela = parseFloat(document.getElementById("largura").value);
    if (isNaN(ourela) || ourela <= 0) {
        alert("Por favor, insira uma largura válida para a ourela do tecido.");
        return;
    }

    let comprimentoTotal = 0; // Comprimento total necessário
    let espacoDisponivel = ourela; // Largura disponível na camada atual

    pecas.forEach((peca) => {
        let larguraPeca, comprimentoPeca;

        // Ajusta dimensões com base no sentido
        if (peca.sentido === "ourelha") {
            larguraPeca = peca.largura;
            comprimentoPeca = peca.comprimento;
        } else if (peca.sentido === "trama") {
            larguraPeca = peca.comprimento;
            comprimentoPeca = peca.largura;
        } else {
            larguraPeca = Math.max(peca.largura, peca.comprimento);
            comprimentoPeca = larguraPeca;
        }

        // Verifica se a peça cabe na largura disponível
        if (larguraPeca <= espacoDisponivel) {
            espacoDisponivel -= larguraPeca; // Usa o espaço restante na largura
        } else {
            comprimentoTotal += comprimentoPeca; // Soma a altura da nova camada
            espacoDisponivel = ourela - larguraPeca; // Reinicia a largura disponível
        }
    });

    comprimentoTotal += pecas[pecas.length - 1]?.comprimento || 0; // Altura da última camada

    const resultado = document.getElementById("resultado");
    resultado.innerText = `Metragem total necessária: ${comprimentoTotal.toFixed(2)} metros.`;
}

// Imprimir plano de corte
function imprimirPlano() {
    window.print();
}
