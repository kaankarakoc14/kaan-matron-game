// Olasılık ve İstatistik Simülatörü

document.addEventListener('DOMContentLoaded', () => {
    // Tab yönetimi
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });

    // Zar Atma Simülatörü
    const rollDiceBtn = document.getElementById('roll-dice-btn');
    rollDiceBtn.addEventListener('click', () => {
        const count = parseInt(document.getElementById('dice-count').value) || 100;
        simulateDice(count);
    });

    function simulateDice(count) {
        const results = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
        
        for (let i = 0; i < count; i++) {
            const roll = Math.floor(Math.random() * 6) + 1;
            results[roll]++;
        }

        displayDiceResults(results, count);
        drawDiceChart(results, count);
    }

    function displayDiceResults(results, total) {
        const resultDiv = document.getElementById('dice-results');
        let html = '<strong>Zar Atma Sonuçları:</strong><br>';
        
        for (let i = 1; i <= 6; i++) {
            const count = results[i];
            const percentage = ((count / total) * 100).toFixed(2);
            const expected = (total / 6).toFixed(2);
            html += `${i}: ${count} kez (${percentage}%) - Beklenen: ${expected} (16.67%)<br>`;
        }
        
        resultDiv.innerHTML = html;
    }

    function drawDiceChart(results, total) {
        const canvas = document.getElementById('dice-chart');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = 80;
        const maxHeight = 300;
        const startX = 50;
        const startY = 350;
        const spacing = 20;

        ctx.fillStyle = '#f5576c';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';

        for (let i = 1; i <= 6; i++) {
            const count = results[i];
            const height = (count / total) * maxHeight;
            const x = startX + (i - 1) * (barWidth + spacing);
            
            ctx.fillRect(x, startY - height, barWidth, height);
            ctx.fillStyle = '#333';
            ctx.fillText(i, x + barWidth / 2, startY + 20);
            ctx.fillText(count, x + barWidth / 2, startY - height - 10);
            ctx.fillStyle = '#f5576c';
        }
    }

    // Para Atma Simülatörü
    const flipCoinBtn = document.getElementById('flip-coin-btn');
    flipCoinBtn.addEventListener('click', () => {
        const count = parseInt(document.getElementById('coin-count').value) || 100;
        simulateCoin(count);
    });

    function simulateCoin(count) {
        let heads = 0;
        let tails = 0;
        
        for (let i = 0; i < count; i++) {
            const flip = Math.random() < 0.5 ? 'heads' : 'tails';
            if (flip === 'heads') heads++;
            else tails++;
        }

        displayCoinResults(heads, tails, count);
        drawCoinChart(heads, tails, count);
    }

    function displayCoinResults(heads, tails, total) {
        const resultDiv = document.getElementById('coin-results');
        const headsPct = ((heads / total) * 100).toFixed(2);
        const tailsPct = ((tails / total) * 100).toFixed(2);
        
        resultDiv.innerHTML = `
            <strong>Para Atma Sonuçları:</strong><br>
            Yazı: ${heads} kez (${headsPct}%) - Beklenen: 50%<br>
            Tura: ${tails} kez (${tailsPct}%) - Beklenen: 50%
        `;
    }

    function drawCoinChart(heads, tails, total) {
        const canvas = document.getElementById('coin-chart');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 150;

        // Yazı (Heads)
        const headsAngle = (heads / total) * 2 * Math.PI;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, 0, headsAngle);
        ctx.closePath();
        ctx.fillStyle = '#f5576c';
        ctx.fill();
        ctx.stroke();

        // Tura (Tails)
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, headsAngle, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = '#f093fb';
        ctx.fill();
        ctx.stroke();

        // Etiketler
        ctx.fillStyle = '#333';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Yazı: ${heads}`, centerX, centerY - 50);
        ctx.fillText(`Tura: ${tails}`, centerX, centerY + 50);
    }

    // Kart Çekme Simülatörü
    const drawCardsBtn = document.getElementById('draw-cards-btn');
    drawCardsBtn.addEventListener('click', () => {
        const count = parseInt(document.getElementById('card-count').value) || 10;
        simulateCards(count);
    });

    function simulateCards(count) {
        const suits = ['Kupa', 'Karo', 'Maça', 'Sinek'];
        const ranks = ['As', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Vale', 'Kız', 'Papaz'];
        const suitCounts = { 'Kupa': 0, 'Karo': 0, 'Maça': 0, 'Sinek': 0 };
        const drawnCards = [];

        for (let i = 0; i < count && i < 52; i++) {
            const suit = suits[Math.floor(Math.random() * 4)];
            const rank = ranks[Math.floor(Math.random() * 13)];
            suitCounts[suit]++;
            drawnCards.push(`${rank} ${suit}`);
        }

        displayCardResults(suitCounts, drawnCards, count);
        drawCardChart(suitCounts, count);
    }

    function displayCardResults(suitCounts, drawnCards, total) {
        const resultDiv = document.getElementById('card-results');
        let html = '<strong>Çekilen Kartlar:</strong><br>';
        html += drawnCards.join(', ') + '<br><br>';
        html += '<strong>Renk Dağılımı:</strong><br>';
        
        for (const suit in suitCounts) {
            const count = suitCounts[suit];
            const percentage = ((count / total) * 100).toFixed(2);
            html += `${suit}: ${count} kart (${percentage}%)<br>`;
        }
        
        resultDiv.innerHTML = html;
    }

    function drawCardChart(suitCounts, total) {
        const canvas = document.getElementById('card-chart');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const suits = ['Kupa', 'Karo', 'Maça', 'Sinek'];
        const colors = ['#f5576c', '#f093fb', '#4facfe', '#00f2fe'];
        const barWidth = 100;
        const maxHeight = 300;
        const startX = 100;
        const startY = 350;
        const spacing = 50;

        ctx.font = '14px Arial';
        ctx.textAlign = 'center';

        suits.forEach((suit, index) => {
            const count = suitCounts[suit];
            const height = (count / total) * maxHeight;
            const x = startX + index * (barWidth + spacing);
            
            ctx.fillStyle = colors[index];
            ctx.fillRect(x, startY - height, barWidth, height);
            ctx.fillStyle = '#333';
            ctx.fillText(suit, x + barWidth / 2, startY + 20);
            ctx.fillText(count, x + barWidth / 2, startY - height - 10);
        });
    }
});

