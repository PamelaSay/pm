// Variáveis globais para armazenar os dados do plano de corte
let larguraTecido = 0; // Largura padrão inicial de ourela a ourela em metros
let MARGEM_SEGURANÇA = 0.02; // 2 cm de margem padrão
let pecas = [];

// Função para atualizar as dimensões principais do tecido a partir do input correto
function atualizarTecido() {
    const inputLargura = document.getElementById("larguraTecido");
    if (inputLargura) {
        larguraTecido = parseFloat(inputLargura.value) || 0;
    }
    atualizarPlanoDeCorte();
}

// Função para resetar e iniciar um novo plano do zero sem precisar recarregar a página
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

// Função principal que renderiza o plano de corte e calcula o posicionamento das peças
function atualizarPlanoDeCorte() {
    const tecidoDiv = document.getElementById("tecido");
    const conteudoDiv = document.getElementById("conteudo-tecido");
    const resultadoDiv = document.getElementById("resultado");
    
    if (!conteudoDiv || !tecidoDiv) return;

    conteudoDiv.innerHTML = ''; 

    // Se a largura for inválida, reseta
    if (larguraTecido <= 0) {
        tecidoDiv.style.width = "100%";
        conteudoDiv.style.height = "50px"; 
        if (resultadoDiv) {
            resultadoDiv.innerText = "Defina a largura da ourela e adicione as peças para ver a metragem necessária.";
        }
        return;
    }

    const escala = 120; // Escala visual (1 metro = 120px)
    const larguraTelaTecido = larguraTecido * escala;
    
    tecidoDiv.style.width = (larguraTelaTecido + 64) + "px";
    conteudoDiv.style.width = larguraTelaTecido + "px";

    const larguraUtilPx = larguraTelaTecido;
    const margemPx = MARGEM_SEGURANÇA * escala;
    const metadeMargem = margemPx / 2;

    let posX = 0;
    let posY = 0;
    let maiorAlturaNaLinha = 0;

    // Se não houver peças na lista, define uma altura mínima inicial limpa
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

            // Tratamento para o sentido do fio
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

            // Quebra de linha se ultrapassar a largura útil do tecido
            if (posX + larguraComMargemPx > larguraUtilPx + 0.1) {
                posX = 0;
                posY += maiorAlturaNaLinha;
                maiorAlturaNaLinha = 0;
            }

            // Posiciona a peça no plano
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

    // Calcula a altura total necessária
    let alturaTotalNecessariaPx = posY + maiorAlturaNaLinha;
    if (alturaTotalNecessariaPx < 50) {
        alturaTotalNecessariaPx = 50;
    }

    // Aplica a altura calculada no conteúdo e nas ourelas laterais
    conteudoDiv.style.height = alturaTotalNecessariaPx + "px";
    
    const faixasOurela = tecidoDiv.querySelectorAll('.faixa-ourelha');
    faixasOurela.forEach(faixa => {
        faixa.style.height = alturaTotalNecessariaPx + "px";
    });

    // Converte altura de pixels para metros para exibir no rodapé
    const metrosNecessarios = (alturaTotalNecessariaPx / escala).toFixed(2);
    if (resultadoDiv) {
        resultadoDiv.innerHTML = `Metragem linear necessária de tecido: <strong>${metrosNecessarios} metros</strong> (com largura de ${larguraTecido}m).`;
    }
}

// Função para salvar (Adicionar ou Atualizar) peça a partir do formulário
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
    const sentido = sentidoInput ? sentidoInput.value : "ourelha";

    if (isNaN(altura) || isNaN(largura) || altura <= 0 || largura <= 0) {
        alert("Por favor, insira medidas válidas de altura e largura.");
        return;
    }

    const indice = indiceInput.value;

    if (indice === "") {
        // Adiciona nova peça
        pecas.push({ nome, altura, largura, quantidade, sentido });
    } else {
        // Atualiza peça existente
        pecas[parseInt(indice)] = { nome, altura, largura, quantidade, sentido };
        cancelarEdicao();
    }

    // Limpa os campos após salvar
    nomeInput.value = "";
    alturaInput.value = "";
    larguraInput.value = "";
    quantidadeInput.value = "1";
    if (sentidoInput) sentidoInput.value = "ourelha";

    atualizarTabelaPecas();
    atualizarPlanoDeCorte();
}

// Atualiza a tabela HTML com a lista de peças cadastradas
function atualizarTabelaPecas() {
    const tbody = document.querySelector("#tabelaPecas tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    pecas.forEach((peca, index) => {
        const tr = document.createElement("tr");

        let textoSentido = "Normal (Urdume)";
        if (peca.sentido === "trama") textoSentido = "Trama (Transversal)";
        if (peca.sentido === "enviesado") textoSentido = "Enviesado (45°)";

        tr.innerHTML = `
            <td>${peca.nome}</td>
            <td>${peca.altura}</td>
            <td>${peca.largura}</td>
            <td>${textoSentido}</td>
            <td>${peca.quantidade}</td>
            <td>
                <button onclick="editarPeca(${index})" title="Editar"><i class="fa-solid fa-pen"></i></button>
                <button onclick="removerPeca(${index})" title="Excluir" style="background-color: #e53e3e; color: white;"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Carrega os dados de uma peça na tela para edição
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

// Cancela o modo de edição
function cancelarEdicao() {
    document.getElementById("indiceEdicao").value = "";
    document.getElementById("nomePeca").value = "";
    document.getElementById("alturaPeca").value = "";
    document.getElementById("larguraPeca").value = "";
    document.getElementById("quantidadePeca").value = "1";
    document.getElementById("sentidoPeca").value = "ourelha";

    document.getElementById("tituloFormulario").innerText = "Adicionar Peça";
    document.getElementById("btnSalvar").innerText = "Adicionar Peça";
    document.getElementById("btnCancelar").style.display = "none";
}

// Remove uma peça da lista
function removerPeca(index) {
    pecas.splice(index, 1);
    atualizarTabelaPecas();
    atualizarPlanoDeCorte();
}

// Função de impressão do plano
function imprimirPlano() {
    window.print();
}
