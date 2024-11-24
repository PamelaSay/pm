// Variáveis globais
let planoCorte = []; // Para armazenar as peças
let larguraTecido = 1.40; // Largura do tecido (Ourela)
let comprimentoTecido = 1.00; // Comprimento do tecido (Trama)
let totalMetragem = 0; // Total de metragem necessária

// Função para atualizar o plano com as dimensões do tecido
function atualizarPlano() {
    // Obtém os valores de largura e comprimento do tecido
    larguraTecido = parseFloat(document.getElementById('largura').value);
    comprimentoTecido = parseFloat(document.getElementById('comprimento').value);

    totalMetragem = 0; // Reseta o total de metragem

    // Limpa o plano de corte
    document.getElementById('tecido').innerHTML = '';

    // Recalcula e redesenha o plano de corte
    recalcularMetragem();
    desenharPlanoDeCorte();
}

// Função para recalcular a metragem total necessária
function recalcularMetragem() {
    totalMetragem = 0;
    planoCorte.forEach(peca => {
        totalMetragem += peca.comprimento * peca.largura * peca.quantidade;
    });

    // Atualiza o valor no resultado
    document.getElementById('resultado').textContent = `Metragem Total Necessária: ${totalMetragem.toFixed(2)} metros`;
}

// Função para desenhar o plano de corte
function desenharPlanoDeCorte() {
    const tecidoElement = document.getElementById('tecido');

    // Representa o tecido (1.40m de largura e 1.00m de comprimento)
    tecidoElement.style.width = `${larguraTecido * 100}vw`; // Largura do tecido
    tecidoElement.style.height = `${comprimentoTecido * 100}vh`; // Comprimento do tecido

    // Desenha as peças dentro do plano
    planoCorte.forEach(peca => {
        for (let i = 0; i < peca.quantidade; i++) {
            const pecaElement = document.createElement('div');
            pecaElement.classList.add('peca');

            // Calcula a largura e comprimento com base no sentido escolhido
            const largura = peca.sentido === 'ourela' ? peca.largura : peca.comprimento;
            const comprimento = peca.sentido === 'ourela' ? peca.comprimento : peca.largura;

            pecaElement.style.width = `${largura * 100}vw`;
            pecaElement.style.height = `${comprimento * 100}vh`;

            // Posição das peças no plano de corte
            const posicaoX = (i * largura) % larguraTecido;
            const posicaoY = Math.floor(i * largura * comprimento / larguraTecido);

            pecaElement.style.left = `${posicaoX * 100}vw`;
            pecaElement.style.top = `${posicaoY * 100}vh`;

            tecidoElement.appendChild(pecaElement);
        }
    });
}

// Função para adicionar uma peça
function adicionarPeca() {
    const nome = document.getElementById('nomePeca').value;
    const comprimento = parseFloat(document.getElementById('comprimentoPeca').value);
    const largura = parseFloat(document.getElementById('larguraPeca').value);
    const quantidade = parseInt(document.getElementById('quantidadePeca').value);
    const sentido = document.getElementById('sentidoPeca').value;

    // Adiciona a peça ao plano
    planoCorte.push({
        nome,
        comprimento,
        largura,
        quantidade,
        sentido
    });

    // Atualiza a tabela de peças
    atualizarTabela();

    // Atualiza o plano de corte
    atualizarPlano();
}

// Função para atualizar a tabela de peças
function atualizarTabela() {
    const tabelaPecas = document.getElementById('tabelaPecas').getElementsByTagName('tbody')[0];
    tabelaPecas.innerHTML = '';

    planoCorte.forEach((peca, index) => {
        const row = tabelaPecas.insertRow();

        row.insertCell(0).textContent = peca.nome;
        row.insertCell(1).textContent = peca.comprimento;
        row.insertCell(2).textContent = peca.largura;
        row.insertCell(3).textContent = peca.quantidade;
        row.insertCell(4).textContent = peca.sentido;
        const deleteCell = row.insertCell(5);
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir';
        deleteButton.onclick = () => excluirPeca(index);
        deleteCell.appendChild(deleteButton);
    });
}

// Função para excluir uma peça
function excluirPeca(index) {
    planoCorte.splice(index, 1);
    atualizarTabela();
    atualizarPlano();
}

// Função para imprimir o plano de corte
function imprimirPlano() {
    const conteúdo = document.getElementById('planoDeCorte').innerHTML;
    const janelaImpressao = window.open('', '', 'width=800, height=600');
    janelaImpressao.document.write('<html><body>');
    janelaImpressao.document.write(conteúdo);
    janelaImpressao.document.write('</body></html>');
    janelaImpressao.document.close();
    janelaImpressao.print();
}
