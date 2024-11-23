let pecas = [];
let larguraTecido;
let planoTecido = document.getElementById('tecido');

function adicionarPeca() {
    let nome = document.getElementById('nomePeca').value;
    let comprimento = parseFloat(document.getElementById('comprimentoPeca').value);
    let largura = parseFloat(document.getElementById('larguraPeca').value);
    let sentido = document.getElementById('sentidoPeca').value;

    if (nome === '' || isNaN(comprimento) || isNaN(largura)) {
        alert("Por favor, insira todos os dados corretamente.");
        return;
    }

    // Verificar se a peça cabe na largura do tecido (usando o sentido da ourela)
    if (sentido === "ourelas" && largura > larguraTecido) {
        alert("A peça não cabe na largura do tecido com este sentido. Tente cortar no sentido da trama ou enviesado.");
        return;
    }

    // Adicionar a peça ao array de peças
    pecas.push({ nome, comprimento, largura, sentido });
    atualizarPlano();
    limparCampos();
    listarPecas();
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
    let maxY = 0;

    pecas.forEach((peca) => {
        // Verifica se a peça cabe na largura disponível do tecido
        if (xOffset + peca.largura <= larguraTecido) {
            let pecaDiv = document.createElement('div');
            pecaDiv.classList.add('peca');

            // Ajuste do tamanho e posicionamento dependendo do sentido
            if (peca.sentido === 'enviesado') {
                pecaDiv.style.width = peca.largura * 100 + 'px';
                pecaDiv.style.height = peca.comprimento * 100 + 'px';
                pecaDiv.style.transform = "rotate(45deg)"; // Rotaciona a peça para o enviesado
            } else {
                pecaDiv.style.width = peca.largura * 100 + 'px';
                pecaDiv.style.height = peca.comprimento * 100 + 'px';
            }

            pecaDiv.innerHTML = `${peca.nome}<br>${peca.comprimento}m x ${peca.largura}m`;

            pecaDiv.style.left = xOffset * 100 + 'px';
            pecaDiv.style.top = yOffset * 100 + 'px';

            planoTecido.appendChild(pecaDiv);

            // Atualiza as posições para a próxima peça
            xOffset += peca.largura;
            maxY = Math.max(maxY, yOffset + 1);
        } else {
            // Se não couber na largura, tenta adicionar abaixo
            if (xOffset > 0) {
                xOffset = 0;
                yOffset += 1;
            }
            if (yOffset * 100 + peca.comprimento * 100 <= 400) {
                let pecaDiv = document.createElement('div');
                pecaDiv.classList.add('peca');

                // Ajuste do tamanho e posicionamento
                if (peca.sentido === 'enviesado') {
                    pecaDiv.style.width = peca.largura * 100 + 'px';
                    pecaDiv.style.height = peca.comprimento * 100 + 'px';
                    pecaDiv.style.transform = "rotate(45deg)"; // Rotaciona a peça para o enviesado
                } else {
                    pecaDiv.style.width = peca.largura * 100 + 'px';
                    pecaDiv.style.height = peca.comprimento * 100 + 'px';
                }

                pecaDiv.innerHTML = `${peca.nome}<br>${peca.comprimento}m x ${peca.largura}m`;

                pecaDiv.style.left = xOffset * 100 + 'px';
                pecaDiv.style.top = yOffset * 100 + 'px';

                planoTecido.appendChild(pecaDiv);

                // Atualiza as posições para a próxima peça
                xOffset += peca.largura;
            } else {
                alert(`A peça ${peca.nome} não cabe no tecido disponível.`);
            }
        }
    });

    calcularMetragem();
}

function limparCampos() {
    document.getElementById('nomePeca').value = '';
    document.getElementById('comprimentoPeca').value = '';
    document.getElementById('larguraPeca').value = '';
}

function calcularMetragem() {
    let areaTotal = pecas.reduce((total, peca) => total + (peca.comprimento * peca.largura), 0);
    let metragemNecessaria = areaTotal / larguraTecido;

    document.getElementById('resultado').innerHTML = `Você precisará de aproximadamente ${metragemNecessaria.toFixed(2)} metros de tecido.`;
}

function listarPecas() {
    let tabela = document.getElementById('tabelaPecas').getElementsByTagName('tbody')[0];
    tabela.innerHTML = ''; // Limpar a tabela antes de inserir novos dados

    pecas.forEach((peca, index) => {
        let row = tabela.insertRow();
        row.insertCell(0).textContent = peca.nome;
        row.insertCell(1).textContent = peca.comprimento + "m";
        row.insertCell(2).textContent = peca.largura + "m";
        row.insertCell(3).textContent = peca.sentido;

        let removerBtn = document.createElement('button');
        removerBtn.textContent = 'Remover';
        removerBtn.onclick = () => removerPeca(index);
        row.insertCell(4).appendChild(removerBtn);
    });
}

function removerPeca(index) {
    pecas.splice(index, 1);
    atualizarPlano();
    listarPecas();
}

function imprimirPlano() {
    window.print();
}
