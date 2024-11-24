// Configuração inicial
let listaPecas = [];
let larguraOurela = 140; // Tamanho padrão da ourela (em centímetros)

// Adicionar peça à lista
function adicionarPeca() {
    const nome = document.getElementById('nomePeca').value;
    const comprimento = parseFloat(document.getElementById('comprimentoPeca').value);
    const largura = parseFloat(document.getElementById('larguraPeca').value);
    const quantidade = parseInt(document.getElementById('quantidadePeca').value);
    const sentido = document.getElementById('sentidoPeca').value;

    if (!nome || !comprimento || !largura || !quantidade || !sentido) {
        alert("Preencha todos os campos!");
        return;
    }

    listaPecas.push({ nome, comprimento, largura, quantidade, sentido });
    atualizarListaPecas();
    desenharPlanoDeCorte();
}

// Atualizar lista de peças
function atualizarListaPecas() {
    const tabela = document.getElementById('tabelaPecas');
    tabela.innerHTML = '';

    listaPecas.forEach((peca, index) => {
        const linha = document.createElement('tr');

        linha.innerHTML = `
            <td>${peca.nome}</td>
            <td>${peca.comprimento} cm</td>
            <td>${peca.largura} cm</td>
            <td>${peca.quantidade}</td>
            <td>${peca.sentido}</td>
            <td><button onclick="removerPeca(${index})">Remover</button></td>
        `;
        tabela.appendChild(linha);
    });
}

// Remover peça da lista
function removerPeca(index) {
    listaPecas.splice(index, 1);
    atualizarListaPecas();
    desenharPlanoDeCorte();
}

// Desenhar plano de corte
function desenharPlanoDeCorte() {
    const planoCorte = document.getElementById('planoCorte');
    planoCorte.innerHTML = '';
    planoCorte.style.width = `${larguraOurela}px`; // Define a largura como a ourela
    let alturaNecessaria = 0;

    listaPecas.forEach((peca) => {
        for (let i = 0; i < peca.quantidade; i++) {
            const divPeca = document.createElement('div');
            divPeca.className = 'peca';
            divPeca.style.width = `${peca.largura}px`;
            divPeca.style.height = `${peca.comprimento}px`;
            divPeca.style.top = `${alturaNecessaria}px`;
            divPeca.style.left = `0px`; // Ajustar posicionamento conforme necessário

            planoCorte.appendChild(divPeca);

            alturaNecessaria += peca.comprimento; // Incrementa a altura necessária
        }
    });

    planoCorte.style.height = `${alturaNecessaria}px`; // Define a altura do plano
}

// Inicialização
document.getElementById('botaoAdicionar').addEventListener('click', adicionarPeca);
