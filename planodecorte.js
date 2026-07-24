let larguraTecido = 0;
const pecas = [];
const MARGEM_SEGURANCA = 0.02; // 2 cm de distância entre as peças

function atualizarPlano() {
    larguraTecido = parseFloat(document.getElementById('largura').value);

    if (isNaN(larguraTecido) || larguraTecido <= 0) {
        alert("Por favor, insira uma largura de ourela válida.");
        return;
    }

    atualizarPlanoDeCorte();
    atualizarMetragemAutomatica();
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
    atualizarMetragemAutomatica();
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
    atualizarMetragemAutomatica();
}

function removerPeca(index) {
    pecas.splice(index, 1);
    atualizarTabela();
    atualizarPlanoDeCorte();
    atualizarMetragemAutomatica();
}

function atualizarPlanoDeCorte() {
    const tecidoDiv = document.getElementById("tecido");
    tecidoDiv.innerHTML = ''; 

    if (larguraTecido <= 0) {
        tecidoDiv.style.width = "100%";
        tecidoDiv.style.height = "400px";
        return;
    }

    const escala = 200; // 1 metro = 200px
    const larguraTelaTecido = larguraTecido * escala;
    tecidoDiv.style.width = larguraTelaTecido + "px";

    const margemPx = MARGEM_SEGURANCA * escala;

    let posX = 0;
    let posY = 0;
    let maiorAlturaNaLinha = 0;

    pecas.forEach(peca => {
        for (let i = 0; i < peca.quantidade; i++) {
            const pecaDiv = document.createElement('div');
            pecaDiv.classList.add('peca');
            
            let larguraRealPeca = peca.largura;
            let alturaRealPeca = peca.altura;

            if (peca.sentido === "trama") {
                larguraRealPeca = peca.altura;
                alturaRealPeca = peca.largura;
            } 
            else if (peca.sentido === "enviesado") {
                pecaDiv.classList.add('enviesado');
                let diagonal = Math.sqrt(Math.pow(peca.largura, 2) + Math.pow(peca.altura, 2));
                larguraRealPeca = diagonal;
                alturaRealPeca = diagonal;
            }

            // Adiciona a margem de segurança física para visualização do espaço ocupado
            const larguraComMargemPx = (larguraRealPeca + MARGEM_SEGURANCA) * escala;
            const alturaComMargemPx = (alturaRealPeca + MARGEM_SEGURANCA) * escala;

            pecaDiv.style.width = (larguraRealPeca * escala) + "px";
            pecaDiv.style.height = (alturaRealPeca * escala) + "px";
            pecaDiv.innerText = `${peca.nome}`;

            // Quebra de linha exata se estourar a ourela (considerando a margem)
            if (posX + larguraComMargemPx > larguraTelaTecido + 1) {
                posX = 0;
                posY += maiorAlturaNaLinha;
                maiorAlturaNaLinha = 0;
            }

            // Posiciona respeitando a margem interna
            pecaDiv.style.left = (posX + (margemPx / 2)) + "px";
            pecaDiv.style.top = (posY + (margemPx / 2)) + "px";

            if (alturaComMargemPx > maiorAlturaNaLinha) {
                maiorAlturaNaLinha = alturaComMargemPx;
            }

            posX += larguraComMargemPx;
            tecidoDiv.appendChild(pecaDiv);
        }
    });

    let alturaTotalNecessariaPx = posY + maiorAlturaNaLinha + 40;
    if (alturaTotalNecessariaPx < 400) alturaTotalNecessariaPx = 400;
    tecidoDiv.style.height = alturaTotalNecessariaPx + "px";
}

function atualizarMetragemAutomatica() {
    const resultado = document.getElementById('resultado');
    
    if (larguraTecido <= 0) {
        resultado.innerText = `Por favor, defina primeiro a largura da ourela do tecido.`;
        return;
    }

    if (pecas.length === 0) {
        resultado.innerText = `Nenhuma peça adicionada. Adicione peças para calcular a metragem automaticamente.`;
        return;
    }

    let areaTotalComMargem = 0;
    
    pecas.forEach(peca => {
        let larguraReal = peca.largura;
        let alturaReal = peca.altura;

        if (peca.sentido === "trama") {
            larguraReal = peca.altura;
            alturaReal = peca.largura;
        }

        let fatorViés = (peca.sentido === "enviesado") ? 1.41 : 1.0;
        
        // Adiciona os 2cm de margem de segurança diretamente nas dimensões de cada peça para o cálculo linear
        let larguraComFolga = larguraReal + MARGEM_SEGURANCA;
        let alturaComFolga = alturaReal + MARGEM_SEGURANCA;

        areaTotalComMargem += ((alturaComFolga * larguraComFolga) * fatorViés) * peca.quantidade;
    });

    let comprimentoEstimado = areaTotalComMargem / larguraTecido;
    
    resultado.innerHTML = `Metragem recomendada para compra: <strong style="color: #d4af37; font-size: 18px;">${comprimentoEstimado.toFixed(2)} metros</strong> (incluindo ourela de ${larguraTecido}m e 2cm de margem de segurança entre as peças).`;
}
