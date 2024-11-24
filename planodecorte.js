// Seleção de elementos do DOM
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

    // Validação de entrada
    if (isNaN(largura) || isNaN(altura) || isNaN(quantidade) || largura <= 0 || altura <= 0 || quantidade <= 0) {
        alert('Por favor, insira valores válidos para largura, altura e quantidade.');
        return;
    }

    // Criação de um elemento de peça para exibir no plano de corte
    const peca = document.createElement('div');
    peca.className = 'peca';
    peca.innerHTML = `
        <p><strong>Peça Adicionada:</strong></p>
        <p>Largura: ${largura}m</p>
        <p>Altura: ${altura}m</p>
        <p>Quantidade: ${quantidade}</p>
    `;

    // Adicionar a peça ao plano de corte
    pecasDiv.appendChild(peca);

    // Limpar os campos após a adição
    larguraInput.value = '';
    alturaInput.value = '';
    quantidadeInput.value = '';
});

// Exemplo: Função para calcular total de tecido usado (opcional)
function calcularTotalTecido() {
    let totalTecido = 0;

    // Pegar todas as peças adicionadas
    const pecas = document.querySelectorAll('.peca');
    pecas.forEach(peca => {
        const largura = parseFloat(peca.querySelector('p:nth-child(2)').textContent.split(': ')[1].replace('m', ''));
        const altura = parseFloat(peca.querySelector('p:nth-child(3)').textContent.split(': ')[1].replace('m', ''));
        const quantidade = parseInt(peca.querySelector('p:nth-child(4)').textContent.split(': ')[1]);

        totalTecido += largura * altura * quantidade;
    });

    alert(`O total de tecido necessário é: ${totalTecido.toFixed(2)} metros quadrados.`);
}

// Exemplo de botão extra para calcular o total
const calcularBtn = document.createElement('button');
calcularBtn.textContent = 'Calcular Total de Tecido';
calcularBtn.className = 'botao';
calcularBtn.addEventListener('click', calcularTotalTecido);
document.body.appendChild(calcularBtn);
