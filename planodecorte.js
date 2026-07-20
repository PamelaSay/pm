let larguraTecido = 0;
let alturaTecido = 0;
const pecas = [];

function atualizarPlano() {
    larguraTecido = parseFloat(document.getElementById('largura').value);
    alturaTecido = parseFloat(document.getElementById('alturaTecidoInput').value);

    if (isNaN(larguraTecido) || larguraTecido <= 0 || isNaN(alturaTecido) || alturaTecido <= 0) {
        alert("Por favor, insira uma largura e altura válidas para o tecido.");
        return;
    }

    const tecidoDiv = document.getElementById("tecido");
    tecidoDiv.style.width = (larguraTecido * 100) + "px"; 
    tecidoDiv.style.height = (alturaTecido * 100) + "px"; 

    atualizarPlanoDeCorte();
}

function adicionarPeca() {
    const nomePeca = document.getElementById('nomePeca').value;
    const alturaPeca = parseFloat(document.getElementById('alturaPeca').value);
    const larguraPeca = parseFloat(document.getElementById('larguraPeca').value);
    const sentidoPeca = document.getElementById('sentidoPeca').value;
    const quantidadePeca = parseInt(document.getElementById('quantidadePeca').value);

    if (isNaN(alturaPeca) || alturaPeca <= 0 || isNaN(larguraPeca) || larguraPeca <= 0 || !nomePeca || isNaN(quantidadePeca)) {
        alert("Por favor, preencha todos os campos da peça corretamente.");
        return;
    }

    pecas.push({ 
        nome: nomePeca, 
        altura: alturaPeca, 
        largura: larguraPeca, 
        sentido: sentidoPeca, 
        quantidade: quantidadePeca 
    });

    atualizarTabela();
    atualizarPlanoDeCorte();
    
    // Limpar campos de input da peça após adicionar
    document.getElementById('nomePeca').value = '';
    document.getElementById('alturaPeca').value = '';
    document.getElementById('larguraPeca').value = '';
    document.getElementById('quantidadePeca').value = '1';
}

function atualizarTabela() {
    const tabela = document.getElementById('tabelaPecas').getElementsByTagName('tbody')[0];
    tabela.innerHTML = ''; 

    pecas.forEach((peca, index) => {
        const linha = tabela.insertRow();
        linha.innerHTML = `
            <td>${peca.nome}</td>
            <td>${peca.altura}m</td>
            <td>${peca.largura}m</td>
            <td>${peca.sentido}</td>
            <td>${peca.quantidade}</td>
            <td><button onclick="removerPeca(${index})">Remover</button></td>
        `;
    });
}

function removerPeca(index) {
    pecas.splice(index, 1);
    atualizarTabela();
    atualizarPlanoDeCorte();
}

function atualizarPlanoDeCorte() {
    const tecidoDiv = document.getElementById("tecido");
    tecidoDiv.innerHTML = ''; 

    if (larguraTecido <= 0 || alturaTecido <= 0) return;

    let posX = 0;
    let posY = 0;
    let maiorAlturaNaLinha = 0;

    pecas.forEach(peca => {
        for (let i = 0; i < peca.quantidade; i++) {
            const pecaDiv = document.createElement('div');
            pecaDiv.classList.add('peca');
            
            // Estilos básicos para visualizar os blocos no tecido
            pecaDiv.style.position = 'absolute';
            pecaDiv.style.width = (peca.largura * 100) + "px";
            pecaDiv.style.height = (peca.altura * 100) + "px";
            pecaDiv.style.border = '1px dashed #333';
            pecaDiv.style.backgroundColor = 'rgba(200, 220, 240, 0.6)';
            pecaDiv.style.boxSizing = 'border-box';
            pecaDiv.style.fontSize = '12px';
            pecaDiv.style.padding = '2px';
            pecaDiv.innerText = `${peca.nome}`;

            // Quebra de linha simples baseada na largura do tecido da ourela
            if (posX + (peca.largura * 100) > larguraTecido * 100) {
                posX = 0;
                posY += maiorAlturaNaLinha;
                maiorAlturaNaLinha = 0;
            }

            pecaDiv.style.left = posX + "px";
            pecaDiv.style.top = posY + "px";

            if ((peca.altura * 100) > maiorAlturaNaLinha) {
                maiorAlturaNaLinha = peca.altura * 100;
            }

            posX += peca.largura * 100;
            tecidoDiv.appendChild(pecaDiv);
        }
    });
}

function calcularMetragem() {
    let areaTotalPecas = 0;
    pecas.forEach(peca => {
        areaTotalPecas += (peca.altura * peca.largura) * peca.quantidade;
    });

    const resultado = document.getElementById('resultado');
    if (larguraTecido > 0) {
        let comprimentoEstimado = areaTotalPecas / larguraTecido;
        resultado.innerText = `Área total das peças: ${areaTotalPecas.toFixed(2)} m². Comprimento linear aproximado necessário na largura de ${larguraTecido}m: ${comprimentoEstimado.toFixed(2)} metros.`;
    } else {
        resultado.innerText = `Área total das peças: ${areaTotalPecas.toFixed(2)} m². Defina a largura do tecido para calcular o comprimento.`;
    }
}

function imprimirPlano() {
    window.print();
}
