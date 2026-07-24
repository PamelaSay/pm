let larguraTecido = 0;
const pecas = [];

function atualizarPlano() {
    larguraTecido = parseFloat(document.getElementById('largura').value);

    if (isNaN(larguraTecido) || larguraTecido <= 0) {
        alert("Por favor, insira uma largura de ourela válida.");
        return;
    }

    atualizarPlanoDeCorte();
}

function salvarPeca() {
    const nomePeca = document.getElementById('nomePeca').value;
    const alturaPeca = parseFloat(document.getElementById('alturaPeca').value);
    const larguraPeca = parseFloat(document.getElementById('larguraPeca').value);
    const sentidoPeca = document.getElementById('sentidoPeca').value;
    const quantidadePeca = parseInt(document.getElementById('quantidadePeca').value);
    const indiceEdicao = document.getElementById('indiceEdicao').value;

    if (isNaN(alturaPeca) || alturaPeca <= 0 || isNaN(larguraPeca) || larguraPeca <= 0 || !nomePeca || isNaN(quantidadePeca)) {
        alert("Por favor, preencha todos os campos da peça corretamente.");
        return;
    }

    const novaPeca = { 
        nome: nomePeca, 
        altura: alturaPeca, 
        largura: larguraPeca, 
        sentido: sentidoPeca, 
        quantidade: quantidadePeca 
    };

    if (indiceEdicao === "") {
        pecas.push(novaPeca);
    } else {
        pecas[parseInt(indiceEdicao)] = novaPeca;
        cancelarEdicao();
    }

    atualizarTabela();
    atualizarPlanoDeCorte();
    limparFormulario();
}

function limparFormulario() {
    document.getElementById('nomePeca').value = '';
    document.getElementById('alturaPeca').value = '';
    document.getElementById('larguraPeca').value = '';
    document.getElementById('quantidadePeca').value = '1';
    document.getElementById('sentidoPeca').value = 'ourelha';
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
            <td>
                <button class="btn-acao btn-editar" title="Editar" onclick="editarPeca(${index})"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn-acao btn-duplicar" title="Duplicar" onclick="duplicarPeca(${index})"><i class="fa-solid fa-copy"></i></button>
                <button class="btn-acao btn-remover" title="Remover" onclick="removerPeca(${index})"><i class="fa-solid fa-trash-can"></i></button>
            </td>
        `;
    });
}

function editarPeca(index) {
    const peca = pecas[index];
    document.getElementById('nomePeca').value = peca.nome;
    document.getElementById('alturaPeca').value = peca.altura;
    document.getElementById('larguraPeca').value = peca.largura;
    document.getElementById('sentidoPeca').value = peca.sentido;
    document.getElementById('quantidadePeca').value = peca.quantidade;
    document.getElementById('indiceEdicao').value = index;

    document.getElementById('tituloFormulario').innerText = "Editar Peça";
    document.getElementById('btnSalvar').innerText = "Salvar Alterações";
    document.getElementById('btnCancelar').style.display = "inline-block";
}

function cancelarEdicao() {
    document.getElementById('indiceEdicao').value = "";
    document.getElementById('tituloFormulario').innerText = "Adicionar Peça";
    document.getElementById('btnSalvar').innerText = "Adicionar Peça";
    document.getElementById('btnCancelar').style.display = "none";
    limparFormulario();
}

function duplicarPeca(index) {
    const p = pecas[index];
    const duplicada = { 
        nome: p.nome + " (Cópia)", 
        altura: p.altura, 
        largura: p.largura, 
        sentido: p.sentido, 
        quantidade: p.quantidade 
    };
    pecas.push(duplicada);
    atualizarTabela();
    atualizarPlanoDeCorte();
}

function removerPeca(index) {
    pecas.splice(index, 1);
    atualizarTabela();
    atualizarPlanoDeCorte();
}
function atualizarPlanoDeCorte() {
    const tecidoDiv = document.getElementById("tecido");
    tecidoDiv.innerHTML = ''; 

    if (larguraTecido <= 0) {
        tecidoDiv.style.width = "100%";
        tecidoDiv.style.height = "400px";
        return;
    }

    // Definimos uma escala fixa realista: 1 metro = 200 pixels na tela (para dar uma visualização nítida e proporcional)
    const escala = 200; 
    const larguraTelaTecido = larguraTecido * escala;
    
    tecidoDiv.style.width = larguraTelaTecido + "px";

    let posX = 0;
    let posY = 0;
    let maiorAlturaNaLinha = 0;

    pecas.forEach(peca => {
        for (let i = 0; i < peca.quantidade; i++) {
            const pecaDiv = document.createElement('div');
            pecaDiv.classList.add('peca');
            
            let larguraFinal = peca.largura;
            let alturaFinal = peca.altura;

            if (peca.sentido === "trama") {
                larguraFinal = peca.altura;
                alturaFinal = peca.largura;
            } 
            else if (peca.sentido === "enviesado") {
                pecaDiv.classList.add('enviesado');
                let diagonal = Math.sqrt(Math.pow(peca.largura, 2) + Math.pow(peca.altura, 2));
                larguraFinal = diagonal;
                alturaFinal = diagonal;
            }

            const larguraPx = larguraFinal * escala;
            const alturaPx = alturaFinal * escala;

            pecaDiv.style.width = larguraPx + "px";
            pecaDiv.style.height = alturaPx + "px";
            pecaDiv.innerText = `${peca.nome}`;

            // Quebra de linha exata se a peça ultrapassar a largura real da ourela
            if (posX + larguraPx > larguraTelaTecido + 1) { // +1 pixel de tolerância para arredondamento
                posX = 0;
                posY += maiorAlturaNaLinha;
                maiorAlturaNaLinha = 0;
            }

            pecaDiv.style.left = posX + "px";
            pecaDiv.style.top = posY + "px";

            if (alturaPx > maiorAlturaNaLinha) {
                maiorAlturaNaLinha = alturaPx;
            }

            posX += larguraPx;
            tecidoDiv.appendChild(pecaDiv);
        }
    });

    let alturaTotalNecessariaPx = posY + maiorAlturaNaLinha + 40;
    if (alturaTotalNecessariaPx < 400) alturaTotalNecessariaPx = 400;
    tecidoDiv.style.height = alturaTotalNecessariaPx + "px";
}
function calcularMetragem() {
    let areaTotalPecas = 0;
    pecas.forEach(peca => {
        let fatorViés = (peca.sentido === "enviesado") ? 1.41 : 1.0; // Considera folga geométrica do viés a 45°
        areaTotalPecas += ((peca.altura * peca.largura) * fatorViés) * peca.quantidade;
    });

    const resultado = document.getElementById('resultado');
    if (larguraTecido > 0) {
        let comprimentoEstimado = (areaTotalPecas / larguraTecido) * 1.10; // 10% margem de segurança de corte
        resultado.innerText = `Para uma ourela de ${larguraTecido}m, você precisará comprar aproximadamente ${comprimentoEstimado.toFixed(2)} metros de tecido.`;
    } else {
        resultado.innerText = `Por favor, defina primeiro a largura da ourela do tecido.`;
    }
}

function imprimirPlano() {
    window.print();
}
