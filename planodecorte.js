let peças = [];
let larguraTecido = 1.40; // Largura do tecido
let comprimentoTecido = 1.00; // Comprimento do tecido
let totalTecido = 0;

// Vincula os eventos aos botões assim que a página carrega
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("adicionar-peça-btn").addEventListener("click", adicionarPeça);
    document.getElementById("resetar-btn").addEventListener("click", resetar);
    document.getElementById("imprimir-btn").addEventListener("click", imprimirPlano);
});

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
        divPeça.style.left = xPos + 'px';
        divPeça.style.top = yPos + 'px';
        divPeça.innerText = peça.nome;

        planoCorte.appendChild(divPeça);

        xPos += peça.largura * 100; // Incrementa a posição horizontal

        // Se não caber na linha, vai para a próxima
        if (xPos + (peça.largura * 100) > larguraTecido * 100) {
            xPos = 10;
            yPos += peça.altura * 100;
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
    const planoCorte = document.getElementById('plano-corte');
    const largura = planoCorte.offsetWidth;
    const altura = planoCorte.offsetHeight;
    const canvas = document.createElement('canvas');
    canvas.width = largura;
    canvas.height = altura;
    const ctx = canvas.getContext('2d');

    // Desenhar plano de corte no canvas
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, largura, altura);

    // Adicionar peças no canvas
    peças.forEach((peça) => {
        const larguraPixels = peça.largura * 100;
        const alturaPixels = peça.altura * 100;
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(10, 10, larguraPixels, alturaPixels);  // Exemplo de posição, depois você pode ajustar para coordenadas
    });

    const dataUrl = canvas.toDataURL();
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'plano_de_corte.png';
    link.click();
}
