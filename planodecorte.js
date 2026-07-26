/*====================================================
    PAMELETE CORTE
    Sistema Inteligente de Plano de Corte
=====================================================*/

document.addEventListener("DOMContentLoaded", function () {
    const pecas = [];
    const ESCALA = 180; 
    const tecido = document.getElementById("tecido");
    if (tecido) tecido.style.display = "none";

    const tabela = document.querySelector("#tabelaPecas tbody");
    const areaCorte = document.getElementById("areaCorte");
    const metragem = document.getElementById("metragem");
    const desperdicio = document.getElementById("desperdicio");

    // Botões
    const btnAdicionar = document.getElementById("btnAdicionar");
    const btnCalcular = document.getElementById("btnCalcular");
    const btnLimpar = document.getElementById("btnLimpar");
    const btnImprimir = document.getElementById("btnImprimir");
    const btnSalvarProjeto = document.getElementById("btnSalvarProjeto");

    if (btnAdicionar) btnAdicionar.addEventListener("click", salvarPeca);
    if (btnCalcular) btnCalcular.addEventListener("click", calcularPlano);
    if (btnLimpar) btnLimpar.addEventListener("click", limparProjeto);
    if (btnImprimir) btnImprimir.addEventListener("click", () => window.print());
    if (btnSalvarProjeto) btnSalvarProjeto.addEventListener("click", salvarProjeto);

    // Carregar projeto salvo ao iniciar
    const projetoSalvo = localStorage.getItem("pameleteProjeto");
    if (projetoSalvo) {
        try {
            const projeto = JSON.parse(projetoSalvo);
            if (projeto.largura) document.getElementById("larguraTecido").value = projeto.largura;
            if (projeto.margem) document.getElementById("margem").value = projeto.margem;
            if (projeto.pecas) {
                pecas.push(...projeto.pecas);
                atualizarTabela();
            }
        } catch (e) {
            console.error("Erro ao carregar projeto salvo:", e);
        }
    }

    function salvarPeca(){
        const nomeInput = document.getElementById("nomePeca");
        const alturaInput = document.getElementById("alturaPeca");
        const larguraInput = document.getElementById("larguraPeca");
        const quantidadeInput = document.getElementById("quantidadePeca");
        const sentidoInput = document.getElementById("sentidoPeca");
        const espelharInput = document.getElementById("espelhar");

        if (!nomeInput || !alturaInput || !larguraInput) {
            alert("Erro: Elementos do formulário não encontrados no HTML.");
            return;
        }

        const nome = nomeInput.value.trim();
        const altura = parseFloat(alturaInput.value);
        const largura = parseFloat(larguraInput.value);
        const quantidade = parseInt(quantidadeInput.value) || 1;
        const sentido = sentidoInput ? sentidoInput.value : "ourela";
        const espelhar = espelharInput ? espelharInput.value : "nao";

        if(nome === "" || isNaN(altura) || isNaN(largura)) {
            alert("Preencha todos os campos corretamente (Nome, Altura e Largura).");
            return;
        }

        pecas.push({ nome, altura, largura, quantidade, sentido, espelhar });

        atualizarTabela();
        limparFormulario();
    }

    function limparFormulario(){
        document.getElementById("nomePeca").value = "";
        document.getElementById("alturaPeca").value = "";
        document.getElementById("larguraPeca").value = "";
        document.getElementById("quantidadePeca").value = 1;
        document.getElementById("espelhar").value = "nao";
    }

    function atualizarTabela() {
        if (!tabela) return;
        tabela.innerHTML = "";

        pecas.forEach((peca, indice) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${peca.nome} ${peca.espelhar === "sim" ? "(Espelhada)" : ""}</td>
                <td>${peca.altura.toFixed(2)} m</td>
                <td>${peca.largura.toFixed(2)} m</td>
                <td>${peca.quantidade}</td>
                <td>${peca.sentido}</td>
                <td>
                    <button type="button" onclick="window.editarPeca(${indice})"><i class="fa-solid fa-pen"></i></button>
                    <button type="button" onclick="window.duplicarPeca(${indice})"><i class="fa-solid fa-copy"></i></button>
                    <button type="button" onclick="window.removerPeca(${indice})"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            tabela.appendChild(tr);
        });
    }

    window.removerPeca = function(indice){
        if(confirm("Remover esta peça?")){
            pecas.splice(indice, 1);
            atualizarTabela();
            calcularPlano();
        }
    };

    window.duplicarPeca = function(indice){
        const copia = {...pecas[indice]};
        copia.nome += " (Cópia)";
        pecas.push(copia);
        atualizarTabela();
        calcularPlano();
    };

    window.editarPeca = function(indice){
        const p = pecas[indice];
        document.getElementById("nomePeca").value = p.nome;
        document.getElementById("alturaPeca").value = p.altura;
        document.getElementById("larguraPeca").value = p.largura;
        document.getElementById("quantidadePeca").value = p.quantidade;
        document.getElementById("sentidoPeca").value = p.sentido;
        document.getElementById("espelhar").value = p.espelhar;
        pecas.splice(indice, 1);
        atualizarTabela();
    };

    function limparProjeto(){
        if(!confirm("Deseja limpar todo o projeto?")) return;
        pecas.length = 0;
        tabela.innerHTML = "";
        areaCorte.innerHTML = "";
        tecido.style.display = "none";
        metragem.textContent = "0,00 m";
        if (desperdicio) desperdicio.textContent = "0,00 m";
        limparFormulario();
        localStorage.removeItem("pameleteProjeto");
    }

    function calcularPlano(){
        const larguraTecidoInput = document.getElementById("larguraTecido");
        const larguraTecido = parseFloat(larguraTecidoInput.value);

        if(isNaN(larguraTecido) || larguraTecido <= 0){
            alert("Informe a largura do tecido.");
            return;
        }

        if(pecas.length === 0){
            tecido.style.display = "none";
            return;
        }

        tecido.style.display = "block";
        desenharPlano(larguraTecido);
    }

    function desenharPlano(larguraTecido){
        tecido.style.display = "block";
        areaCorte.innerHTML = ""; 

        const margemInput = document.getElementById("margem");
        const margemCm = parseFloat(margemInput.value) || 0;
        const margemM = margemCm / 100;

        const larguraPx = larguraTecido * ESCALA;
        areaCorte.style.width = larguraPx + "px";

        const lista = [];
        pecas.forEach(p => {
            const qtdEfetiva = p.quantidade;
            for(let i = 0; i < qtdEfetiva; i++){
                lista.push({...p, espelhadoIndividual: false});
                if(p.espelhar === "sim"){
                    lista.push({...p, nome: p.nome + " (Esp.)", espelhadoIndividual: true});
                }
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

            let larguraComMargem = largura + (margemM * 2);
            let alturaComMargem = altura + (margemM * 2);

            let colocou = false;

            for(const linha of linhas){
                if(linha.larguraUsada + larguraComMargem <= larguraTecido){
                    criarElementoPeca(peca, linha.larguraUsada, linha.y, margemM);
                    linha.larguraUsada += larguraComMargem;
                    linha.pecas.push(peca);

                    if(alturaComMargem > linha.alturaMaior){
                        linha.alturaMaior = alturaComMargem;
                    }
                    colocou = true;
                    break;
                }
            }

            if(!colocou){
                criarElementoPeca(peca, 0, y, margemM);
                linhas.push({
                    y,
                    alturaMaior: alturaComMargem,
                    larguraUsada: larguraComMargem,
                    pecas: [peca]
                });
                y += alturaComMargem;
            }
        });

        let comprimentoTotal = 0;
        linhas.forEach(l => {
            comprimentoTotal += l.alturaMaior;
        });

        const alturaFinal = Math.max(220, comprimentoTotal * ESCALA);
        areaCorte.style.height = alturaFinal + "px";

        calcularResultados(comprimentoTotal, larguraTecido, margemM, linhas);
    }

    function criarElementoPeca(peca, x, y, margemM){
        const div = document.createElement("div");
        div.className = "peca";

        if(peca.sentido === "enviesado"){
            div.classList.add("enviesado");
            div.style.transform = "rotate(-45deg)";
        }

        let larguraEfetiva = peca.largura;
        let alturaEfetiva = peca.altura;
        if(peca.sentido === "trama"){
            larguraEfetiva = peca.altura;
            alturaEfetiva = peca.largura;
        }

        const larguraReal = larguraEfetiva * ESCALA;
        const alturaReal = alturaEfetiva * ESCALA;
        const margemPx = margemM * ESCALA;

        div.style.width = larguraReal + "px";
        div.style.height = alturaReal + "px";
        div.style.left = ((x * ESCALA) + margemPx) + "px";
        div.style.top = ((y * ESCALA) + margemPx) + "px";

        const seta = peca.sentido == "ourela" ? "⬆" : peca.sentido == "trama" ? "➡" : "↗";
        const tagEspelhado = peca.espelhadoIndividual ? " (Esp.)" : "";

        div.innerHTML = `
            <div style="font-size:12px"><strong>${peca.nome}${tagEspelhado}</strong></div>
            <div>${seta}</div>
            <div style="font-size:11px">${peca.altura.toFixed(2)} x ${peca.largura.toFixed(2)}</div>
        `;

        areaCorte.appendChild(div);
    }

    function calcularResultados(comprimentoTotal, larguraTecido, margemM, linhas){
        metragem.innerHTML = comprimentoTotal.toFixed(2) + " m";

        let desperdicioTotalMetros = 0;

        // O desperdício lateral de cada linha é exatamente a largura total menos o que a linha usou de largura
        linhas.forEach(linha => {
            let larguraLivre = larguraTecido - linha.larguraUsada;
            if (larguraLivre < 0) larguraLivre = 0;
            desperdicioTotalMetros += larguraLivre;
        });

        // Se houver apenas uma linha principal, pega direto a sobra lateral exata
        if (linhas.length === 1) {
            desperdicioTotalMetros = larguraTecido - linhas[0].larguraUsada;
        }

        if (desperdicio) {
            desperdicio.innerHTML = desperdicioTotalMetros.toFixed(2) + " m";
        }
    }

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
});
