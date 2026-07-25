/*====================================================
    PAMELETE CORTE
    Sistema Inteligente de Plano de Corte
=====================================================*/

const pecas = [];

const ESCALA = 200; // 1 metro = 200 pixels

let larguraTecido = 1.50;

/*====================================================
    ELEMENTOS
=====================================================*/

const tabela = document.querySelector("#tabelaPecas tbody");

const areaCorte = document.getElementById("areaCorte");

const metragem = document.getElementById("metragem");

const aproveitamento = document.getElementById("aproveitamento");

const desperdicio = document.getElementById("desperdicio");

const areaUtilizada = document.getElementById("areaUtilizada");

/*====================================================
    BOTÕES
=====================================================*/

document
.getElementById("btnAdicionar")
.addEventListener("click", salvarPeca);

document
.getElementById("btnCalcular")
.addEventListener("click", calcularPlano);

document
.getElementById("btnLimpar")
.addEventListener("click", limparProjeto);

document
.getElementById("btnImprimir")
.addEventListener("click", () => window.print());

/*====================================================
    SALVAR PEÇA
=====================================================*/

function salvarPeca(){

    const nome=document
    .getElementById("nomePeca")
    .value.trim();

    const altura=parseFloat(
        document.getElementById("alturaPeca").value
    );

    const largura=parseFloat(
        document.getElementById("larguraPeca").value
    );

    const quantidade=parseInt(
        document.getElementById("quantidadePeca").value
    );

    const sentido=
    document.getElementById("sentidoPeca").value;

    const girar=
    document.getElementById("girar").value;

    const espelhar=
    document.getElementById("espelhar").value;

    if(
        nome=="" ||
        isNaN(altura) ||
        isNaN(largura)
    ){

        alert("Preencha todos os campos.");

        return;

    }

    pecas.push({

        nome,

        altura,

        largura,

        quantidade,

        sentido,

        girar,

        espelhar

    });

    atualizarTabela();

    limparFormulario();

}

/*====================================================
    LIMPAR FORMULÁRIO
=====================================================*/

function limparFormulario(){

    document.getElementById("nomePeca").value="";

    document.getElementById("alturaPeca").value="";

    document.getElementById("larguraPeca").value="";

    document.getElementById("quantidadePeca").value=1;

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

            <td>${peca.girar}</td>

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

        pecas.splice(indice,1);

        atualizarTabela();

        calcularPlano();

    }

}

/*====================================================
    DUPLICAR PEÇA
=====================================================*/

function duplicarPeca(indice){

    const copia={...pecas[indice]};

    copia.nome += " (Cópia)";

    pecas.push(copia);

    atualizarTabela();

    calcularPlano();

}

/*====================================================
    EDITAR PEÇA
=====================================================*/

function editarPeca(indice){

    const p=pecas[indice];

    document.getElementById("nomePeca").value=p.nome;

    document.getElementById("alturaPeca").value=p.altura;

    document.getElementById("larguraPeca").value=p.largura;

    document.getElementById("quantidadePeca").value=p.quantidade;

    document.getElementById("sentidoPeca").value=p.sentido;

    document.getElementById("girar").value=p.girar;

    document.getElementById("espelhar").value=p.espelhar;

    pecas.splice(indice,1);

    atualizarTabela();

}

/*====================================================
    LIMPAR PROJETO
=====================================================*/

function limparProjeto(){

    if(!confirm("Deseja limpar todo o projeto?")) return;

    pecas.length=0;

    tabela.innerHTML="";

    areaCorte.innerHTML="";

    metragem.textContent="0,00 m";

    aproveitamento.textContent="0%";

    desperdicio.textContent="0%";

    areaUtilizada.textContent="0 m²";

    limparFormulario();

}
/*====================================================
    CALCULAR PLANO DE CORTE
=====================================================*/

function calcularPlano(){

    larguraTecido=parseFloat(
        document.getElementById("larguraTecido").value
    );

    if(isNaN(larguraTecido) || larguraTecido<=0){

        alert("Informe a largura do tecido.");

        return;

    }

    desenharPlano();

    calcularResultados();

}

