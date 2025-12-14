// Fibonacci Dizisi Hesaplama ve Görselleştirme

document.addEventListener('DOMContentLoaded', () => {
    const termCountInput = document.getElementById('term-count');
    const calculateBtn = document.getElementById('calculate-btn');
    const fibonacciResult = document.getElementById('fibonacci-result');
    const goldenRatioResult = document.getElementById('golden-ratio-result');
    const drawSpiralBtn = document.getElementById('draw-spiral-btn');
    const clearCanvasBtn = document.getElementById('clear-canvas-btn');
    const canvas = document.getElementById('spiral-canvas');
    const ctx = canvas.getContext('2d');

    // Fibonacci dizisini hesapla
    function calculateFibonacci(n) {
        if (n <= 0) return [];
        if (n === 1) return [0];
        if (n === 2) return [0, 1];
        
        const sequence = [0, 1];
        for (let i = 2; i < n; i++) {
            sequence[i] = sequence[i - 1] + sequence[i - 2];
        }
        return sequence;
    }

    // Fibonacci dizisini göster
    calculateBtn.addEventListener('click', () => {
        const termCount = parseInt(termCountInput.value) || 10;
        const sequence = calculateFibonacci(termCount);
        
        // Diziyi göster
        fibonacciResult.innerHTML = `
            <strong>Fibonacci Dizisi (İlk ${termCount} terim):</strong><br>
            ${sequence.join(', ')}
        `;

        // Altın oran hesaplamalarını göster
        let goldenRatioHTML = '<strong>Altın Oran Hesaplamaları:</strong><br>';
        for (let i = 2; i < sequence.length && i < 15; i++) {
            if (sequence[i - 1] !== 0) {
                const ratio = (sequence[i] / sequence[i - 1]).toFixed(6);
                goldenRatioHTML += `F(${i}) / F(${i - 1}) = ${sequence[i]} / ${sequence[i - 1]} = ${ratio}<br>`;
            }
        }
        goldenRatioHTML += '<br><strong>Altın Oran (φ) ≈ 1.618034</strong>';
        goldenRatioResult.innerHTML = goldenRatioHTML;
    });

    // İlk yüklemede hesapla
    calculateBtn.click();

    // Fibonacci spiralini çiz
    drawSpiralBtn.addEventListener('click', () => {
        drawFibonacciSpiral();
    });

    // Canvas'ı temizle
    clearCanvasBtn.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // Fibonacci spiralini çiz
    function drawFibonacciSpiral() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const scale = 3; // Ölçek faktörü
        
        const sequence = calculateFibonacci(15);
        let x = centerX;
        let y = centerY;
        let angle = 0;
        
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 2;
        ctx.fillStyle = 'rgba(102, 126, 234, 0.1)';
        
        // Her kare için spiral çiz
        for (let i = 1; i < sequence.length && i < 12; i++) {
            const size = sequence[i] * scale;
            
            // Kare çiz
            ctx.beginPath();
            ctx.rect(x, y, size, size);
            ctx.stroke();
            ctx.fill();
            
            // Spiral yayı çiz
            ctx.beginPath();
            ctx.arc(x + size, y, size, Math.PI, Math.PI * 1.5);
            ctx.stroke();
            
            // Bir sonraki pozisyon için güncelle
            if (i % 4 === 1) {
                x -= sequence[i - 1] * scale;
            } else if (i % 4 === 2) {
                y -= sequence[i - 1] * scale;
            } else if (i % 4 === 3) {
                x += sequence[i - 1] * scale;
            } else {
                y += sequence[i - 1] * scale;
            }
        }
        
        // Spiral çizgisi
        ctx.strokeStyle = '#764ba2';
        ctx.lineWidth = 3;
        x = centerX;
        y = centerY;
        angle = 0;
        
        for (let i = 1; i < sequence.length && i < 12; i++) {
            const size = sequence[i] * scale;
            const startAngle = angle;
            const endAngle = angle + Math.PI / 2;
            
            ctx.beginPath();
            ctx.arc(x + size, y, size, startAngle, endAngle);
            ctx.stroke();
            
            // Bir sonraki pozisyon
            if (i % 4 === 1) {
                x -= sequence[i - 1] * scale;
                angle += Math.PI / 2;
            } else if (i % 4 === 2) {
                y -= sequence[i - 1] * scale;
                angle += Math.PI / 2;
            } else if (i % 4 === 3) {
                x += sequence[i - 1] * scale;
                angle += Math.PI / 2;
            } else {
                y += sequence[i - 1] * scale;
                angle += Math.PI / 2;
            }
        }
    }
});

