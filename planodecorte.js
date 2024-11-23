let peças = [];
let larguraTecido = 1.40; // Largura do tecido
let comprimentoTecido = 1.00; // Comprimento do tecido
let totalTecido = 0;

function adicionarPeça() {
    const largura = parseFloat(document.getElementById('largura').value);
    const altura = parseFloat(document.getElementById('altura').value);
    const nome = document.getElementById('nome-peça').value.trim();

    // Verificação de valores válidos
    if (isNaN(largura) || isNaN(altura) || largura <= 0 || altura <= 0) {
        alert("Por favor, insira valores válidos para largura e altura.");
        return;
    }

    if (!nome) {
        alert("Por favor, insira um nome para a peça.");
        return;
    }

    peças.push({ nome, largura, altura });
    atualizarPeças();
    calcularTecido();
    desenharPlanoDeCorte();
}

function atualizarPeças() {
    const peçasAdicionadas = document.getElementById('peças-adicionadas');
    peçasAdicionadas.innerHTML = '';
    peças.forEach((peça, index) => {
        const divPeça = document.createElement('div');
        divPeça.className = 'peça';
        divPeça.innerHTML = `Nome: ${peça.nome}, Largura = ${peça.largura}m, Altura = ${peça.altura}m 
            <button onclick="removerPeça(${index})"><span class="material-icons">remove</span></button>`;
        peçasAdicionadas.appendChild(divPeça);
    });
}

function removerPeça(index) {
    peças.splice(index, 1);
    atualizarPeças();
    calcularTecido();
    desenharPlanoDeCorte();
}

function calcularTecido() {
    totalTecido = 0;
    let larguraTotal = 0;
    let alturaTotal = 0;

    // Calcular o tecido necessário
    peças.forEach(peça => {
        if (peça.largura > larguraTecido) {
            alturaTotal += Math.ceil(peça.largura / larguraTecido) * peça.altura; // Aumenta o comprimento
        } else {
            alturaTotal += peça.altura;
        }
    });

    totalTecido = alturaTotal / comprimentoTecido; // Calculando o comprimento total do tecido necessário
    document.getElementById('total-tecido').innerText = totalTecido.toFixed(2);
}

function desenharPlanoDeCorte() {
    const planoCorte = document.getElementById('plano-corte');
    planoCorte.innerHTML = ''; // Limpa o plano de corte existente

    let xPos = 10; // Inicia no lado esquerdo do plano de corte
    let yPos = 10; // Inicia no topo do plano de corte

    peças.forEach((peça, index) => {
        const divPeça = document.createElement('div');
        divPeça.className = 'peça-visual';
        divPeça.style.width = (peça.largura * 100) + 'px'; // Convertendo para pixels
        divPeça.style.height = (peça.altura * 100) + 'px'; // Convertendo para pixels
        divPeça.style.top = yPos + 'px'; // Posição vertical
        divPeça.style.left = xPos + 'px'; // Posição horizontal
        divPeça.innerText = `${peça.nome}: ${peça.largura}m x ${peça.altura}m`;

        planoCorte.appendChild(divPeça);

        // Verifica se é necessário mover para a próxima linha
        if (xPos + (peça.largura * 100) > planoCorte.offsetWidth) {
            xPos = 10;
            yPos += (peça.altura * 100) + 10; // Nova linha
        } else {
            xPos += (peça.largura * 100) + 10; // Coloca ao lado
        }
    });
}

function resetar() {
    peças = [];
    atualizarPeças();
    calcularTecido();
    desenharPlanoDeCorte();
}

function imprimirPlano() {
    const content = document.getElementById('plano-corte').outerHTML;
    const win = window.open('', '', 'height=600,width=800
