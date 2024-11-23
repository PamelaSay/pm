let pecas = [];
let larguraTecido;
let planoTecido = document.getElementById('tecido');

function adicionarPeca() {
    let nome = document.getElementById('nomePeca').value;
    let comprimento = parseFloat(document.getElementById('comprimentoPeca').value);
    let largura = parseFloat(document.getElementById('larguraPeca').value);

    if (nome === '' || isNaN(comprimento) || isNaN(largura)) {
        alert("Por favor, insira todos os dados corretamente.");
        return;
    }

    // Adicionar a peça ao array de peças
    pecas.push({ nome, comprimento, largura });
    atualizarPlano();
    limparCampos();
}

function atualizarPlano() {
    larguraTecido = parseFloat(document.getElementById('largura').value);
    if (isNaN(larguraTecido)) {
        alert("Por favor, insira a largura do tecido.");
        return;
    }

    planoTecido.innerHTML = ''; // Limpar o conteúdo anterior

    let xOffset = 0;
    let yOffset = 0;

    pecas.forEach((peca) => {
        let pecaDiv = document.createElement('div');
        pecaDiv.classList.add('peca');
        pecaDiv.style.width = peca.largura * 100 + 'px'; // A largura é multiplicada por 100 para visualização
        pecaDiv.style.height = peca.comprimento * 100 + 'px'; // O mesmo para o comprimento
        pecaDiv.innerHTML = `${peca.nome}<br>${peca.comprimento}m x ${peca.largura}m`;

        // Ajustar a posição das peças
        if (xOffset + peca.largura <= larguraTecido) {
     
