document.getElementById('fabric-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const fabricWidth = parseFloat(document.getElementById('fabricWidth').value);
    const fabricLength = parseFloat(document.getElementById('fabricLength').value);

    const pieces = Array.from(document.querySelectorAll('.piece')).map(piece => ({
        width: parseFloat(piece.children[0].value),
        height: parseFloat(piece.children[1].value)
    }));

    const canvas = document.getElementById('cuttingCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = fabricWidth * 100; // Scale for visualization
    canvas.height = fabricLength * 100;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ccc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let yOffset = 0;
    pieces.forEach(piece => {
        const scaledWidth = piece.width * 100;
        const scaledHeight = piece.height * 100;

        if (yOffset + scaledHeight > canvas.height) {
            alert('O tecido não comporta todas as peças!');
            return;
        }

        ctx.fillStyle = '#007bff';
        ctx.fillRect(0, yOffset, scaledWidth, scaledHeight);

        yOffset += scaledHeight;
    });

    const totalLength = pieces.reduce((acc, piece) => acc + piece.height, 0);

    document.getElementById('result').innerText = `
        Comprimento total necessário: ${totalLength.toFixed(2)} m
        Unidades de tecido (1 m por unidade): ${Math.ceil(totalLength)}
    `;
});

document.getElementById('add-piece').addEventListener('click', () => {
    const container = document.getElementById('pieces-container');
    const newPiece = document.createElement('div');
    newPiece.classList.add('piece');
    newPiece.innerHTML = `
        <input type="number" placeholder="Largura da Peça (m)" step="0.01" required>
        <input type="number" placeholder="Altura da Peça (m)" step="0.01" required>
    `;
    container.appendChild(newPiece);
});
