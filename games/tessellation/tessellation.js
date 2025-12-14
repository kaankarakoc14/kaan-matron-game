// Tessellation (Mozaik) Oluşturucu

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('tessellation-canvas');
    const ctx = canvas.getContext('2d');
    let currentPattern = 'square';
    let color1 = '#667eea';
    let color2 = '#764ba2';
    let size = 50;

    const patternButtons = document.querySelectorAll('.pattern-btn');
    patternButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            currentPattern = btn.dataset.pattern;
            patternButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            drawTessellation();
        });
    });

    document.getElementById('color1').addEventListener('change', (e) => {
        color1 = e.target.value;
        drawTessellation();
    });

    document.getElementById('color2').addEventListener('change', (e) => {
        color2 = e.target.value;
        drawTessellation();
    });

    const sizeSlider = document.getElementById('size');
    const sizeValue = document.getElementById('size-value');
    sizeSlider.addEventListener('input', (e) => {
        size = parseInt(e.target.value);
        sizeValue.textContent = size;
        drawTessellation();
    });

    document.getElementById('draw-btn').addEventListener('click', () => {
        drawTessellation();
    });

    document.getElementById('clear-btn').addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    function drawTessellation() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        switch (currentPattern) {
            case 'square':
                drawSquareTessellation();
                break;
            case 'triangle':
                drawTriangleTessellation();
                break;
            case 'hexagon':
                drawHexagonTessellation();
                break;
        }
    }

    function drawSquareTessellation() {
        const cols = Math.ceil(canvas.width / size);
        const rows = Math.ceil(canvas.height / size);

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = col * size;
                const y = row * size;
                const isEven = (row + col) % 2 === 0;
                
                ctx.fillStyle = isEven ? color1 : color2;
                ctx.fillRect(x, y, size, size);
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 1;
                ctx.strokeRect(x, y, size, size);
            }
        }
    }

    function drawTriangleTessellation() {
        const triangleHeight = size * Math.sqrt(3) / 2;
        const cols = Math.ceil(canvas.width / size);
        const rows = Math.ceil(canvas.height / triangleHeight);

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = col * size + (row % 2) * (size / 2);
                const y = row * triangleHeight;
                const isEven = (row + col) % 2 === 0;
                
                ctx.fillStyle = isEven ? color1 : color2;
                ctx.beginPath();
                ctx.moveTo(x + size / 2, y);
                ctx.lineTo(x, y + triangleHeight);
                ctx.lineTo(x + size, y + triangleHeight);
                ctx.closePath();
                ctx.fill();
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }

    function drawHexagonTessellation() {
        const hexSize = size;
        const hexWidth = hexSize * Math.sqrt(3);
        const hexHeight = hexSize * 2;
        const cols = Math.ceil(canvas.width / (hexWidth * 0.75));
        const rows = Math.ceil(canvas.height / (hexHeight * 0.5));

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = col * hexWidth * 0.75 + (row % 2) * hexWidth * 0.375;
                const y = row * hexHeight * 0.5;
                const isEven = (row + col) % 2 === 0;
                
                ctx.fillStyle = isEven ? color1 : color2;
                drawHexagon(ctx, x + hexWidth / 2, y + hexSize, hexSize);
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }

    function drawHexagon(ctx, centerX, centerY, size) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const x = centerX + size * Math.cos(angle);
            const y = centerY + size * Math.sin(angle);
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.fill();
    }

    // İlk yüklemede çiz
    drawTessellation();
});

