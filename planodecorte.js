let listaPecas = [];
let larguraTecido = 0;
let totalMetros = 0;

function atualizarPlano() {
    const larguraInput = document.getElementById("largura");
    larguraTecido = parseFloat(larguraInput.value);
    
    if (isNaN(larguraTecido) || larguraTecido <= 0) {
        alert("Por favor, insira uma largura válida para o tecido.");
        return;
    }

    // Atualizando a área de corte
    const tecidoDiv = document.getElementById("tecido");
    tecidoDiv.style.width = `${larguraTecido * 100}cm`; // Convertendo para cm
    tecidoDiv.style.height = `400px`;
    tecidoDiv.innerHTML = ''; // Limpando o plano de corte antes de adicionar novas peças
}

function adicionarPeca() {
    const nome = document.getElementById("nomePeca").value;
    const comprimento = parseFloat(document.getElementById("comprimentoPeca").value);
    const largura = parseFloat(document.getElementById("larguraPeca").value);
    const sentido = document.getElementById("sentidoPeca").value;

    if (!nome || isNaN(comprimento) || isNaN(largura) || comprimento <= 0 || largura <= 0) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    // Calculando a metragem
    let metrosNecessarios = comprimento * largura;

    // Atualizando a lista de peças
    listaPecas.push({ nome, comprimento, largura, sentido });
    
    // Exibindo na tabela
    const tabela = document.getElementById("tabelaPecas").getElementsByTagName('tbody')[0];
    const novaLinha = tabela.insertRow();
    novaLinha.innerHTML = `
        <td>${nome}</td>
        <td>${comprimento.toFixed(2)}</td>
        <td>${largura.toFixed(2)}</td>
        <td>${sentido}</td>
        <td><button onclick="removerPeca(this)">Remover</button></td>
    `;
    
    // Exibindo as peças no plano de corte
    exibirPecasNoPlano();

    // Calculando e mostrando a metragem total necessária
    totalMetros = listaPecas.reduce((acc, peca) => acc + (peca.comprimento * peca.largura), 0);
    document.getElementById("resultado").textContent = `Metragem Total Necessária: ${totalMetros.toFixed(2)} metros`;
}

function removerPeca(botao) {
    const linha = botao.closest("tr");
    const nomePeca = linha.cells[0].textContent;
    
    listaPecas = listaPecas.filter(peca => peca.nome !== nomePeca);
    linha.remove();
    
    // Atualizando o plano de corte e a metragem
    exibirPecasNoPlano();
    totalMetros = listaPecas.reduce((acc, peca) => acc + (peca.comprimento * peca.largura), 0);
    document.getElementById("resultado").textContent = `Metragem Total Necessária: ${totalMetros.toFixed(2)} metros`;
}

function exibirPecasNoPlano() {
    const tecidoDiv = document.getElementById("tecido");
    tecidoDiv.innerHTML = ''; // Limpando antes de adicionar as peças

    let posX = 0; // Posição horizontal no plano de corte
    let posY = 0; // Posição vertical no plano de corte

    listaPecas.forEach((peca, index) => {
        // Definir a posição e dimensões com base no sentido da peça
        let largura = peca.largura * 100; // Convertendo para centímetros
        let comprimento = peca.comprimento * 100;

        if (peca.sentido === "ourelha") {
            // No sentido da ourela, a largura vai para o comprimento da peça
            [largura, comprimento] = [comprimento, largura];
        }

        // Adicionar a peça ao plano de corte
        const pecaDiv = document.createElement("div");
        pecaDiv.classList.add("peca");
        pecaDiv.style.width = `${largura}px`;
        pecaDiv.style.height = `${comprimento}px`;
        pecaDiv.style.top = `${posY}px`;
        pecaDiv.style.left = `${posX}px`;
        pecaDiv.innerHTML = `<strong>${peca.nome}</strong><br>${peca.comprimento.toFixed(2)} x ${peca.largura.toFixed(2)}m`;

        tecidoDiv.appendChild(pecaDiv);

        // Atualiza a posição para a próxima peça
        if (posX + largura > larguraTecido * 100) {
            // Se a peça ultrapassar a largura, ir para a próxima linha
            posX = 0;
            posY += comprimento;
        } else {
            // Caso contrário, continuar na mesma linha
            posX += largura;
        }
    });
}

function imprimirPlano() {
    if (listaPecas.length === 0) {
        alert("Adicione peças ao plano antes de imprimir.");
        return;
    }

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
