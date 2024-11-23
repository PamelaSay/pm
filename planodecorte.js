let pecas = [];

function adicionarPeca(tipo) {
    let comprimento = parseFloat(document.getElementById(tipo + "Comprimento").value);
    let largura = parseFloat(document.getElementById(tipo + "Largura").value);
    if (isNaN(comprimento) || isNaN(largura)) {
        alert("Por favor, insira as medidas corretamente.");
        return;
    }

    let area = comprimento * largura;
    pecas.push({ tipo, comprimento, largura, area });
    exibirPlanoCorte();
}

function removerPeca(tipo) {
    pecas = pecas.filter(peca => peca.tipo !== tipo);
    exibirPlanoCorte();
}

function exibirPlanoCorte() {
    const planoCorte = document.getElementById('planoCorte');
    planoCorte.innerHTML = '';
    pecas.forEach(peca => {
        let divPeca = document.createElement('div');
        divPeca.classList.add('peca');
        divPeca.style.width = peca.largura * 100 + 'px'; // Multiplicando para exibir proporcionalmente
        divPeca.style.height = peca.comprimento * 100 + 'px';
        divPeca.innerHTML = `${peca.tipo}<br>${peca.comprimento}m x ${peca.largura}m`;
        planoCorte.appendChild(divPeca);
    });
}

function calcularMetragem() {
    let larguraTecido = parseFloat(document.getElementById('largura').value);
    if (isNaN(larguraTecido)) {
        alert("Por favor, insira a largura do tecido.");
        return;
    }

    let areaTotal = pecas.reduce((total, peca) => total + peca.area, 0);
    let metragemNecessaria = areaTotal / larguraTecido;
    document.getElementById('resultado').innerHTML = `Você precisará de aproximadamente ${metragemNecessaria.toFixed(2)} metros de tecido.`;
}

function imprimirPlano() {
    window.print();
}
