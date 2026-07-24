let larguraTecido = 0; 
let MARGEM_SEGURANÇA = 0.02; 
let pecas = [];

document.addEventListener("DOMContentLoaded", () => {
    const btnDefinirOurela = document.getElementById("btnDefinirOurela");
    const btnNovoPlano = document.getElementById("btnNovoPlano");
    const btnSalvar = document.getElementById("btnSalvar");
    const btnCancelar = document.getElementById("btnCancelar");
    const btnImprimir = document.getElementById("btnImprimir");

    if (btnDefinirOurela) btnDefinirOurela.addEventListener("click", atualizarTecido);
    if (btnNovoPlano) btnNovoPlano.addEventListener("click", novoPlano);
    if (btnSalvar) btnSalvar.addEventListener("click", salvarPeca);
    if (btnCancelar) btnCancelar.addEventListener("click", cancelarEdicao);
    if (btnImprimir) btnImprimir.addEventListener("click", () => window.print());
});

function atualizarTecido() {
    const inputLargura = document.getElementById("larguraTecido");
    if (inputLargura) {
        larguraTecido = parseFloat(inputLargura.value) || 0;
    }
    atualizarPlanoDeCorte();
}

function novoPlano() {
    if (confirm("Deseja realmente limpar todas as peças e reiniciar o plano de corte?")) {
        pecas = [];
        larguraTecido = 0;
        
        const inputLargura = document.getElementById("larguraTecido");
        if (inputLargura) inputLargura.value = "";
        
        cancelarEdicao();
        atualizarTabelaPecas();
        atualizarPlanoDeCorte();
    }
}

function atualizarPlanoDeCorte() {
    const tecidoDiv = document.getElementById("tecido");
    const conteudoDiv = document.getElementById("conteudo-tecido");
    const resultadoDiv = document.getElementById("resultado");
    
    if (!conteudoDiv || !tecidoDiv) return;

    conteudoDiv.innerHTML = ''; 

    if (larguraTecido <= 0) {
        tecidoDiv.style.width = "100%";
        conteudoDiv.style.height = "50px"; 
        if (resultadoDiv) {
            resultadoDiv.innerText = "Defina a largura da ourela e adicione as peças para ver a metragem necessária.";
        }
        return;
    }

    const escala = 120; 
    const larguraTelaTecido = larguraTecido * escala;
    
    tecidoDiv.style.width = (larguraTelaTecido + 64) + "px";
    conteudoDiv.style.width = larguraTelaTecido + "px";

    const larguraUtilPx = larguraTelaTecido;
    const margemPx = MARGEM_SEGURANÇA * escala;
    const metadeMargem = margemPx / 2;

    let posX = 0;
    let posY = 0;
    let maiorAlturaNaLinha = 0;

    if (pecas.length === 0) {
        conteudoDiv.style.height = "50px";
        const faixasOurela = tecidoDiv.querySelectorAll('.faixa-ourelha');
        faixasOurela.forEach(faixa => faixa.style.height = "50px");
        if (resultadoDiv) {
            resultadoDiv.innerText = `Largura da ourela definida: ${larguraTecido}m. Adicione peças para calcular a metragem.`;
        }
        return;
    }

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

            if (posX + larguraComMargemPx > larguraUtilPx + 0.1) {
                posX = 0;
                posY += maiorAlturaNaLinha;
                maiorAlturaNaLinha = 0;
            }

            pecaDiv.style.width = larguraPx + "px";
            pecaDiv.style.height = alturaPx + "px";
            pecaDiv.style.left = (posX + metadeMargem) + "px";
            pecaDiv.style.top = (posY + metadeMargem) + "px";
            pecaDiv.innerText = `${peca.nome}`;

            if (alturaComMargemPx > maiorAlturaNaLinha) {
                maiorAlturaNaLinha = alturaComMargemPx;
            }

            posX += larguraComMargemPx;
            conteudoDiv.appendChild(pecaDiv);
        }
    });

    let alturaTotalNecessariaPx = posY + maiorAlturaNaLinha;
    if (alturaTotalNecessariaPx < 50) {
        alturaTotalNecessariaPx = 50;
    }

    conteudoDiv.style.height = alturaTotalNecessariaPx + "px";
    
    const faixasOurela = tecidoDiv.querySelectorAll('.faixa-ourelha');
    faixasOurela.forEach(faixa => {
        faixa.style.height = alturaTotalNecessariaPx + "px";
    });

    const metrosNecessarios = (alturaTotalNecessariaPx / escala).toFixed(2);
    if (resultadoDiv) {
        resultadoDiv.innerHTML = `Metragem linear necessária de tecido: <strong>${metrosNecessarios} metros</strong> (com largura de ${larguraTecido}m).`;
    }
}

