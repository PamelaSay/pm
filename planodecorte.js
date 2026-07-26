/*====================================================
    PAMELETE CORTE
    Sistema Inteligente de Plano de Corte
=====================================================*/

const pecas = [];
const ESCALA = 180; // Escala de desenho
const tecido = document.getElementById("tecido");
tecido.style.display = "none";

/*====================================================
    ELEMENTOS
=====================================================*/

const tabela = document.querySelector("#tabelaPecas tbody");
const areaCorte = document.getElementById("areaCorte");
const metragem = document.getElementById("metragem");
const desperdicio = document.getElementById("desperdicio");

/*====================================================
    BOTÕES
=====================================================*/

document.getElementById("btnAdicionar").addEventListener("click", salvarPeca);
document.getElementById("btnCalcular").addEventListener("click", calcularPlano);
document.getElementById("btnLimpar").addEventListener("click", limparProjeto);
document.getElementById("btnImprimir").addEventListener("click", () => window.print());

/*====================================================
    SALVAR PEÇA
=====================================================*/

function salvarPeca(){
    const nome = document.getElementById("nomePeca").value.trim();
    const altura = parseFloat(document.getElementById("alturaPeca").value);
    const largura = parseFloat(document.getElementById("larguraPeca").value); // Corrigido para corresponder ao ID do HTML
    const quantidade = parseInt(document.getElementById("quantidadePeca").value) || 1;
    const sentido = document.getElementById("sentidoPeca").value;  
    const espelhar = document.getElementById("espelhar").value;

    if(nome === "" || isNaN(altura) || isNaN(largura)) {
        alert("Preencha todos os campos corretamente (Nome, Altura e Largura).");
        return;
    }

    pecas.push({
        nome,
        altura,
        largura,
        quantidade,
        sentido,
        espelhar
    });

    atualizarTabela();
    limparFormulario();
}

/*====================================================
    LIMPAR FORMULÁRIO
=====================================================*/

function limparFormulario(){
    document.getElementById("nomePeca").value = "";
    document.getElementById("alturaPeca").value = "";
    document.getElementById("larguraPeca").value = "";
    document.getElementById("quantidadePeca").value = 1;
}

/*====================================================
    ATUALIZAR TABELA
=====================================================*/

function atualizarTabela() {
    tabela.innerHTML = "";

    pecas.forEach((peca, indice) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${peca.nome}</td>
            <td>${peca.altura.toFixed(2)} m</td>
            <td>${peca.largura.toFixed(2)} m</td>
            <td>${peca.quantidade}</td>
            <td>${peca.sentido}</td>
            <td>
                <button onclick="editarPeca(${indice})">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button onclick="duplicarPeca(${indice})">
                    <i class="fa-solid fa-copy"></i>
                </button>
                <button onclick="removerPeca(${indice})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        tabela.appendChild(tr);
    });
}

/*====================================================
    REMOVER PEÇA
=====================================================*/

function removerPeca(indice){
    if(confirm("Remover esta peça?")){
        pecas.splice(indice, 1);
        atualizarTabela();
        calcularPlano();
    }
}

/*====================================================
    DUPLICAR PEÇA
=====================================================*/

function duplicarPeca(indice){
    const copia = {...pecas[indice]};
    copia.nome += " (Cópia)";
    pecas.push(copia);
    atualizarTabela();
    calcularPlano();
}

/*====================================================
    EDITAR PEÇA
=====================================================*/

function editarPeca(indice){
    const p = pecas[indice];
    document.getElementById("nomePeca").value = p.nome;
    document.getElementById("alturaPeca").value = p.altura;
    document.getElementById("larguraPeca").value = p.largura;
    document.getElementById("quantidadePeca").value = p.quantidade;
    document.getElementById("sentidoPeca").value = p.sentido;
    document.getElementById("espelhar").value = p.espelhar;
    pecas.splice(indice, 1);
    atualizarTabela();
}

/*====================================================
    LIMPAR PROJETO
=====================================================*/

function limparProjeto(){
    if(!confirm("Deseja limpar todo o projeto?")) return;

    pecas.length = 0;
    tabela.innerHTML = "";
    areaCorte.innerHTML = "";
    tecido.style.display = "none";
    metragem.textContent = "0,00 m";
    desperdicio.textContent = "0%";
    limparFormulario();
}

/*====================================================
    CALCULAR PLANO DE CORTE
=====================================================*/

function calcularPlano(){
    const larguraTecido = parseFloat(document.getElementById("larguraTecido").value);

    if(isNaN(larguraTecido) || larguraTecido <= 0){
        alert("Informe a largura do tecido.");
        return;
    }

    if(pecas.length === 0){
        tecido.style.display = "none";
        return;
    }

    tecido.style.display = "block";
    desenharPlano();
}

