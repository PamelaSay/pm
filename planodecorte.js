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
    }

    function atualizarTabela() {
        if (!tabela) return;
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
        desperdicio.textContent = "0%";
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
        const margem = parseFloat(margemInput.value) / 100 || 0;
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
                    criarElementoPeca(peca, linha.larguraUsada, linha.y, margem);
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
                criarElementoPeca(peca, 0, y, margem);
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

    function criarElementoPeca(peca, x, y, margem){
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
