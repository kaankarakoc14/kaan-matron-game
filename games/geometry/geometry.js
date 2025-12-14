// Geometrik Şekiller ve Alan Hesaplama

document.addEventListener('DOMContentLoaded', () => {
    let currentShape = 'square';
    const canvas = document.getElementById('shape-canvas');
    const ctx = canvas.getContext('2d');
    let currentQuestion = null;
    let score = 0;

    const shapeButtons = document.querySelectorAll('.shape-btn');
    shapeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            currentShape = btn.dataset.shape;
            shapeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateShapeUI();
        });
    });

    function updateShapeUI() {
        const shapeInfo = document.getElementById('shape-info');
        const inputsDiv = document.getElementById('inputs');
        
        const shapes = {
            square: {
                name: 'Kare',
                formula: 'Alan = a × a = a²',
                inputs: [{ label: 'Kenar (a):', id: 'side1' }]
            },
            rectangle: {
                name: 'Dikdörtgen',
                formula: 'Alan = a × b',
                inputs: [{ label: 'Uzunluk (a):', id: 'side1' }, { label: 'Genişlik (b):', id: 'side2' }]
            },
            triangle: {
                name: 'Üçgen',
                formula: 'Alan = (a × h) / 2',
                inputs: [{ label: 'Taban (a):', id: 'side1' }, { label: 'Yükseklik (h):', id: 'height' }]
            },
            circle: {
                name: 'Daire',
                formula: 'Alan = π × r²',
                inputs: [{ label: 'Yarıçap (r):', id: 'radius' }]
            }
        };

        const shape = shapes[currentShape];
        shapeInfo.innerHTML = `<strong>${shape.name}</strong><br>${shape.formula}`;
        
        inputsDiv.innerHTML = shape.inputs.map(input => `
            <div class="input-group">
                <label>${input.label}</label>
                <input type="number" id="${input.id}" step="0.1" min="0" placeholder="Değer girin">
            </div>
        `).join('');

        drawShape();
    }

    document.getElementById('calculate-btn').addEventListener('click', () => {
        calculateArea();
    });

    function calculateArea() {
        let area = 0;
        const resultDiv = document.getElementById('result');
        
        try {
            switch (currentShape) {
                case 'square':
                    const side1 = parseFloat(document.getElementById('side1').value);
                    if (isNaN(side1) || side1 <= 0) throw new Error('Geçerli bir değer girin');
                    area = side1 * side1;
                    resultDiv.innerHTML = `Alan = ${side1} × ${side1} = ${area.toFixed(2)} birim²`;
                    break;
                case 'rectangle':
                    const a = parseFloat(document.getElementById('side1').value);
                    const b = parseFloat(document.getElementById('side2').value);
                    if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) throw new Error('Geçerli değerler girin');
                    area = a * b;
                    resultDiv.innerHTML = `Alan = ${a} × ${b} = ${area.toFixed(2)} birim²`;
                    break;
                case 'triangle':
                    const base = parseFloat(document.getElementById('side1').value);
                    const height = parseFloat(document.getElementById('height').value);
                    if (isNaN(base) || isNaN(height) || base <= 0 || height <= 0) throw new Error('Geçerli değerler girin');
                    area = (base * height) / 2;
                    resultDiv.innerHTML = `Alan = (${base} × ${height}) / 2 = ${area.toFixed(2)} birim²`;
                    break;
                case 'circle':
                    const radius = parseFloat(document.getElementById('radius').value);
                    if (isNaN(radius) || radius <= 0) throw new Error('Geçerli bir değer girin');
                    area = Math.PI * radius * radius;
                    resultDiv.innerHTML = `Alan = π × ${radius}² = ${area.toFixed(2)} birim²`;
                    break;
            }
            drawShape();
        } catch (error) {
            resultDiv.innerHTML = `<span style="color: red;">${error.message}</span>`;
        }
    }

    function drawShape() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#4facfe';
        ctx.fillStyle = 'rgba(79, 172, 254, 0.2)';
        ctx.lineWidth = 3;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const scale = 50;

        try {
            switch (currentShape) {
                case 'square':
                    const s = parseFloat(document.getElementById('side1')?.value || 5) * scale / 5;
                    ctx.fillRect(centerX - s/2, centerY - s/2, s, s);
                    ctx.strokeRect(centerX - s/2, centerY - s/2, s, s);
                    break;
                case 'rectangle':
                    const w = parseFloat(document.getElementById('side1')?.value || 6) * scale / 6;
                    const h = parseFloat(document.getElementById('side2')?.value || 4) * scale / 4;
                    ctx.fillRect(centerX - w/2, centerY - h/2, w, h);
                    ctx.strokeRect(centerX - w/2, centerY - h/2, w, h);
                    break;
                case 'triangle':
                    const base = parseFloat(document.getElementById('side1')?.value || 6) * scale / 6;
                    const height = parseFloat(document.getElementById('height')?.value || 5) * scale / 5;
                    ctx.beginPath();
                    ctx.moveTo(centerX, centerY - height/2);
                    ctx.lineTo(centerX - base/2, centerY + height/2);
                    ctx.lineTo(centerX + base/2, centerY + height/2);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                    break;
                case 'circle':
                    const r = parseFloat(document.getElementById('radius')?.value || 4) * scale / 4;
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.stroke();
                    break;
            }
        } catch (e) {
            // Hata durumunda varsayılan çizim
        }
    }

    // Quiz sistemi
    function generateQuestion() {
        const shapes = ['square', 'rectangle', 'triangle', 'circle'];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        let question, correctAnswer, options;

        switch (shape) {
            case 'square':
                const side = Math.floor(Math.random() * 10) + 1;
                correctAnswer = side * side;
                question = `Bir karenin bir kenarı ${side} birim ise alanı kaçtır?`;
                break;
            case 'rectangle':
                const a = Math.floor(Math.random() * 10) + 1;
                const b = Math.floor(Math.random() * 10) + 1;
                correctAnswer = a * b;
                question = `Bir dikdörtgenin uzunluğu ${a} birim, genişliği ${b} birim ise alanı kaçtır?`;
                break;
            case 'triangle':
                const base = Math.floor(Math.random() * 10) + 1;
                const h = Math.floor(Math.random() * 10) + 1;
                correctAnswer = (base * h) / 2;
                question = `Bir üçgenin tabanı ${base} birim, yüksekliği ${h} birim ise alanı kaçtır?`;
                break;
            case 'circle':
                const r = Math.floor(Math.random() * 10) + 1;
                correctAnswer = Math.round(Math.PI * r * r);
                question = `Bir dairenin yarıçapı ${r} birim ise alanı yaklaşık kaçtır? (π ≈ 3.14)`;
                break;
        }

        // Yanlış seçenekler oluştur
        options = [correctAnswer];
        while (options.length < 4) {
            const wrong = correctAnswer + Math.floor(Math.random() * 20) - 10;
            if (wrong > 0 && !options.includes(wrong)) {
                options.push(wrong);
            }
        }
        options.sort(() => Math.random() - 0.5);

        currentQuestion = { question, correctAnswer, options };
        displayQuestion();
    }

    function displayQuestion() {
        document.getElementById('quiz-question').textContent = currentQuestion.question;
        const optionsDiv = document.getElementById('quiz-options');
        optionsDiv.innerHTML = currentQuestion.options.map((opt, index) => `
            <div class="quiz-option" data-value="${opt}">${opt}</div>
        `).join('');

        document.querySelectorAll('.quiz-option').forEach(opt => {
            opt.addEventListener('click', checkAnswer);
        });

        document.getElementById('quiz-result').innerHTML = '';
    }

    function checkAnswer(e) {
        const selected = parseFloat(e.target.dataset.value);
        const resultDiv = document.getElementById('quiz-result');
        const options = document.querySelectorAll('.quiz-option');

        options.forEach(opt => {
            opt.style.pointerEvents = 'none';
            if (parseFloat(opt.dataset.value) === currentQuestion.correctAnswer) {
                opt.classList.add('correct');
            } else if (opt === e.target && selected !== currentQuestion.correctAnswer) {
                opt.classList.add('wrong');
            }
        });

        if (selected === currentQuestion.correctAnswer) {
            resultDiv.innerHTML = '✅ Doğru!';
            resultDiv.className = 'quiz-result correct';
            score++;
        } else {
            resultDiv.innerHTML = `❌ Yanlış! Doğru cevap: ${currentQuestion.correctAnswer}`;
            resultDiv.className = 'quiz-result wrong';
        }
    }

    document.getElementById('next-question-btn').addEventListener('click', () => {
        generateQuestion();
    });

    // İlk yükleme
    updateShapeUI();
    generateQuestion();
});

