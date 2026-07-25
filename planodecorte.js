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
