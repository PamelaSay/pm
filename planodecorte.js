function calcularMetragem() {
    const ourela = parseFloat(document.getElementById("largura").value);
    if (isNaN(ourela) || ourela <= 0) {
        alert("Por favor, insira uma largura válida para a ourela do tecido.");
        return;
    }

    let comprimentoTotal = 0; // Comprimento total necessário
    let espacoDisponivel = ourela; // Largura disponível na camada atual

    pecas.forEach((peca) => {
        let larguraPeca, comprimentoPeca;

        // Ajusta dimensões com base no sentido
        if (peca.sentido === "ourelha") {
            larguraPeca = peca.largura;
            comprimentoPeca = peca.comprimento;
        } else if (peca.sentido === "trama") {
            larguraPeca = peca.comprimento;
            comprimentoPeca = peca.largura;
        } else {
            // Sentido enviesado (simplificação: considera ambas dimensões)
            larguraPeca = Math.max(peca.largura, peca.comprimento);
            comprimentoPeca = Math.max(peca.largura, peca.comprimento);
        }

        // Verifica se a peça cabe na largura disponível
        if (larguraPeca <= espacoDisponivel) {
            espacoDisponivel -= larguraPeca; // Usa o espaço restante na largura
        } else {
            // Começa uma nova camada (soma o comprimento da peça e reinicia a largura)
            comprimentoTotal += comprimentoPeca;
            espacoDisponivel = ourela - larguraPeca;
        }
    });

    // Adiciona a altura da última camada
    comprimentoTotal += pecas[pecas.length - 1].comprimento;

    const resultado = document.getElementById("resultado");
    resultado.innerText = `Metragem total necessária: ${comprimentoTotal.toFixed(2)} metros.`;
}
