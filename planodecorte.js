let larguraTecido = 0;
const alturaTecidoPadrao = 5.00; // Comprimento inicial do tecido em metros
let pecas = [];

function atualizarPlano() {
    larguraTecido = parseFloat(document.getElementById('largura').value);
    if (isNaN(larguraTecido) || larguraTecido <= 0) {
        alert("Por favor, insira uma largura válida para o tecido.");
        return;
    }

    const tecido = document.getElementById("tecido");
    tecido.style.width = larguraTecido * 100 + "px"; // Largura (horizontal - trama)
    tecido.style.height = alturaTecidoPadrao * 100 + "px"; // Altura (vertical - ourela)

    // Adiciona orientação ao plano de corte
    tecido.innerHTML = `
        <div class="orientacao-horizontal">TRAMA</div>
        <div class="orientacao-vertical">OURELA</div>
    `;
}

function adicionarPeca() {
    const nomePeca = document.getElementById('nomePeca').value;
    const alturaPeca = parseFloat(document.getElementById('alturaPeca').value);
    const larguraPeca = parseFloat(document.getElementById('larguraPeca').value);
    const sentidoPeca = document.getElementById('sentidoPeca').value;
    const quantidadePeca = parseInt(document.getElementById('quantidadePeca').value);

    if (
        isNaN(alturaPeca) ||
        alturaPeca <= 0 ||
        isNaN(larguraPeca) ||
        larguraPeca <= 0 ||
        !nomePeca
    ) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    // Ajusta dimensões com base no sentido do fio
    let alturaAjustada = alturaPeca;
    let larguraAjustada = larguraPeca;

    if (sentidoPeca === "trama") {
        alturaAjustada = larguraPeca;
        larguraAjustada = alturaPeca;
    } else if (sentidoPeca === "enviesado") {
        alturaAjustada = Math.sqrt(alturaPeca ** 2 + larguraPeca ** 2);
        larguraAjustada = alturaAjustada;
    }

    pecas.push({
        nome: nomePeca,
        altura: alturaAjustada,
        largura: larguraAjustada,
        sentido: sentidoPeca,
        quantidade: quantidadePeca,
    });

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
            <td>${peca.altura.toFixed(2)} m</td>
            <td>${peca.largura.toFixed(2)} m</td>
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
    tecidoDiv.innerHTML = `
        <div class="orientacao-horizontal">TRAMA</div>
        <div class="orientacao-vertical">OURELA</div>
    `; // Limpa o plano de corte com as orientações

    let posX = 0; // Posição inicial no eixo X
    let posY = 0; // Posição inicial no eixo Y
    let alturaAtual = alturaTecidoPadrao; // Comprimento necessário do tecido

    pecas.forEach(peca => {
        for (let i = 0; i < peca.quantidade; i++) {
            if (posX + peca.largura * 100 > larguraTecido * 100) {
                // Muda para a próxima linha se não couber na largura
                posX = 0;
                posY += peca.altura * 100;
            }

            if (posY + peca.altura * 100 > alturaAtual * 100) {
                // Aumenta o comprimento do tecido se necessário
                alturaAtual += 1.00;
                tecidoDiv.style.height = alturaAtual * 100 + "px";
            }

            const pecaDiv = document.createElement('div');
            pecaDiv.classList.add('peca');
            pecaDiv.style.width = peca.largura * 100 + "px";
            pecaDiv.style.height = peca.altura * 100 + "px";
            pecaDiv.style.left = posX + "px";
            pecaDiv.style.top = posY + "px";
            pecaDiv.textContent = peca.nome;

            tecidoDiv.appendChild(pecaDiv);

            posX += peca.largura * 100; // Avança na posição X
        }
    });
}

function calcularMetragem() {
    let totalArea = 0;
    pecas.forEach(peca => {
        totalArea += peca.altura * peca.largura * peca.quantidade;
    });

    const alturaNecessaria = Math.ceil(totalArea / larguraTecido);
    document.getElementById('resultado').textContent = `
        A metragem total necessária é de aproximadamente ${alturaNecessaria.toFixed(2)} metros.
    `;
}

function imprimirPlano() {
    window.print();
}
