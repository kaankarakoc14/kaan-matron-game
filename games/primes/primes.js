// Asal Sayı Avcısı

document.addEventListener('DOMContentLoaded', () => {
    let gameNumbers = [];
    let selectedNumbers = [];
    let correctPrimes = [];
    let score = 0;
    let timer = 60;
    let gameInterval = null;
    let timerInterval = null;

    // Asal sayı testi
    function isPrime(n) {
        if (n < 2) return false;
        if (n === 2) return true;
        if (n % 2 === 0) return false;
        
        for (let i = 3; i * i <= n; i += 2) {
            if (n % i === 0) return false;
        }
        return true;
    }

    document.getElementById('test-btn').addEventListener('click', () => {
        const num = parseInt(document.getElementById('test-number').value);
        const resultDiv = document.getElementById('test-result');
        
        if (isNaN(num) || num < 2) {
            resultDiv.innerHTML = 'Lütfen 2 veya daha büyük bir sayı girin!';
            resultDiv.className = 'test-result';
            return;
        }

        if (isPrime(num)) {
            resultDiv.innerHTML = `✅ ${num} bir asal sayıdır!`;
            resultDiv.className = 'test-result prime';
        } else {
            resultDiv.innerHTML = `❌ ${num} bir asal sayı değildir.`;
            resultDiv.className = 'test-result not-prime';
        }
    });

    // Eratosthenes Kalburu
    document.getElementById('sieve-btn').addEventListener('click', () => {
        const max = parseInt(document.getElementById('sieve-max').value);
        const resultDiv = document.getElementById('sieve-result');
        
        if (isNaN(max) || max < 2) {
            resultDiv.innerHTML = 'Lütfen 2 veya daha büyük bir sayı girin!';
            return;
        }

        const primes = sieveOfEratosthenes(max);
        resultDiv.innerHTML = `<strong>1-${max} arasındaki asal sayılar:</strong><br>${primes.join(', ')}`;
    });

    function sieveOfEratosthenes(max) {
        const sieve = new Array(max + 1).fill(true);
        sieve[0] = false;
        sieve[1] = false;

        for (let i = 2; i * i <= max; i++) {
            if (sieve[i]) {
                for (let j = i * i; j <= max; j += i) {
                    sieve[j] = false;
                }
            }
        }

        const primes = [];
        for (let i = 2; i <= max; i++) {
            if (sieve[i]) {
                primes.push(i);
            }
        }
        return primes;
    }

    // Oyun
    function startGame() {
        gameNumbers = [];
        selectedNumbers = [];
        correctPrimes = [];
        score = 0;
        timer = 60;

        // 20 rastgele sayı oluştur (2-100 arası)
        while (gameNumbers.length < 20) {
            const num = Math.floor(Math.random() * 99) + 2;
            if (!gameNumbers.includes(num)) {
                gameNumbers.push(num);
                if (isPrime(num)) {
                    correctPrimes.push(num);
                }
            }
        }

        displayGameNumbers();
        updateScore();
        startTimer();

        document.getElementById('start-game-btn').textContent = 'Oyun Devam Ediyor...';
        document.getElementById('start-game-btn').disabled = true;
    }

    function displayGameNumbers() {
        const numbersDiv = document.getElementById('game-numbers');
        numbersDiv.innerHTML = gameNumbers.map(num => `
            <div class="game-number" data-number="${num}">${num}</div>
        `).join('');

        document.querySelectorAll('.game-number').forEach(div => {
            div.addEventListener('click', () => {
                if (div.classList.contains('selected') || div.classList.contains('correct') || div.classList.contains('wrong')) {
                    return;
                }

                const num = parseInt(div.dataset.number);
                div.classList.add('selected');
                selectedNumbers.push(num);

                if (isPrime(num)) {
                    div.classList.remove('selected');
                    div.classList.add('correct');
                    score += 10;
                    updateScore();
                } else {
                    div.classList.remove('selected');
                    div.classList.add('wrong');
                    score = Math.max(0, score - 5);
                    updateScore();
                }

                checkGameEnd();
            });
        });
    }

    function checkGameEnd() {
        const foundPrimes = document.querySelectorAll('.game-number.correct').length;
        if (foundPrimes === correctPrimes.length) {
            endGame(true);
        }
    }

    function startTimer() {
        updateTimer();
        timerInterval = setInterval(() => {
            timer--;
            updateTimer();
            if (timer <= 0) {
                endGame(false);
            }
        }, 1000);
    }

    function updateTimer() {
        document.getElementById('timer').textContent = timer;
    }

    function updateScore() {
        document.getElementById('score').textContent = score;
    }

    function endGame(won) {
        clearInterval(timerInterval);
        const resultDiv = document.getElementById('game-result');
        
        if (won) {
            resultDiv.innerHTML = `🎉 Tebrikler! Tüm asal sayıları buldun! Skorun: ${score}`;
            resultDiv.className = 'game-result success';
        } else {
            resultDiv.innerHTML = `⏰ Süre doldu! Bulduğun asal sayılar: ${correctPrimes.filter(p => selectedNumbers.includes(p)).join(', ')}. Skorun: ${score}`;
            resultDiv.className = 'game-result error';
        }

        document.getElementById('start-game-btn').textContent = 'Yeniden Başlat';
        document.getElementById('start-game-btn').disabled = false;
    }

    document.getElementById('start-game-btn').addEventListener('click', () => {
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        document.getElementById('game-result').innerHTML = '';
        startGame();
    });
});

