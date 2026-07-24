let larguraTecido = 0;
const pecas = [];
const MARGEM_SEGURANCA = 0.04; // 2 cm de margem de segurança fixa entre peças

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
    const pecas = window.pecas || pecas; // Referência segura
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
    const conteudoDiv = document.getElementById("conteudo-tecido");
    
    // Mantém as ourelas e a marca d'água intactas, limpando apenas o conteúdo interno das peças
    conteudoDiv.innerHTML = ''; 

    if (larguraTecido <= 0) {
        tecidoDiv.style.width = "100%";
        conteudoDiv.style.height = "400px";
        return;
    }

    const escala = 200; // 1 metro = 200px
    const larguraTelaTecido = larguraTecido * escala;
    
    tecidoDiv.style.width = (larguraTelaTecido + 64) + "px";
    conteudoDiv.style.width = larguraTelaTecido + "px";

    const larguraUtilPx = larguraTelaTecido;
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
            }

            const larguraPx = larguraRealPeca * escala;
            const alturaPx = alturaRealPeca * escala;

            const larguraComMargemPx = larguraPx + margemPx;
            const alturaComMargemPx = alturaPx + margemPx;

            pecaDiv.style.width = larguraPx + "px";
            pecaDiv.style.height = alturaPx + "px";
            pecaDiv.innerText = `${peca.nome}`;

            if (posX + larguraComMargemPx > larguraUtilPx + 1) {
                posX = 0;
                posY += maiorAlturaNaLinha;
                maiorAlturaNaLinha = 0;
            }

            pecaDiv.style.left = (posX + (margemPx / 2)) + "px";
            pecaDiv.style.top = (posY + (margemPx / 2)) + "px";

            if (alturaComMargemPx > maiorAlturaNaLinha) {
                maiorAlturaNaLinha = alturaComMargemPx;
            }

            posX += larguraComMargemPx;
            conteudoDiv.appendChild(pecaDiv);
        }
    });

   // Soma rigorosamente a altura acumulada de todas as linhas de peças posicionadas
    let alturaTotalNecessariaPx = posY + maiorAlturaNaLinha;
    
    // Se não houver peças adicionadas, mantém uma altura padrão para a área não sumir
    if (alturaTotalNecessariaPx < 100) {
        alturaTotalNecessariaPx = 400;
    }

    // Aplica a altura calculada exatamente no conteúdo do tecido
    conteudoDiv.style.height = alturaTotalNecessariaPx + "px";
    
    // Força as ourelas laterais a acompanharem perfeitamente a altura exata do corte
    const faixasOurela = tecidoDiv.querySelectorAll('.faixa-ourelha');
    faixasOurela.forEach(faixa => {
        faixa.style.height = alturaTotalNecessariaPx + "px";
    });
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

    let comprimentoTotalLinear = 0;
    let larguraAtualNaLinha = 0;
    let maiorAlturaNaLinhaAtual = 0;

    // Cálculo exato de encaixe somando rigorosamente a margem de segurança de 2cm por peça
    pecas.forEach(peca => {
        for (let i = 0; i < peca.quantidade; i++) {
            let larguraReal = peca.largura;
            let alturaReal = peca.altura;

            if (peca.sentido === "trama") {
                larguraReal = peca.altura;
                alturaReal = peca.largura;
            }

            // Soma direta da margem de segurança nas dimensões
            let larguraComFolga = larguraReal + MARGEM_SEGURANCA;
            let alturaComFolga = alturaReal + MARGEM_SEGURANCA;

            // Se a peça estourar a largura da ourela, quebra para o metro seguinte
            if (larguraAtualNaLinha + larguraComFolga > larguraTecido) {
                comprimentoTotalLinear += maiorAlturaNaLinhaAtual;
                larguraAtualNaLinha = 0;
                maiorAlturaNaLinhaAtual = 0;
            }

            larguraAtualNaLinha += larguraComFolga;
            if (alturaComFolga > maiorAlturaNaLinhaAtual) {
                maiorAlturaNaLinhaAtual = alturaComFolga;
            }
        }
    });

    // Adiciona o restante da última linha pendente
    if (maiorAlturaNaLinhaAtual > 0) {
        comprimentoTotalLinear += maiorAlturaNaLinhaAtual;
    }

    resultado.innerHTML = `Metragem recomendada para compra: <strong style="color: #d4af37; font-size: 18px;">${comprimentoTotalLinear.toFixed(2)} metros</strong> (considerando ourela de ${larguraTecido}m e 2cm de margem de segurança).`;
}

function imprimirPlano() {
    if (larguraTecido <= 0 || pecas.length === 0) {
        alert("Defina a ourela e adicione pelo menos uma peça antes de imprimir.");
        return;
    }
    window.print();
}