/*====================================================
    DESENHAR PLANO
=====================================================*/

function desenharPlano(){
    if(pecas.length === 0){
        tecido.style.display = "none";
        return;
    }

    tecido.style.display = "block";
    areaCorte.innerHTML = ""; 

    const margem = parseFloat(document.getElementById("margem").value) / 100;
    const larguraTecido = parseFloat(document.getElementById("larguraTecido").value);
    const larguraPx = larguraTecido * ESCALA;

    areaCorte.style.width = larguraPx + "px";

    const lista = [];
    pecas.forEach(p => {
        for(let i = 0; i < p.quantidade; i++){
            lista.push({...p});
        }
    });

    lista.sort((a, b) => b.altura - a.altura);

    let y = 0;
    const linhas = [];

    lista.forEach(peca => {
        let largura = peca.largura;
        let altura = peca.altura;

        if(peca.sentido === "trama"){
            largura = peca.altura;
            altura = peca.largura;
        }

        largura += margem * 2;
        altura += margem * 2;

        let colocou = false;

        for(const linha of linhas){
            if(linha.larguraUsada + largura <= larguraTecido){
                criarPeca(peca, linha.larguraUsada, linha.y, largura, altura, margem);

                linha.larguraUsada += largura;
                linha.pecas.push(peca);

                if(altura > linha.alturaMaior){
                    linha.alturaMaior = altura;
                }
                colocou = true;
                break;
            }
        }

        if(!colocou){
            criarPeca(peca, 0, y, largura, altura, margem);

            linhas.push({
                y,
                alturaMaior: altura,
                larguraUsada: largura,
                pecas: [peca]
            });

            y += altura;
        }
    });

    let comprimentoTotal = 0;
    linhas.forEach(l => {
        comprimentoTotal += l.alturaMaior;
    });

    const alturaFinal = Math.max(220, comprimentoTotal * ESCALA);
    areaCorte.style.height = alturaFinal + "px";

    calcularResultados(comprimentoTotal, larguraTecido);
}

/*====================================================
    CRIAR PEÇA
=====================================================*/

function criarPeca(peca, x, y, largura, altura, margem){
    const div = document.createElement("div");
    div.className = "peca";

    if(peca.sentido === "enviesado"){
        div.classList.add("enviesado");
        div.style.transform = "rotate(-45deg)";
    }

    const larguraReal = peca.largura * ESCALA;
    const alturaReal = peca.altura * ESCALA;
    const margemPx = margem * ESCALA;

    div.style.width = larguraReal + "px";
    div.style.height = alturaReal + "px";
    div.style.left = ((x * ESCALA) + margemPx) + "px";
    div.style.top = ((y * ESCALA) + margemPx) + "px";

    const seta = peca.sentido == "ourela" ? "⬆" : peca.sentido == "trama" ? "➡" : "↗";

    div.innerHTML = `
        <div style="font-size:12px"><strong>${peca.nome}</strong></div>
        <div>${seta}</div>
        <div style="font-size:11px">${peca.altura.toFixed(2)} x ${peca.largura.toFixed(2)}</div>
    `;

    areaCorte.appendChild(div);
}

/*====================================================
    CALCULAR RESULTADOS
=====================================================*/

function calcularResultados(comprimentoUtilizado, larguraTecido){
    let areaTotal = 0;

    pecas.forEach(peca => {
        areaTotal += peca.altura * peca.largura * peca.quantidade;
    });
    
    metragem.innerHTML = comprimentoUtilizado.toFixed(2) + " m";

    const areaComprada = comprimentoUtilizado * larguraTecido;
    let percDesperdicio = 0;
    
    if (areaComprada > 0) {
        percDesperdicio = ((areaComprada - areaTotal) / areaComprada) * 100;
    }
    
    desperdicio.innerHTML = Math.max(0, percDesperdicio).toFixed(1) + "%";
}

/*====================================================
    SALVAR PROJETO
=====================================================*/

document.getElementById("btnSalvarProjeto").addEventListener("click", salvarProjeto);

function salvarProjeto(){
    localStorage.setItem(
        "pameleteProjeto",
        JSON.stringify({
            largura: document.getElementById("larguraTecido").value,
            margem: document.getElementById("margem").value,
            pecas
        })
    );
    alert("Projeto salvo com sucesso!");
}

/*====================================================
    CARREGAR PROJETO
=====================================================*/

window.onload = function(){
    const projeto = JSON.parse(localStorage.getItem("pameleteProjeto"));
    if(!projeto) return;

    document.getElementById("larguraTecido").value = projeto.largura;
    document.getElementById("margem").value = projeto.margem;

    pecas.push(...projeto.pecas);
    atualizarTabela();
    calcularPlano();
};