/*====================================================
    DESENHAR PLANO
=====================================================*/

function desenharPlano(){

    areaCorte.innerHTML="";

    const larguraPx=larguraTecido*ESCALA;

    areaCorte.style.width=larguraPx+"px";

    let posX=0;

    let posY=0;

    let maiorAlturaLinha=0;

    /* organiza da maior para a menor */

    const lista=[];

    pecas.forEach(p=>{

        for(let i=0;i<p.quantidade;i++){

            lista.push({...p});

        }

    });

    lista.sort((a,b)=>{

        return (b.altura*b.largura)-
               (a.altura*a.largura);

    });

    lista.forEach(peca=>{

        let largura=peca.largura;

        let altura=peca.altura;

        if(peca.sentido==="trama"){

            largura=peca.altura;

            altura=peca.largura;

        }

        const larguraTela=largura*ESCALA;

        const alturaTela=altura*ESCALA;

        if(posX+larguraTela>larguraPx){

            posX=0;

            posY+=maiorAlturaLinha;

            maiorAlturaLinha=0;

        }

        const div=document.createElement("div");

        div.className="peca";

        if(peca.sentido==="enviesado"){

            div.classList.add("enviesado");

        }

        div.style.width=larguraTela+"px";

        div.style.height=alturaTela+"px";

        div.style.left=posX+"px";

        div.style.top=posY+"px";

        div.innerHTML=`

            <strong>${peca.nome}</strong>

            <br>

            ${largura.toFixed(2)} × ${altura.toFixed(2)}

        `;

        areaCorte.appendChild(div);

        posX+=larguraTela;

        if(alturaTela>maiorAlturaLinha){

            maiorAlturaLinha=alturaTela;

        }

    });

    areaCorte.style.height=(posY+maiorAlturaLinha+20)+"px";

}
/*====================================================
    CALCULAR RESULTADOS
=====================================================*/

function calcularResultados(){

    let areaTotal = 0;

    let comprimentoUtilizado = 0;

    pecas.forEach(peca=>{

        areaTotal +=
            (peca.altura *
             peca.largura *
             peca.quantidade);

    });

    comprimentoUtilizado = areaTotal / larguraTecido;

    const margem =
        parseFloat(
            document.getElementById("margem").value
        ) / 100;

    comprimentoUtilizado *= (1 + margem);

    metragem.innerHTML =
        comprimentoUtilizado.toFixed(2) + " m";

    areaUtilizada.innerHTML =
        areaTotal.toFixed(2) + " m²";

    const areaComprada =
        comprimentoUtilizado * larguraTecido;

    let aproveitamentoCalc =
        (areaTotal / areaComprada) * 100;

    if(aproveitamentoCalc > 100){

        aproveitamentoCalc = 100;

    }

    aproveitamento.innerHTML =
        aproveitamentoCalc.toFixed(1) + "%";

    desperdicio.innerHTML =
        (100-aproveitamentoCalc).toFixed(1)+"%";

}

/*====================================================
    SALVAR PROJETO
=====================================================*/

document
.getElementById("btnSalvarProjeto")
.addEventListener("click", salvarProjeto);

function salvarProjeto(){

    localStorage.setItem(

        "pameleteProjeto",

        JSON.stringify({

            largura:
            document.getElementById("larguraTecido").value,

            tecido:
            document.getElementById("nomeTecido").value,

            cor:
            document.getElementById("corTecido").value,

            margem:
            document.getElementById("margem").value,

            pecas

        })

    );

    alert("Projeto salvo com sucesso!");

}

/*====================================================
    CARREGAR PROJETO
=====================================================*/

window.onload = function(){

    const projeto =
        JSON.parse(
            localStorage.getItem("pameleteProjeto")
        );

    if(!projeto) return;

    document.getElementById("larguraTecido").value =
        projeto.largura;

    document.getElementById("nomeTecido").value =
        projeto.tecido;

    document.getElementById("corTecido").value =
        projeto.cor;

    document.getElementById("margem").value =
        projeto.margem;

    pecas.push(...projeto.pecas);

    atualizarTabela();

    calcularPlano();

};
