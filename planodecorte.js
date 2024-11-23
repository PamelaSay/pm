let peças = [];
const larguraTecido = 1.40; // Largura fixa do tecido
let totalTecido = 0;

function adicionarPeça() {
    const largura = parseFloat(document.getElementById('largura').value);
    const altura = parseFloat(document.getElementById('altura').value);

    if (isNaN(largura) || isNaN(altura) || largura <= 0 || altura <= 0) {
        alert("Por favor, insira valores válidos para largura e altura.");
        return;
    }

    peças.push({ largura, altura });
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
        divPeça.innerHTML = `Peça ${index + 1}: Largura = ${peça.largura}m, Altura = ${peça.altura}m <button onclick="removerPeça(${index})">Remover</button>`;
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

    totalTecido = alturaTotal / 1.00; // Calculando o comprimento total do tecido necessário
    document.getElementById('total-tecido').innerText = totalTecido.toFixed(2);
}

function desenharPlanoDeCorte() {
    const planoCorte = document.getElementById('plano-corte');
    planoCorte.innerHTML = ''; // Limpa o plano de corte existente

    let yPos = 10; // Inicia no topo do plano de corte
    peças.forEach((peça, index) => {
        const divPeça = document.createElement('div');
        divPeça.className = 'peça-visual';
        divPeça.style.width = (peça.largura * 100) + 'px'; // Convertendo para pixels
        divPeça.style.height = (peça.altura * 100) + 'px'; // Convertendo para pixels
        divPeça.style.top = yPos + 'px'; // Posição vertical
        divPeça.style.left = '10px'; // Posição horizontal fixada
        divPeça.innerText = `P${index + 1}: ${peça.largura}m x ${peça.altura}m`;
        
        planoCorte.appendChild(divPeça);
        yPos += (peça.altura * 100) + 10; // Atualiza a posição vertical para a próxima peça

        // Permitir arrastar as peças
        divPeça.setAttribute('draggable', true);
        divPeça.addEventListener('dragstart', (e) => dragStart(e, index));
        divPeça.addEventListener('dragover', dragOver);
        divPeça.addEventListener('drop', (e) => drop(e, index));
    });
}

function dragStart(e, index) {
    e.dataTransfer.setData('text', index);
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e, index) {
    e.preventDefault();
    const draggedIndex = e.dataTransfer.getData('text');
    if (draggedIndex !== index) {
        const temp = peças[index];
        peças[index] = peças[draggedIndex];
        peças[draggedIndex] = temp;
        atualizarPeças();
        desenharPlanoDeCorte();
    }
}

function resetar() {
    peças = [];
    atualizarPeças();
    calcularTecido();
    desenharPlanoDeCorte();
}

function imprimirPlano() {
    const content = document.getElementById('plano-corte').outerHTML;
    const win = window.open('', '', 'height=600,width=800');
    win.document.write('<html><head><title>Plano de Corte</title></head><body>');
    win.document.write(content);
    win.document.write('</body></html>');
    win.document.close();
    win.print();
}
