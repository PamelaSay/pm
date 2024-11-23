let pecas = [];

function adicionarPeca() {
    const ourela = parseFloat(document.getElementById('ourela').value);
    const nome = document.getElementById('nome').value;
    const altura = parseFloat(document.getElementById('altura').value);
    const largura = parseFloat(document.getElementById('largura').value);
    const orientacao = document.getElementById('orientacao').value;

    if (nome && altura && largura) {
        const peca = { nome, altura, largura, orientacao };
        pecas.push(peca);
        atualizarTabela();
        atualizarAreaCorte();
        calcularTecidoNecessario();
    } else {
        alert('Por favor, preencha todos os campos.');
    }
}

function atualizarTabela() {
    const tabela = document.getElementById('tabela-pecas').getElementsByTagName('tbody')[0];
    tabela.innerHTML = '';
    pecas.forEach((peca, index) => {
        const row = tabela.insertRow();
        row.innerHTML = `
            <td>${peca.nome}</td>
            <td>${peca.altura}</td>
            <td>${peca.largura}</td>
            <td>${peca.orientacao}</td>
            <td><button onclick="removerPeca(${index})">Remover</button></td>
        `;
    });
}

function removerPeca(index) {
    pecas.splice(index, 1);
    atualizarTabela();
    atualizarAreaCorte();
    calcularTecidoNecessario();
}

function atualizarAreaCorte() {
    const areaCorte = document.getElementById('area-corte');
    areaCorte.innerHTML = '';
    pecas.forEach(peca => {
        const div = document.createElement('div');
        div.classList.add('peca');
        div.style.width = `${peca.largura * 100}%`;
        div.style.height = `${peca.altura * 100}%`;
        div.innerHTML = `<p>${peca.nome}</p>`;
        areaCorte.appendChild(div);
    });
}

function calcularTecidoNecessario() {
    const ourela = parseFloat(document.getElementById('ourela').value);
    const totalArea = pecas.reduce((total, peca) => total + (peca.largura * peca.altura), 0);
    const totalTecido = totalArea / ourela;
    document.getElementById('total-tecido').textContent = totalTecido.toFixed(2);
}
