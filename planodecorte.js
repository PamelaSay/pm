document.getElementById('add-piece').addEventListener('click', function () {
    const container = document.getElementById('pieces-container');
    const pieceCount = container.children.length + 1;

    const pieceDiv = document.createElement('div');
    pieceDiv.className = 'piece';
    pieceDiv.innerHTML = `
        <label>Peça ${pieceCount} - Largura:</label>
        <input type="text" class="piece-width" placeholder="Ex: 0,80">
        <label>Altura:</label>
        <input type="text" class="piece-height" placeholder="Ex: 1,20">
        <button type="button" class="remove-piece">Remover</button>
    `;

    container.appendChild(pieceDiv);

    // Adicionar funcionalidade de remoção
    pieceDiv.querySelector('.remove-piece').addEventListener('click', function () {
        pieceDiv.remove();
    });
});

document.getElementById('fabric-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const fabricWidth = parseFloat(document.getElementById('fabricWidth').value.replace(',', '.'));
    const fabricLength = parseFloat(document.getElementById('fabricLength').value.replace(',', '.'));

    const pieces = Array.from(document.querySelectorAll('.piece')).map((piece, index) => ({
        width: parseFloat(piece.querySelector('.piece-width').value.replace(',', '.')),
        height: parseFloat(piece.querySelector('.piece-height').value.replace(',', '.')),
        id: index + 1
    }));

    const canvas = document.getElementById('cuttingCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = fabricWidth * 100;
    canvas.height = fabricLength * 100;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let yOffset = 0;
    let success = true;

    pieces.forEach(piece => {
        const scaledWidth = piece.width * 100;
        const scaledHeight = piece.height * 100;

        if (yOffset + scaledHeight > canvas.height) {
            success = false;
            return;
        }

        ctx.fillStyle = '#007bff';
        ctx.fillRect(0, yOffset, scaledWidth, scaledHeight);

        ctx.strokeStyle = '#000';
        ctx.strokeRect(0, yOffset, scaledWidth, scaledHeight);

        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.fillText(`${piece.width}m x ${piece.height}m`, 10, yOffset + 20);

        yOffset += scaledHeight;
    });

    if (!success) {
        document.getElementById('result').innerText = 'O tecido não comporta todas as peças. Ajuste o plano de corte ou aumente o tecido.';
    } else {
        const totalLength = pieces.reduce((acc, piece) => acc + piece.height, 0);
        document.getElementById('result').innerText = `
            Comprimento total necessário: ${totalLength.toFixed(2)} m
            Unidades de tecido (1 m por unidade): ${Math.ceil(totalLength)}
        `;
    }
});

document.getElementById('reset').addEventListener('click', () => {
    const canvas = document.getElementById('cuttingCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById('result').innerText = '';
    const piecesContainer = document.getElementById('pieces-container');
    piecesContainer.innerHTML = `
        <div class="piece">
            <label>Peça 1 - Largura:</label>
            <input type="text" class="piece-width" placeholder="Ex: 0,80">
            <label>Altura:</label>
            <input type="text" class="piece-height" placeholder="Ex: 1,20">
            <button type="button" class="remove-piece">Remover</button>
        </div>
    `;
});

