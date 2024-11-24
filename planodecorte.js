// Seleção dos elementos do formulário e lista de peças
const larguraInput = document.getElementById('largura');
const alturaInput = document.getElementById('altura');
const quantidadeInput = document.getElementById('quantidade');
const adicionarBtn = document.getElementById('adicionar');
const pecasDiv = document.getElementById('pecas');

// Função para adicionar peças ao plano de corte
adicionarBtn.addEventListener('click', () => {
    const largura = parseFloat(larguraInput.value);
    const altura = parseFloat(alturaInput.value);
    const quantidade = parseInt(quantidadeInput.value);

    // Validação dos valores inseridos
    if (isNaN(largura) || isNaN(altura) || isNaN(quantidade) || largura <= 0 || altura <= 0 || quantidade <= 0) {
        alert('Por favor, insira valores válidos para largura, altura e quantidade.');
        return;
    }

    // Criando o elemento da peça e adicionando ao plano de corte
    const peca = document.createElement('div');
    peca.className = 'peca';
    peca.innerHTML = `
        <p>Largura: ${largura.toFixed(2)} m</p>
        <p>Altura: ${altura.toFixed(2)} m</p>
        <p>Quantidade: ${quantidade}</p>
    `;

    pecasDiv.appendChild(peca);

    // Limpando os campos após adicionar a peça
    larguraInput.value = '';
    alturaInput.value = '';
    quantidadeInput.value = '';
});
