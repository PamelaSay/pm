// Variáveis globais
let planoCorte = []; // Para armazenar as peças adicionadas
let larguraTecido = 1.40; // Largura do tecido (Ourela)
let comprimentoTecido = 1.00; // Comprimento do tecido (Trama)
let totalMetragem = 0; // Total de metragem necessária

// Função para atualizar o plano de corte com as dimensões do tecido
function atualizarPlano() {
    larguraTecido = parseFloat(document.getElementById('largura').value);
    comprimentoTecido = parseFloat(document.getElementById('comprimento').value);
    totalMetragem = 0; // Resetar o total de metragem
    
    // Limpa o plano de corte
    document.getElementById('tecido').innerHTML = '';
    
    // Recalcular o total de metragem
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
            
            // Largura e comprimento das peças
            const largura = peca.sentido === 'ourela' ? peca.largura : peca.comprimento;
            const comprimento = peca.sentido === 'ourela' ? peca.comprimento : peca.largura;

            pecaElement.style.width = `${largura * 100}vw`;
            pecaElement.style.height = `${comprimento * 100}vh`;

            // Posição das peças no plano de corte
            // Tentamos dispor as peças da forma mais otimizada possível
            const posicaoX = (i * largura) % larguraTecido;
            const posicaoY = Math.floor(i * largura * comprimento / larguraTecido);

            pecaElement.style.left = `${posicaoX * 100}vw`;
            pecaElement.style.top = `${posicaoY * 100}vh`;

            tecidoElement.appendChild(pecaElement);
        }
    });
}

// Função para adicionar uma nova peça
function adicionarPeca() {
    const nome = document.getElementById('nomePeca').value;
    const comprimento = parseFloat(document.getElementById('comprimentoPeca').value);
    const largura = parseFloat(document.getElementById('larguraPeca').value);
    const quantidade = parseInt(document.getElementById('quantidadePeca').value);
    const sentido = document.getElementById('sentidoPeca').value;

    // Validação de dados
    if (isNaN(comprimento) || isNaN(largura) || isNaN(quantidade) || nome.trim() === '') {
        alert('Por favor, preencha todos os campos corretamente!');
        return;
    }

    // Adiciona a peça ao plano de corte
    const peca = {
        nome: nome,
        comprimento: comprimento,
        largura: largura,
        quantidade: quantidade,
        sentido: sentido,
    };
    
    planoCorte.push(peca);

    // Adiciona a peça à tabela
    const tabelaPecas = document.getElementById('tabelaPecas').getElementsByTagName('tbody')[0];
    const row = tabelaPecas.insertRow();
    row.innerHTML = `
        <td>${nome}</td>
        <td>${comprimento}</td>
        <td>${largura}</td>
        <td>${quantidade}</td>
        <td>${sentido}</td>
        <td><button onclick="removerPeca(this)">Remover</button></td>
    `;

    // Recalcula a metragem total e atualiza o plano
    recalcularMetragem();
    desenharPlanoDeCorte();
}

// Função para remover uma peça
function removerPeca(button) {
    const row = button.parentNode.parentNode;
    const nomePeca = row.cells[0].textContent;

    // Remove a peça do plano de corte
    planoCorte = planoCorte.filter(peca => peca.nome !== nomePeca);
    
    // Remove a linha da tabela
    row.remove();

    // Recalcula a metragem total e atualiza o plano
    recalcularMetragem();
    desenharPlanoDeCorte();
}

// Função para imprimir o plano de corte
function imprimirPlano() {
    const divParaImprimir = document.querySelector('.container');
    const janelaImpressao = window.open('', '', 'height=800,width=800');
    janelaImpressao.document.write('<html><head><title>Plano de Corte</title>');
    janelaImpressao.document.write('<style>body { font-family: Arial, sans-serif; }</style></head><body>');
    janelaImpressao.document.write(divParaImprimir.innerHTML);
    janelaImpressao.document.write('</body></html>');
    janelaImpressao.document.close();
    janelaImpressao.print();
}

// Inicializa o plano de corte com as dimensões padrão
atualizarPlano();