function salvarPeca(event) {
    if (event) event.preventDefault();

    const indiceInput = document.getElementById("indiceEdicao");
    const nomeInput = document.getElementById("nomePeca");
    const alturaInput = document.getElementById("alturaPeca");
    const larguraInput = document.getElementById("larguraPeca");
    const quantidadeInput = document.getElementById("quantidadePeca");
    const sentidoInput = document.getElementById("sentidoPeca");

    if (!nomeInput || !alturaInput || !larguraInput || !quantidadeInput) return;

    const nome = nomeInput.value.trim() || "Peça";
    const altura = parseFloat(alturaInput.value);
    const largura = parseFloat(larguraInput.value);
    const quantidade = parseInt(quantidadeInput.value) || 1;
    const sentido = sentidoInput ? sentidoInput.value : "ourela";

    if (isNaN(altura) || isNaN(largura) || altura <= 0 || largura <= 0) {
        alert("Por favor, insira medidas válidas de altura e largura.");
        return;
    }

    const indice = indiceInput.value;

    if (indice === "") {
        pecas.push({ nome, altura, largura, quantidade, sentido });
    } else {
        pecas[parseInt(indice)] = { nome, altura, largura, quantidade, sentido };
        cancelarEdicao();
    }

    nomeInput.value = "";
    alturaInput.value = "";
    larguraInput.value = "";
    quantidadeInput.value = "1";
    if (sentidoInput) sentidoInput.value = "ourela";

    atualizarTabelaPecas();
    atualizarPlanoDeCorte();
}

function atualizarTabelaPecas() {
    const tbody = document.querySelector("#tabelaPecas tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    pecas.forEach((peca, index) => {
        const tr = document.createElement("tr");

        let textoSentido = "Normal (Ourela / Urdume)";
        if (peca.sentido === "trama") textoSentido = "Trama (Transversal)";
        if (peca.sentido === "enviesado") textoSentido = "Enviesado (45°)";

        tr.innerHTML = `
            <td>${peca.nome}</td>
            <td>${peca.altura}</td>
            <td>${peca.largura}</td>
            <td>${textoSentido}</td>
            <td>${peca.quantidade}</td>
            <td>
                <button type="button" class="btn-editar" data-index="${index}" title="Editar"><i class="fa-solid fa-pen"></i></button>
                <button type="button" class="btn-duplicar" data-index="${index}" title="Duplicar" style="background-color: #b3e0ff; color: #1a202c;"><i class="fa-solid fa-copy"></i></button>
                <button type="button" class="btn-excluir" data-index="${index}" title="Excluir"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    document.querySelectorAll(".btn-editar").forEach(btn => {
        btn.addEventListener("click", (e) => editarPeca(e.currentTarget.dataset.index));
    });
    document.querySelectorAll(".btn-duplicar").forEach(btn => {
        btn.addEventListener("click", (e) => duplicarPeca(e.currentTarget.dataset.index));
    });
    document.querySelectorAll(".btn-excluir").forEach(btn => {
        btn.addEventListener("click", (e) => removerPeca(e.currentTarget.dataset.index));
    });
}

function editarPeca(index) {
    const peca = pecas[index];
    if (!peca) return;

    document.getElementById("indiceEdicao").value = index;
    document.getElementById("nomePeca").value = peca.nome;
    document.getElementById("alturaPeca").value = peca.altura;
    document.getElementById("larguraPeca").value = peca.largura;
    document.getElementById("quantidadePeca").value = peca.quantidade;
    document.getElementById("sentidoPeca").value = peca.sentido;

    document.getElementById("tituloFormulario").innerText = "Editar Peça";
    document.getElementById("btnSalvar").innerText = "Salvar Alterações";
    document.getElementById("btnCancelar").style.display = "inline-block";
}

function duplicarPeca(index) {
    const peca = pecas[index];
    if (!peca) return;

    const novaPeca = { 
        nome: `${peca.nome} (Cópia)`, 
        altura: peca.altura, 
        largura: peca.largura, 
        quantidade: peca.quantidade, 
        sentido: peca.sentido 
    };

    pecas.push(novaPeca);
    atualizarTabelaPecas();
    atualizarPlanoDeCorte();
}

function cancelarEdicao() {
    document.getElementById("indiceEdicao").value = "";
    document.getElementById("nomePeca").value = "";
    document.getElementById("alturaPeca").value = "";
    document.getElementById("larguraPeca").value = "";
    document.getElementById("quantidadePeca").value = "1";
    document.getElementById("sentidoPeca").value = "ourela";

    document.getElementById("tituloFormulario").innerText = "Adicionar Peça";
    document.getElementById("btnSalvar").innerText = "Adicionar Peça";
    document.getElementById("btnCancelar").style.display = "none";
}

function removerPeca(index) {
    pecas.splice(index, 1);
    atualizarTabelaPecas();
    atualizarPlanoDeCorte();
}
