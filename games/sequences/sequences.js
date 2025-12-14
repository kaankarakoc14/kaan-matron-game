// Sayı Dizileri ve Desenler

document.addEventListener('DOMContentLoaded', () => {
    let currentSequence = 'arithmetic';
    let currentGameQuestion = null;

    const seqButtons = document.querySelectorAll('.seq-btn');
    seqButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            currentSequence = btn.dataset.seq;
            seqButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateSequenceUI();
        });
    });

    function updateSequenceUI() {
        const sequenceInfo = document.getElementById('sequence-info');
        const inputsDiv = document.getElementById('inputs');
        
        const sequences = {
            arithmetic: {
                name: 'Aritmetik Dizi',
                formula: 'aₙ = a₁ + (n-1) × d',
                description: 'Her terim bir önceki terime sabit bir sayı (d) eklenerek bulunur.',
                inputs: [
                    { label: 'İlk terim (a₁):', id: 'first' },
                    { label: 'Ortak fark (d):', id: 'diff' },
                    { label: 'Terim sayısı:', id: 'count' }
                ]
            },
            geometric: {
                name: 'Geometrik Dizi',
                formula: 'aₙ = a₁ × r^(n-1)',
                description: 'Her terim bir önceki terimin sabit bir sayı (r) ile çarpılmasıyla bulunur.',
                inputs: [
                    { label: 'İlk terim (a₁):', id: 'first' },
                    { label: 'Ortak oran (r):', id: 'ratio' },
                    { label: 'Terim sayısı:', id: 'count' }
                ]
            },
            square: {
                name: 'Kare Sayılar',
                formula: 'aₙ = n²',
                description: '1, 4, 9, 16, 25, 36... (Her sayının karesi)',
                inputs: [
                    { label: 'Terim sayısı:', id: 'count' }
                ]
            },
            triangular: {
                name: 'Üçgen Sayılar',
                formula: 'aₙ = n(n+1)/2',
                description: '1, 3, 6, 10, 15, 21... (Üçgen şeklinde dizilebilen sayılar)',
                inputs: [
                    { label: 'Terim sayısı:', id: 'count' }
                ]
            }
        };

        const seq = sequences[currentSequence];
        sequenceInfo.innerHTML = `
            <strong>${seq.name}</strong><br>
            ${seq.formula}<br>
            <small>${seq.description}</small>
        `;
        
        inputsDiv.innerHTML = seq.inputs.map(input => `
            <div class="input-group">
                <label>${input.label}</label>
                <input type="number" id="${input.id}" step="0.1" min="1" placeholder="Değer girin">
            </div>
        `).join('');
    }

    document.getElementById('calculate-btn').addEventListener('click', () => {
        calculateSequence();
    });

    function calculateSequence() {
        const resultDiv = document.getElementById('result');
        let sequence = [];
        
        try {
            switch (currentSequence) {
                case 'arithmetic':
                    const a1 = parseFloat(document.getElementById('first').value);
                    const d = parseFloat(document.getElementById('diff').value);
                    const n = parseInt(document.getElementById('count').value);
                    if (isNaN(a1) || isNaN(d) || isNaN(n) || n <= 0) throw new Error('Geçerli değerler girin');
                    for (let i = 0; i < n; i++) {
                        sequence.push(a1 + i * d);
                    }
                    break;
                case 'geometric':
                    const first = parseFloat(document.getElementById('first').value);
                    const r = parseFloat(document.getElementById('ratio').value);
                    const count = parseInt(document.getElementById('count').value);
                    if (isNaN(first) || isNaN(r) || isNaN(count) || count <= 0) throw new Error('Geçerli değerler girin');
                    for (let i = 0; i < count; i++) {
                        sequence.push(first * Math.pow(r, i));
                    }
                    break;
                case 'square':
                    const sqCount = parseInt(document.getElementById('count').value);
                    if (isNaN(sqCount) || sqCount <= 0) throw new Error('Geçerli bir değer girin');
                    for (let i = 1; i <= sqCount; i++) {
                        sequence.push(i * i);
                    }
                    break;
                case 'triangular':
                    const triCount = parseInt(document.getElementById('count').value);
                    if (isNaN(triCount) || triCount <= 0) throw new Error('Geçerli bir değer girin');
                    for (let i = 1; i <= triCount; i++) {
                        sequence.push((i * (i + 1)) / 2);
                    }
                    break;
            }
            
            resultDiv.innerHTML = `<strong>Dizi:</strong><br>${sequence.join(', ')}`;
        } catch (error) {
            resultDiv.innerHTML = `<span style="color: red;">${error.message}</span>`;
        }
    }

    // Desen bulma oyunu
    function generateGameQuestion() {
        const types = ['arithmetic', 'geometric', 'square', 'triangular'];
        const type = types[Math.floor(Math.random() * types.length)];
        let sequence = [];
        let question, correctAnswer, options;

        switch (type) {
            case 'arithmetic':
                const a1 = Math.floor(Math.random() * 10) + 1;
                const d = Math.floor(Math.random() * 5) + 1;
                for (let i = 0; i < 5; i++) {
                    sequence.push(a1 + i * d);
                }
                correctAnswer = a1 + 5 * d;
                question = `Aritmetik dizi: ${sequence.join(', ')}. Sonraki sayı nedir?`;
                break;
            case 'geometric':
                const first = Math.floor(Math.random() * 5) + 1;
                const r = Math.floor(Math.random() * 3) + 2;
                for (let i = 0; i < 4; i++) {
                    sequence.push(first * Math.pow(r, i));
                }
                correctAnswer = first * Math.pow(r, 4);
                question = `Geometrik dizi: ${sequence.join(', ')}. Sonraki sayı nedir?`;
                break;
            case 'square':
                const start = Math.floor(Math.random() * 5) + 1;
                for (let i = start; i < start + 4; i++) {
                    sequence.push(i * i);
                }
                correctAnswer = (start + 4) * (start + 4);
                question = `Kare sayılar: ${sequence.join(', ')}. Sonraki sayı nedir?`;
                break;
            case 'triangular':
                const triStart = Math.floor(Math.random() * 5) + 1;
                for (let i = triStart; i < triStart + 4; i++) {
                    sequence.push((i * (i + 1)) / 2);
                }
                correctAnswer = ((triStart + 4) * (triStart + 5)) / 2;
                question = `Üçgen sayılar: ${sequence.join(', ')}. Sonraki sayı nedir?`;
                break;
        }

        // Yanlış seçenekler
        options = [correctAnswer];
        while (options.length < 4) {
            const wrong = correctAnswer + Math.floor(Math.random() * 20) - 10;
            if (wrong > 0 && !options.includes(wrong)) {
                options.push(wrong);
            }
        }
        options.sort(() => Math.random() - 0.5);

        currentGameQuestion = { question, correctAnswer, options };
        displayGameQuestion();
    }

    function displayGameQuestion() {
        document.getElementById('game-question').textContent = currentGameQuestion.question;
        const optionsDiv = document.getElementById('game-options');
        optionsDiv.innerHTML = currentGameQuestion.options.map(opt => `
            <div class="game-option" data-value="${opt}">${opt}</div>
        `).join('');

        document.querySelectorAll('.game-option').forEach(opt => {
            opt.addEventListener('click', checkGameAnswer);
        });

        document.getElementById('game-result').innerHTML = '';
    }

    function checkGameAnswer(e) {
        const selected = parseFloat(e.target.dataset.value);
        const resultDiv = document.getElementById('game-result');
        const options = document.querySelectorAll('.game-option');

        options.forEach(opt => {
            opt.style.pointerEvents = 'none';
            if (parseFloat(opt.dataset.value) === currentGameQuestion.correctAnswer) {
                opt.classList.add('correct');
            } else if (opt === e.target && selected !== currentGameQuestion.correctAnswer) {
                opt.classList.add('wrong');
            }
        });

        if (selected === currentGameQuestion.correctAnswer) {
            resultDiv.innerHTML = '✅ Doğru!';
            resultDiv.className = 'game-result correct';
        } else {
            resultDiv.innerHTML = `❌ Yanlış! Doğru cevap: ${currentGameQuestion.correctAnswer}`;
            resultDiv.className = 'game-result wrong';
        }
    }

    document.getElementById('next-game-btn').addEventListener('click', () => {
        generateGameQuestion();
    });

    // İlk yükleme
    updateSequenceUI();
    generateGameQuestion();
});

