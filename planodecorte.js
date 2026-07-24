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

    let alturaTotalNecessariaPx = posY + maiorAlturaNaLinha + 40;
    if (alturaTotalNecessariaPx < 400) alturaTotalNecessariaPx = 400;
    conteudoDiv.style.height = alturaTotalNecessariaPx + "px";
}
