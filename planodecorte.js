let listaPecas = [];
let larguraTecido = 0;

// Atualiza a largura da ourela do tecido
function atualizarPlano() {
    const larguraInput = document.getElementById("largura").value;
    if (larguraInput && larguraInput > 0) {
        larguraTecido = parseFloat(larguraInput);
        alert(`Largura do tecido ajustada para ${larguraTecido} metros.`);
    } else {
        alert("Por favor, insira uma largura válida para o tecido.");
    }
}

// Adiciona uma peça à lista
function adicionarPeca() {
    const nome = document.getElementById("nomePeca").value.trim();
    const comprimento = parseFloat(document.getElementById("comprimentoPeca").value);
    const largura = parseFloat(document.getElementById("larguraPeca").value);
    const sentido = document.getElementById("sentidoPeca").value;

    if (!nome || comprimento <= 0 || largura <= 0) {
        alert("Preencha corretamente todos os campos da peça.");
        return;
    }

    const peca = { nome, comprimento, largura, sentido };
    listaPecas.push(peca);
    atualizarTabela();
}

// Atualiza a tabela com a lista de peças
function atualizarTabela() {
    const tabela = document.getElementById("tabelaPecas").querySelector("tbody");
    tabela.innerHTML = ""; // Limpa a tabela antes de recriá-la

    listaPecas.forEach((peca, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${peca.nome}</td>
            <td>${peca.comprimento.toFixed(2)}</td>
            <td>${peca.largura.toFixed(2)}</td>
            <td>${peca.sentido}</td>
            <td><button onclick="removerPeca(${index})">Remover</button></td>
        `;
        tabela.appendChild(row);
    });
}

// Remove uma peça da lista
function removerPeca(index) {
    listaPecas.splice(index, 1);
    atualizarTabela();
}

// Calcula a metragem necessária
function calcularMetragem() {
    if (larguraTecido <= 0) {
        alert("Por favor, configure a largura da ourela do tecido antes de calcular.");
        return;
    }

    let totalComprimento = 0;

    listaPecas.forEach((peca) => {
        if (peca.sentido === "ourela") {
            // Peça posicionada no sentido da ourela
            if (peca.largura > larguraTecido) {
                alert(`A peça ${peca.nome} excede a largura do tecido no sentido ourela.`);
            } else {
                totalComprimento += peca.comprimento;
            }
        } else {
            // Peça posicionada no sentido da trama
            if (peca.comprimento > larguraTecido) {
                alert(`A peça ${peca.nome} excede a largura do tecido no sentido trama.`);
            } else {
                totalComprimento += peca.largura;
            }
        }
    });

    const resultado = document.getElementById("resultado");
    resultado.textContent = `Metragem necessária: ${totalComprimento.toFixed(2)} metros.`;
}

// Função para impressão (simula impressão)
function imprimirPlano() {
    if (listaPecas.length === 0) {
        alert("Adicione peças ao plano antes de imprimir.");
        return;
    }

    const planoCorte = listaPecas.map((peca, index) => 
        `${index + 1}. ${peca.nome}: ${peca.comprimento.toFixed(2)}m x ${peca.largura.toFixed(2)}m (${peca.sentido})`
    ).join("\n");

    alert(`Plano de Corte:\n\n${planoCorte}`);
}
function imprimirPlano() {
    if (listaPecas.length === 0) {
        alert("Adicione peças ao plano antes de imprimir.");
        return;
    }

    // Criação do conteúdo para impressão
    let conteudoImpressao = `
        <h1>Plano de Corte de Tecido</h1>
        <p>Largura do Tecido: ${larguraTecido.toFixed(2)} metros</p>
        <table border="1" style="width: 100%; border-collapse: collapse; text-align: left;">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Comprimento (m)</th>
                    <th>Largura (m)</th>
                    <th>Sentido do Fio</th>
                </tr>
            </thead>
            <tbody>
    `;

    listaPecas.forEach((peca) => {
        conteudoImpressao += `
            <tr>
                <td>${peca.nome}</td>
                <td>${peca.comprimento.toFixed(2)}</td>
                <td>${peca.largura.toFixed(2)}</td>
                <td>${peca.sentido}</td>
            </tr>
        `;
    });

    conteudoImpressao += `
            </tbody>
        </table>
        <p>Metragem Total Necessária: ${document.getElementById("resultado").textContent}</p>
    `;

    // Abrir janela para impressão
    const janelaImpressao = window.open("", "_blank");
    janelaImpressao.document.write(`
        <html>
            <head>
                <title>Plano de Corte</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    table { width: 100%; border: 1px solid black; border-collapse: collapse; }
                    th, td { border: 1px solid black; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                </style>
            </head>
            <body>
                ${conteudoImpressao}
            </body>
        </html>
    `);
    janelaImpressao.document.close();
    janelaImpressao.print();
}
