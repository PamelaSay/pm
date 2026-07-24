// Variáveis globais para armazenar os dados do plano de corte
let larguraTecido = 1.50; // Largura padrão inicial de ourela a ourela em metros
let MARGEM_SEGURANÇA = 0.02; // 2 cm de margem padrão
let pecas = [];

// Função para atualizar as dimensões principais do tecido
function atualizarTecido() {
    const inputLargura = document.getElementById("larguraTecido");
    if (inputLargura) {
        larguraTecido = parseFloat(inputLargura.value) || 1.50;
    }
    atualizarPlanoDeCorte();
}

// Função principal que renderiza o plano de corte e calcula o posicionamento das peças
function atualizarPlanoDeCorte() {
    const tecidoDiv = document.getElementById("tecido");
    const conteudoDiv = document.getElementById("conteudo-tecido");
    
    if (!conteudoDiv || !tecidoDiv) return;

    conteudoDiv.innerHTML = ''; 

    // Se a largura for inválida, reseta
    if (larguraTecido <= 0) {
        tecidoDiv.style.width = "100%";
        conteudoDiv.style.height = "50px"; 
        return;
    }

    const escala = 120; // Escala visual (1 metro = 120px)
    const larguraTelaTecido = larguraTecido * escala;
    
    tecidoDiv.style.width = (larguraTelaTecido + 64) + "px";
    conteudoDiv.style.width = larguraTelaTecido + "px";

    const larguraUtilPx = larguraTelaTecido;
    const margemPx = MARGEM_SEGURANÇA * escala;

    let posX = 0;
    let posY = 0;
    let maiorAlturaNaLinha = 0;

    // Se não houver peças na lista, define uma altura mínima inicial limpa
    if (pecas.length === 0) {
        conteudoDiv.style.height = "50px";
        const faixasOurela = tecidoDiv.querySelectorAll('.faixa-ourelha');
        faixasOurela.forEach(faixa => faixa.style.height = "50px");
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

            const margemVisualPeca = (peca.sentido === "enviesado") ? 120 : 6;
            const larguraComMargemPx = larguraPx + margemPx + margemVisualPeca;
            const alturaComMargemPx = alturaPx + margemPx + margemVisualPeca;

            pecaDiv.style.width = larguraPx + "px";
            pecaDiv.style.height = alturaPx + "px";
            pecaDiv.innerText = `${peca.nome}`;

            // Quebra de linha se ultrapassar a largura útil do tecido
            if (posX + larguraComMargemPx > larguraUtilPx + 1) {
                posX = 0;
                posY += maiorAlturaNaLinha;
                maiorAlturaNaLinha = 0;
            }

            // Posiciona a peça no plano
            pecaDiv.style.left = (posX + (margemPx / 2) + 3) + "px";
            pecaDiv.style.top = (posY + (margemPx / 2) + 3) + "px";

            if (alturaComMargemPx > maiorAlturaNaLinha) {
                maiorAlturaNaLinha = alturaComMargemPx;
            }

            posX += larguraComMargemPx;
            conteudoDiv.appendChild(pecaDiv);
        }
    });

    // Pega a altura exata da última peça adicionada, sem sobras de margem inferior
    let alturaTotalNecessariaPx = 0;
    
    if (pecas.length > 0 && conteudoDiv.lastElementChild) {
        const ultimaPeca = conteudoDiv.lastElementChild;
        // A altura total é a posição do topo da última peça mais a altura dela própria
        alturaTotalNecessariaPx = ultimaPeca.offsetTop + ultimaPeca.offsetHeight;
    } else {
        alturaTotalNecessariaPx = 50;
    }

    // Aplica o tamanho exato no tecido e nas ourelas
    conteudoDiv.style.height = alturaTotalNecessariaPx + "px";
    
    const faixasOurela = tecidoDiv.querySelectorAll('.faixa-ourelha');
    faixasOurela.forEach(faixa => {
        faixa.style.height = alturaTotalNecessariaPx + "px";
    });
}

// Função para adicionar nova peça capturando os dados do formulário
function adicionarPeca(event) {
    if (event) event.preventDefault();

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
    const sentido = sentidoInput ? sentidoInput.value : "urdume";

    if (isNaN(altura) || isNaN(largura) || altura <= 0 || largura <= 0) {
        alert("Por favor, insira medidas válidas de altura e largura.");
        return;
    }

    pecas.push({ nome, altura, largura, quantidade, sentido });

    // Limpa os campos após adicionar
    nomeInput.value = "";
    alturaInput.value = "";
    larguraInput.value = "";
    quantidadeInput.value = "1";

    atualizarPlanoDeCorte();
}

// Função para limpar todo o plano de corte e iniciar um novo
function novoPlanoDeCorte() {
    if (confirm("Deseja iniciar um novo plano de corte? Isso apagará todas as peças atuais.")) {
        pecas = [];

        const nomeInput = document.getElementById("nomePeca");
        const alturaInput = document.getElementById("alturaPeca");
        const larguraInput = document.getElementById("larguraPeca");
        const quantidadeInput = document.getElementById("quantidadePeca");

        if (nomeInput) nomeInput.value = "";
        if (alturaInput) alturaInput.value = "";
        if (larguraInput) larguraInput.value = "";
        if (quantidadeInput) quantidadeInput.value = "1";

        atualizarPlanoDeCorte();
    }
}
