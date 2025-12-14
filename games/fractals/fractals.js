// Fraktal Çizim Uygulaması

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('fractal-canvas');
    const ctx = canvas.getContext('2d');
    let currentFractal = 'sierpinski';
    let depth = 4;

    const sierpinskiBtn = document.getElementById('sierpinski-btn');
    const kochBtn = document.getElementById('koch-btn');
    const treeBtn = document.getElementById('tree-btn');
    const depthSlider = document.getElementById('depth');
    const depthValue = document.getElementById('depth-value');
    const drawBtn = document.getElementById('draw-btn');
    const clearBtn = document.getElementById('clear-btn');

    // Fraktal seçimi
    sierpinskiBtn.addEventListener('click', () => {
        currentFractal = 'sierpinski';
        updateActiveButton(sierpinskiBtn);
        drawFractal();
    });

    kochBtn.addEventListener('click', () => {
        currentFractal = 'koch';
        updateActiveButton(kochBtn);
        drawFractal();
    });

    treeBtn.addEventListener('click', () => {
        currentFractal = 'tree';
        updateActiveButton(treeBtn);
        drawFractal();
    });

    function updateActiveButton(activeBtn) {
        [sierpinskiBtn, kochBtn, treeBtn].forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }

    // Derinlik değişimi
    depthSlider.addEventListener('input', (e) => {
        depth = parseInt(e.target.value);
        depthValue.textContent = depth;
    });

    // Çiz butonu
    drawBtn.addEventListener('click', () => {
        drawFractal();
    });

    // Temizle butonu
    clearBtn.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // Fraktal çiz
    function drawFractal() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 2;

        switch (currentFractal) {
            case 'sierpinski':
                drawSierpinski();
                break;
            case 'koch':
                drawKoch();
                break;
            case 'tree':
                drawTree();
                break;
        }
    }

    // Sierpinski Üçgeni
    function drawSierpinski() {
        const size = Math.min(canvas.width, canvas.height) * 0.8;
        const x = canvas.width / 2;
        const y = canvas.height / 2 + size / 3;
        
        const p1 = { x: x, y: y - size * 0.577 };
        const p2 = { x: x - size / 2, y: y };
        const p3 = { x: x + size / 2, y: y };
        
        sierpinskiTriangle(p1, p2, p3, depth);
    }

    function sierpinskiTriangle(p1, p2, p3, level) {
        if (level === 0) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.closePath();
            ctx.stroke();
            return;
        }

        const mid1 = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
        const mid2 = { x: (p2.x + p3.x) / 2, y: (p2.y + p3.y) / 2 };
        const mid3 = { x: (p1.x + p3.x) / 2, y: (p1.y + p3.y) / 2 };

        sierpinskiTriangle(p1, mid1, mid3, level - 1);
        sierpinskiTriangle(mid1, p2, mid2, level - 1);
        sierpinskiTriangle(mid3, mid2, p3, level - 1);
    }

    // Koch Kar Tanesi
    function drawKoch() {
        const size = Math.min(canvas.width, canvas.height) * 0.6;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        const angle = -Math.PI / 2;
        const x1 = centerX + size * Math.cos(angle);
        const y1 = centerY + size * Math.sin(angle);
        const x2 = centerX + size * Math.cos(angle + 2 * Math.PI / 3);
        const y2 = centerY + size * Math.sin(angle + 2 * Math.PI / 3);
        const x3 = centerX + size * Math.cos(angle + 4 * Math.PI / 3);
        const y3 = centerY + size * Math.sin(angle + 4 * Math.PI / 3);

        ctx.beginPath();
        kochLine(x1, y1, x2, y2, depth);
        kochLine(x2, y2, x3, y3, depth);
        kochLine(x3, y3, x1, y1, depth);
        ctx.stroke();
    }

    function kochLine(x1, y1, x2, y2, level) {
        if (level === 0) {
            ctx.lineTo(x2, y2);
            return;
        }

        const dx = x2 - x1;
        const dy = y2 - y1;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        const x3 = x1 + dx / 3;
        const y3 = y1 + dy / 3;
        const x4 = x1 + 2 * dx / 3;
        const y4 = y1 + 2 * dy / 3;

        const x5 = x3 + (dist / 3) * Math.cos(angle + Math.PI / 3);
        const y5 = y3 + (dist / 3) * Math.sin(angle + Math.PI / 3);

        kochLine(x1, y1, x3, y3, level - 1);
        kochLine(x3, y3, x5, y5, level - 1);
        kochLine(x5, y5, x4, y4, level - 1);
        kochLine(x4, y4, x2, y2, level - 1);
    }

    // Fraktal Ağaç
    function drawTree() {
        const startX = canvas.width / 2;
        const startY = canvas.height - 50;
        const length = 100;
        const angle = -Math.PI / 2;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        drawBranch(startX, startY, length, angle, depth);
        ctx.stroke();
    }

    function drawBranch(x, y, length, angle, level) {
        if (level === 0) return;

        const endX = x + length * Math.cos(angle);
        const endY = y + length * Math.sin(angle);

        ctx.lineTo(endX, endY);

        const newLength = length * 0.7;
        const angle1 = angle - Math.PI / 6;
        const angle2 = angle + Math.PI / 6;

        drawBranch(endX, endY, newLength, angle1, level - 1);
        ctx.moveTo(endX, endY);
        drawBranch(endX, endY, newLength, angle2, level - 1);
    }

    // İlk yüklemede çiz
    drawFractal();
});

