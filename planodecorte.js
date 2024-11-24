let larguraTecido = 0;
const comprimentoTecido = 1.00; // Comprimento fixo
let pecas = [];

function atualizarPlano() {
    larguraTecido = parseFloat(document.getElementById('largura').value);
    if (isNaN(larguraTecido) || larguraTecido <= 0) {
        alert("Por favor, insira uma largura válida para o tecido.");
        return;
    }

    // Atualiza a exibição do plano de corte
    document.getElementById("tecido").style.width = larguraTecido * 100 + "px";  // Largura do tecido
    document.getElementById("tecido").style.height = comprimentoTecido * 100 + "px"; // Comprimento fixo
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
}

function atualizarTabela() {
    const tabela = document.getElementById('tabelaPecas').getElementsByTagName('tbody')[0];
    tabela.innerHTML = ''; // Limpa a tabela
    pecas.forEach((peca, index) => {
        const row = tabela.insertRow();
        row.innerHTML = `
            <td>${peca.nome}</td>
            <td>${peca.comprimento} m</td>
            <td>${peca.largura} m</td>
            <td>${peca.sentido}</td>
            <td>${peca.quantidade}</td>
            <td><button onclick="removerPeca(${index})">Remover</button></td>
        `;
    });
}

function removerPeca(index) {
    pecas.splice(index, 1);
    atualizarTabela();
    atualizarPlanoDeCorte();
}

function atualizarPlanoDeCorte() {
    const tecidoDiv = document.getElementById('tecido');
    tecidoDiv.innerHTML = ''; // Limpa o plano de corte

    pecas.forEach(peca => {
        for (let i = 0; i < peca.quantidade; i++) {
            const pecaDiv = document.createElement('div');
            pecaDiv.classList.add('peca');
            pecaDiv.style.width = peca.largura * 100 + "px";
            pecaDiv.style.height = peca.comprimento * 100 + "px";
            pecaDiv.textContent = peca.nome;

            // Posicionamento das peças no plano de corte
            let left = (i % 5) * (peca.largura * 100 + 10); // Exemplo de distribuição
            let top = Math.floor(i / 5) * (peca.comprimento * 100 + 10);
            pecaDiv.style.left = left + "px";
            pecaDiv.style.top = top + "px";

            tecidoDiv.appendChild(pecaDiv);
        }
    });
}

function calcularMetragem() {
    let totalArea = 0;
    pecas.forEach(peca => {
        totalArea += peca.comprimento * peca.largura * peca.quantidade;
    });
    document.getElementById('resultado').textContent = `A metragem total necessária é ${totalArea.toFixed(2)} m²`;
}

function imprimirPlano() {
    window.print();
}
