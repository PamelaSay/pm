let pecas = [];
const MARGEM_COSTURA = 2; // 2 cm ao redor

function gerarNovoPlano() {
    if(confirm("Deseja limpar todas as peças e iniciar um novo plano?")) {
        pecas = [];
        document.getElementById('larguraTecido').value = 140;
        atualizarInterface();
    }
}

function salvarPeca() {
    const nome = document.getElementById('nomePeca').value;
    const largura = parseFloat(document.getElementById('larguraPeca').value);
    const altura = parseFloat(document.getElementById('alturaPeca').value);
    const sentido = document.getElementById('sentidoFio').value;
    const editIndex = parseInt(document.getElementById('editIndex').value);

    if(!nome || !largura || !altura) {
        alert("Por favor, preencha todos os campos da peça.");
        return;
    }

    const pecaObj = { nome, largura, altura, sentido };

    if(editIndex === -1) {
        pecas.push(pecaObj);
    } else {
        pecas[editIndex] = pecaObj;
        document.getElementById('editIndex').value = -1;
    }

    limparFormularioPeca();
    atualizarInterface();
}

function limparFormularioPeca() {
    document.getElementById('nomePeca').value = '';
    document.getElementById('larguraPeca').value = '';
    document.getElementById('alturaPeca').value = '';
    document.getElementById('editIndex').value = '-1';
}

function editarPeca(index) {
    const p = pecas[index];
    document.getElementById('nomePeca').value = p.nome;
    document.getElementById('larguraPeca').value = p.largura;
    document.getElementById('alturaPeca').value = p.altura;
    document.getElementById('sentidoFio').value = p.sentido;
    document.getElementById('editIndex').value = index;
    window.scrollTo({ top: 200, behavior: 'smooth' });
}

function duplicarPeca(index) {
    const p = {...pecas[index]};
    p.nome += " (Cópia)";
    pecas.push(p);
    atualizarInterface();
}

function removerPeca(index) {
    pecas.splice(index, 1);
    atualizarInterface();
}

function atualizarInterface() {
    const tbody = document.getElementById('tabelaPecasBody');
    tbody.innerHTML = '';

    if(pecas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #888;">Nenhuma peça adicionada ainda.</td></tr>`;
        document.getElementById('corte-visual').innerHTML = `<span style="color: #999; font-size: 0.9rem;">Adicione peças para visualizar o encaixe no tecido</span>`;
        document.getElementById('resultadoCompra').innerHTML = `<strong>Quantidade de Tecido Necessária:</strong> 0 cm (0.00 metros)`;
        return;
    }

    let htmlTabela = '';
    let alturaTotalCalculada = 0;
    let larguraTecido = parseFloat(document.getElementById('larguraTecido').value) || 140;

    pecas.forEach((p, index) => {
        let larguraComMargem = p.largura + (MARGEM_COSTURA * 2);
        let alturaComMargem = p.altura + (MARGEM_COSTURA * 2);

        htmlTabela += `
            <tr>
                <td><strong>${p.nome}</strong></td>
                <td>${larguraComMargem} cm x ${alturaComMargem} cm <br><small style="color:#777;">(Peça: ${p.largura}x${p.altura} + 4cm margem)</small></td>
                <td>${p.sentido}</td>
                <td>
                    <div class="action-btns">
                        <button class="btn-icon btn-edit" title="Editar" onclick="editarPeca(${index})">✏️</button>
                        <button class="btn-icon btn-duplicate" title="Duplicar" onclick="duplicarPeca(${index})">📋</button>
                        <button class="btn-icon btn-remove" title="Remover" onclick="removerPeca(${index})">🗑️</button>
                    </div>
                </td>
            </tr>;

        alturaTotalCalculada += alturaComMargem;
    });

    tbody.innerHTML = htmlTabela;

    let visualHtml = '';
    let posicaoY = 10;
    
    pecas.forEach((p, index) => {
        let altM = p.altura + (MARGEM_COSTURA * 2);
        let largM = p.largura + (MARGEM_COSTURA * 2);
        
        visualHtml += `
            <div class="peca-no-plano" style="width: ${Math.min(largM * 1.5, 200)}px; height: ${Math.min(altM * 0.8, 80)}px; top: ${posicaoY}px; left: ${10 + (index * 30) % 200}px;">
                <strong>${p.nome}</strong>
                <span>${largM}x${altM}cm</span>
            </div>;
        posicaoY += 20;
    });

    document.getElementById('corte-visual').innerHTML = visualHtml;

    let metrosNecessarios = (alturaTotalCalculada / 100).toFixed(2);
    document.getElementById('resultadoCompra').innerHTML = `
        <strong>Quantidade de Tecido Necessária:</strong> ${alturaTotalCalculada} cm (${metrosNecessarios} metros) 
        <br><small style="font-weight: normal; color: #666;">Considerando largura útil de ${larguraTecido} cm com margens de costura inclusas.</small>;
}
