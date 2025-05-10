document.addEventListener('DOMContentLoaded', () => {
    // Language settings
    let currentLanguage = 'en'; // Default language
    
    // Translation dictionaries
    const translations = {
        en: {
            title: 'MATRON',
            gameMode: 'Game Mode:',
            twoPlayers: '2 Players',
            vsComputer: 'vs Computer',
            aiDifficulty: 'AI Difficulty:',
            easy: 'Easy',
            medium: 'Medium',
            hard: 'Hard',
            boardSize: 'Board Size:',
            language: 'Language:',
            player1: 'Player 1',
            player2: 'Player 2',
            computer: 'Computer',
            score: 'Score:',
            lastMove: 'Last Move:',
            factorsUsed: 'Factors Used:',
            yourTurn: 'Your Turn',
            waiting: 'Waiting...',
            playerSelectStart: 'Player 1: Select a number to start',
            computerThinking: 'Computer is thinking...',
            newGame: 'New Game',
            instructions: 'Instructions',
            howToPlay: 'How to Play',
            selectedPoints: '{playerName} selected {value} (+{value} points)',
            receivedFactors: '{playerName} received all factors (+{factorSum} points)',
            playerSelectNumber: '{playerName}: Select a number',
            gameOver: 'Game over! {playerName} wins with {score} points!',
            tie: 'Game over! It\'s a tie with {score} points each!',
            lostTurn: '{playerName} selected {value} but there are no remaining factors. Turn is lost.'
        },
        tr: {
            title: 'MATRON',
            gameMode: 'Oyun Modu:',
            twoPlayers: '2 Oyuncu',
            vsComputer: 'Bilgisayara Karşı',
            aiDifficulty: 'Zorluk Seviyesi:',
            easy: 'Kolay',
            medium: 'Orta',
            hard: 'Zor',
            boardSize: 'Tahta Boyutu:',
            language: 'Dil:',
            player1: 'Oyuncu 1',
            player2: 'Oyuncu 2',
            computer: 'Bilgisayar',
            score: 'Puan:',
            lastMove: 'Son Hamle:',
            factorsUsed: 'Kullanılan Çarpanlar:',
            yourTurn: 'Sıra Sizde',
            waiting: 'Bekliyor...',
            playerSelectStart: 'Oyuncu 1: Başlamak için bir sayı seçin',
            computerThinking: 'Bilgisayar düşünüyor...',
            newGame: 'Yeni Oyun',
            instructions: 'Talimatlar',
            howToPlay: 'Nasıl Oynanır',
            selectedPoints: '{playerName} {value} seçti (+{value} puan)',
            receivedFactors: '{playerName} tüm çarpanları aldı (+{factorSum} puan)',
            playerSelectNumber: '{playerName}: Bir sayı seçin',
            gameOver: 'Oyun bitti! {playerName} {score} puanla kazandı!',
            tie: 'Oyun bitti! {score} puanla berabere!',
            lostTurn: '{playerName} {value} seçti fakat kalan çarpan yok. Sıra kaybedildi.'
        }
    };
    
    // Helper function for string formatting
    function formatString(template, values) {
        return Object.entries(values).reduce((result, [key, value]) => {
            return result.replace(new RegExp(`{${key}}`, 'g'), value);
        }, template);
    }
    
    // Function to update UI text based on current language
    function updateUILanguage() {
        const t = translations[currentLanguage];
        
        // Update static UI elements
        document.title = t.title;
        document.querySelector('h1').textContent = t.title;
        document.querySelector('.option-group:first-child label').textContent = t.gameMode;
        document.querySelectorAll('.radio-group label span')[0].textContent = t.twoPlayers;
        document.querySelectorAll('.radio-group label span')[1].textContent = t.vsComputer;
        document.querySelector('.ai-difficulty label').textContent = t.aiDifficulty;
        document.querySelectorAll('.ai-difficulty .radio-group label span')[0].textContent = t.easy;
        document.querySelectorAll('.ai-difficulty .radio-group label span')[1].textContent = t.medium;
        document.querySelectorAll('.ai-difficulty .radio-group label span')[2].textContent = t.hard;
        document.querySelector('.board-size-selector label').textContent = t.boardSize;
        document.querySelector('.language-selector label').textContent = t.language;
        document.querySelector('#player1 h2').textContent = t.player1;
        document.querySelector('#player2 h2').textContent = gameMode === 'ai' ? t.computer : t.player2;
        document.querySelectorAll('.score')[0].childNodes[0].textContent = t.score + ' ';
        document.querySelectorAll('.score')[1].childNodes[0].textContent = t.score + ' ';
        document.querySelectorAll('.last-move')[0].childNodes[0].textContent = t.lastMove + ' ';
        document.querySelectorAll('.last-move')[1].childNodes[0].textContent = t.lastMove + ' ';
        document.querySelectorAll('.factors')[0].childNodes[0].textContent = t.factorsUsed + ' ';
        document.querySelectorAll('.factors')[1].childNodes[0].textContent = t.factorsUsed + ' ';
        document.querySelector('#turn1').textContent = t.yourTurn;
        document.querySelector('#turn2').textContent = t.waiting;
        document.querySelector('#reset-btn').textContent = t.newGame;
        document.querySelector('#instructions-btn').textContent = t.instructions;
        document.querySelector('.modal-content h2').textContent = t.howToPlay;
        document.querySelector('#ai-thinking span').textContent = t.computerThinking;
        
        // Toggle instructions language display
        document.querySelectorAll('[id^="instructions-"]').forEach(el => {
            el.style.display = 'none';
        });
        document.querySelector(`#instructions-${currentLanguage}`).style.display = 'block';
        
        // Update dynamic message based on game state
        updateGameMessage();
    }
    
    // Update game message based on current state
    function updateGameMessage() {
        const t = translations[currentLanguage];
        
        if (gameOver) {
            const player1Name = t.player1;
            const player2Name = gameMode === 'ai' ? t.computer : t.player2;
            
            if (scores[0] > scores[1]) {
                messageElement.textContent = formatString(t.gameOver, {
                    playerName: player1Name,
                    score: scores[0]
                });
            } else if (scores[1] > scores[0]) {
                messageElement.textContent = formatString(t.gameOver, {
                    playerName: player2Name,
                    score: scores[1]
                });
            } else {
                messageElement.textContent = formatString(t.tie, {
                    score: scores[0]
                });
            }
        } else {
            const nextPlayerName = currentPlayer === 1 ? t.player1 : (gameMode === 'ai' ? t.computer : t.player2);
            messageElement.textContent = formatString(t.playerSelectNumber, {
                playerName: nextPlayerName
            });
        }
    }
    
    // Game settings
    let boardSize = 6; // Default board size (6x6)
    let maxNumber = boardSize * boardSize;
    let gameBoard = [];
    let currentPlayer = 1;
    let scores = [0, 0]; // scores[0] for Player 1, scores[1] for Player 2
    let gameOver = false;
    let lastMoves = ['-', '-']; // Last move for each player
    let factorsUsed = [[], []]; // Factors used for each player
    let gameMode = 'human'; // Default game mode (human vs human)
    let aiDifficulty = 'easy'; // Default AI difficulty
    let aiThinking = false; // Flag to prevent interactions during AI turn
    
    // DOM elements
    const gameBoardElement = document.getElementById('game-board');
    const messageElement = document.getElementById('message');
    const score1Element = document.getElementById('score1');
    const score2Element = document.getElementById('score2');
    const lastMove1Element = document.getElementById('lastMove1');
    const lastMove2Element = document.getElementById('lastMove2');
    const factors1Element = document.getElementById('factors1');
    const factors2Element = document.getElementById('factors2');
    const turn1Element = document.getElementById('turn1');
    const turn2Element = document.getElementById('turn2');
    const resetButton = document.getElementById('reset-btn');
    const instructionsButton = document.getElementById('instructions-btn');
    const instructionsModal = document.getElementById('instructions-modal');
    const closeBtn = document.querySelector('.close-btn');
    const boardSizeSelector = document.getElementById('board-size');
    const gameModeRadios = document.querySelectorAll('input[name="game-mode"]');
    const aiDifficultyContainer = document.querySelector('.ai-difficulty');
    const aiLevelRadios = document.querySelectorAll('input[name="ai-level"]');
    const aiThinkingElement = document.getElementById('ai-thinking');
    const containerElement = document.querySelector('.container');
    const languageSelector = document.getElementById('language');
    
    // Set default board size in dropdown
    boardSizeSelector.value = boardSize.toString();
    
    // Initialize the game
    initGame();
    
    // Initialize UI based on current settings
    function initUI() {
        // Set the game mode radio button
        document.querySelector(`input[name="game-mode"][value="${gameMode}"]`).checked = true;
        
        // Show/hide AI difficulty based on game mode
        aiDifficultyContainer.style.display = gameMode === 'ai' ? 'flex' : 'none';
        
        // Set the AI difficulty radio button
        document.querySelector(`input[name="ai-level"][value="${aiDifficulty}"]`).checked = true;
        
        // Update language texts
        updateUILanguage();
    }
    
    // Initial UI setup
    initUI();
    
    // Event listeners
    resetButton.addEventListener('click', initGame);
    
    // Language selection
    languageSelector.addEventListener('change', function() {
        currentLanguage = this.value;
        updateUILanguage();
    });
    
    boardSizeSelector.addEventListener('change', function() {
        boardSize = parseInt(this.value);
        maxNumber = boardSize * boardSize;
        initGame();
        
        // Add class for large boards to adjust container padding
        if (boardSize >= 8) {
            containerElement.classList.add('has-large-board');
        } else {
            containerElement.classList.remove('has-large-board');
        }
    });
    
    // Initial check for large board
    if (boardSize >= 8) {
        containerElement.classList.add('has-large-board');
    }
    
    // Game mode selection
    gameModeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            gameMode = this.value;
            aiDifficultyContainer.style.display = gameMode === 'ai' ? 'flex' : 'none';
            initGame();
        });
    });
    
    // AI difficulty selection
    aiLevelRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            aiDifficulty = this.value;
            if (gameMode === 'ai' && currentPlayer === 2) {
                // If it's currently AI's turn, make a move with the new difficulty
                makeAiMove();
            }
        });
    });
    
    instructionsButton.addEventListener('click', () => {
        instructionsModal.style.display = 'block';
    });
    
    closeBtn.addEventListener('click', () => {
        instructionsModal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === instructionsModal) {
            instructionsModal.style.display = 'none';
        }
    });
    
    // Functions
    function initGame() {
        // Reset game state
        gameBoard = [];
        currentPlayer = 1;
        scores = [0, 0];
        lastMoves = ['-', '-'];
        factorsUsed = [[], []];
        gameOver = false;
        aiThinking = false;
        
        // Update UI
        score1Element.textContent = '0';
        score2Element.textContent = '0';
        lastMove1Element.textContent = '-';
        lastMove2Element.textContent = '-';
        factors1Element.textContent = '-';
        factors2Element.textContent = '-';
        
        updateTurnIndicator();
        
        // Clear game board
        gameBoardElement.innerHTML = '';
        
        // Update the grid columns based on board size
        gameBoardElement.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
        
        // Apply board size class for responsive styling
        gameBoardElement.className = 'game-board';
        gameBoardElement.classList.add(`board-size-${boardSize}`);
        
        // Generate numbers for the game board
        for (let i = 1; i <= maxNumber; i++) {
            gameBoard.push({
                value: i,
                selected: false,
                owner: null
            });
        }
        
        // Create the game board UI
        createGameBoardUI();
        
        // Set initial message
        const t = translations[currentLanguage];
        messageElement.textContent = t.playerSelectStart;
        
        // Update all UI text with current language
        updateUILanguage();
    }
    
    function createGameBoardUI() {
        gameBoard.forEach(number => {
            const numberElement = document.createElement('div');
            numberElement.classList.add('number');
            numberElement.textContent = number.value;
            numberElement.dataset.value = number.value;
            
            // Add class for extra large numbers (>= 100)
            if (number.value >= 100) {
                numberElement.classList.add('large-number');
            }
            
            numberElement.addEventListener('click', () => handleNumberClick(number.value));
            
            gameBoardElement.appendChild(numberElement);
        });
    }
    
    function handleNumberClick(value) {
        if (gameOver || aiThinking) return;
        
        // If it's AI's turn and player tries to make a move, ignore
        if (gameMode === 'ai' && currentPlayer === 2) return;
        
        // Get the number object from gameBoard
        const number = gameBoard.find(n => n.value === value);
        
        // If the number is already selected, return
        if (number.selected) return;
        
        // A player is selecting a number
        selectNumber(value);
        
        // If playing against AI and game not over, let AI make its move
        if (gameMode === 'ai' && currentPlayer === 2 && !gameOver) {
            aiThinking = true;
            // Show AI thinking indicator
            aiThinkingElement.classList.add('visible');
            
            // Add a small delay to simulate "thinking"
            setTimeout(() => {
                makeAiMove();
                // Hide AI thinking indicator
                aiThinkingElement.classList.remove('visible');
                aiThinking = false;
            }, 1000 + Math.random() * 1000); // Random think time between 1-2 seconds
        }
    }
    
    function makeAiMove() {
        if (gameOver) return;
        
        let selectedValue;
        
        switch (aiDifficulty) {
            case 'easy':
                selectedValue = makeEasyAiMove();
                break;
            case 'medium':
                selectedValue = makeMediumAiMove();
                break;
            case 'hard':
                selectedValue = makeHardAiMove();
                break;
            default:
                selectedValue = makeEasyAiMove();
        }
        
        if (selectedValue) {
            selectNumber(selectedValue);
        } else {
            // No valid moves for AI, check if game is over
            if (isGameOver()) {
                endGame();
            } else {
                // Skip AI's turn and return to player
                const t = translations[currentLanguage];
                messageElement.textContent = formatString(t.lostTurn, {
                    playerName: t.computer,
                    value: '-'
                });
                
                // Switch back to player 1
                currentPlayer = 1;
                updateTurnIndicator();
                updateGameMessage();
            }
        }
    }
    
    function makeEasyAiMove() {
        // Easy AI: Just pick a random valid number
        const availableNumbers = gameBoard
            .filter(n => !n.selected)
            .filter(n => {
                // Check if the number has unselected factors
                const factors = getProperFactors(n.value);
                return factors.some(factor => !gameBoard.find(num => num.value === factor).selected);
            });
        
        if (availableNumbers.length === 0) return null;
        
        // Pick a random available number
        const randomIndex = Math.floor(Math.random() * availableNumbers.length);
        return availableNumbers[randomIndex].value;
    }
    
    function makeMediumAiMove() {
        // Medium AI: Choose a number with a good ratio of points-to-factors
        const availableNumbers = gameBoard
            .filter(n => !n.selected)
            .map(n => {
                const factors = getProperFactors(n.value).filter(factor => 
                    !gameBoard.find(num => num.value === factor).selected
                );
                const factorSum = factors.reduce((sum, factor) => sum + factor, 0);
                // Calculate a score based on points minus factor sum (higher is better for AI)
                const score = n.value - factorSum;
                return { value: n.value, score, factorSum, factorCount: factors.length };
            })
            .filter(n => n.factorCount > 0); // Must have at least one unselected factor
        
        if (availableNumbers.length === 0) return null;
        
        // Sort by score (descending) and pick one of the top options (with some randomness)
        availableNumbers.sort((a, b) => b.score - a.score);
        const topOptions = availableNumbers.slice(0, Math.min(3, availableNumbers.length));
        const randomIndex = Math.floor(Math.random() * topOptions.length);
        return topOptions[randomIndex].value;
    }
    
    function makeHardAiMove() {
        // Hard AI: Use a more sophisticated strategy
        const availableNumbers = gameBoard
            .filter(n => !n.selected)
            .map(n => {
                const factors = getProperFactors(n.value).filter(factor => 
                    !gameBoard.find(num => num.value === factor).selected
                );
                const factorSum = factors.reduce((sum, factor) => sum + factor, 0);
                
                // Calculate a strategic score based on multiple factors
                let strategicScore = n.value - factorSum; // Base score as in medium difficulty
                
                // Prefer numbers with fewer remaining factors (to minimize opponent's gains)
                strategicScore -= factors.length * 2;
                
                // Prefer prime numbers (they only have 1 as a factor)
                if (factors.length === 1 && factors[0] === 1) {
                    strategicScore += 10;
                }
                
                // Consider board position - look ahead to see if this opens up good moves
                // for the opponent (simplified look-ahead)
                let worstCaseOpponentGain = 0;
                gameBoard.filter(opNum => !opNum.selected && opNum.value !== n.value).forEach(opNum => {
                    const opFactors = getProperFactors(opNum.value).filter(factor => 
                        !gameBoard.find(num => num.value === factor).selected && factor !== n.value
                    );
                    const opFactorSum = opFactors.reduce((sum, factor) => sum + factor, 0);
                    if (opFactorSum > worstCaseOpponentGain) {
                        worstCaseOpponentGain = opFactorSum;
                    }
                });
                
                // Penalize moves that could lead to big opponent gains
                strategicScore -= Math.floor(worstCaseOpponentGain / 3);
                
                return { 
                    value: n.value, 
                    score: strategicScore,
                    factorSum,
                    factorCount: factors.length
                };
            })
            .filter(n => n.factorCount > 0); // Must have at least one unselected factor
        
        if (availableNumbers.length === 0) return null;
        
        // Sort by strategic score (descending) and pick the best option
        availableNumbers.sort((a, b) => b.score - a.score);
        return availableNumbers[0].value;
    }
    
    function selectNumber(value) {
        // Find the number in the game board
        const number = gameBoard.find(n => n.value === value);
        
        // Get the proper factors of the selected number
        const factors = getProperFactors(value);
        
        // Filter out already selected factors
        const unselectedFactors = factors.filter(factor => {
            return !gameBoard.find(n => n.value === factor).selected;
        });
        
        const t = translations[currentLanguage];
        const currentPlayerName = currentPlayer === 1 ? t.player1 : (gameMode === 'ai' ? t.computer : t.player2);
        const otherPlayer = getOtherPlayer();
        const otherPlayerName = otherPlayer === 1 ? t.player1 : (gameMode === 'ai' ? t.computer : t.player2);
        
        // Check if there are no unselected factors
        if (unselectedFactors.length === 0) {
            // Player loses their turn and gets no points
            messageElement.textContent = formatString(t.lostTurn, {
                playerName: currentPlayerName,
                value: value
            });
            
            // Switch player without updating scores or marking the number as selected
            switchPlayer();
            
            // Update message for next turn
            updateGameMessage();
            return;
        }
        
        // Mark the selected number as selected
        number.selected = true;
        number.owner = currentPlayer;
        
        // Update the UI
        const numberElement = gameBoardElement.querySelector(`[data-value="${value}"]`);
        numberElement.classList.add(`player${currentPlayer}`);
        numberElement.classList.add('disabled');
        
        // Add the value to the current player's score
        scores[currentPlayer - 1] += value;
        
        // Record the move
        lastMoves[currentPlayer - 1] = value.toString();
        
        // Calculate the sum of unselected factors
        let factorSum = 0;
        
        // Mark all unselected factors as belonging to the other player
        unselectedFactors.forEach(factor => {
            const factorNumber = gameBoard.find(n => n.value === factor);
            factorNumber.selected = true;
            factorNumber.owner = otherPlayer;
            factorSum += factor;
            
            // Add to factors used for the other player
            factorsUsed[otherPlayer - 1].push(factor);
            
            // Update UI for each factor
            const factorElement = gameBoardElement.querySelector(`[data-value="${factor}"]`);
            factorElement.classList.add(`player${otherPlayer}`);
            factorElement.classList.add('disabled');
        });
        
        // Add the sum of all factors to the other player's score
        scores[otherPlayer - 1] += factorSum;
        
        // Update all UI elements
        updateScores();
        updateLastMoves();
        updateFactorsUsed();
        
        // Show a message about what happened
        const selectedMessage = formatString(t.selectedPoints, {
            playerName: currentPlayerName,
            value: value
        });
        
        const factorsMessage = formatString(t.receivedFactors, {
            playerName: otherPlayerName,
            factorSum: factorSum
        });
        
        messageElement.textContent = `${selectedMessage}. ${factorsMessage}.`;
        
        // Check if the game is over
        if (isGameOver()) {
            endGame();
            return;
        }
        
        // Switch player for the next turn
        switchPlayer();
        
        // Update message for next turn
        updateGameMessage();
    }
    
    function getProperFactors(number) {
        const factors = [];
        for (let i = 1; i < number; i++) {
            if (number % i === 0) {
                factors.push(i);
            }
        }
        return factors;
    }
    
    function switchPlayer() {
        currentPlayer = getOtherPlayer();
        updateTurnIndicator();
    }
    
    function getOtherPlayer() {
        return currentPlayer === 1 ? 2 : 1;
    }
    
    function updateScores() {
        score1Element.textContent = scores[0];
        score2Element.textContent = scores[1];
    }
    
    function updateLastMoves() {
        lastMove1Element.textContent = lastMoves[0];
        lastMove2Element.textContent = lastMoves[1];
    }
    
    function updateFactorsUsed() {
        factors1Element.textContent = factorsUsed[0].length > 0 ? factorsUsed[0].join(', ') : '-';
        factors2Element.textContent = factorsUsed[1].length > 0 ? factorsUsed[1].join(', ') : '-';
    }
    
    function updateTurnIndicator() {
        turn1Element.style.display = currentPlayer === 1 ? 'block' : 'none';
        turn2Element.style.display = currentPlayer === 2 ? 'block' : 'none';
    }
    
    function isGameOver() {
        // Check if there are any valid moves left
        // A valid move is an unselected number that has at least one unselected factor
        
        // Check if all numbers are selected
        const allSelected = gameBoard.every(n => n.selected);
        if (allSelected) {
            return true;
        }
        
        // Check if there are any unselected numbers with unselected factors
        for (const number of gameBoard) {
            if (!number.selected) {
                const factors = getProperFactors(number.value);
                const hasUnselectedFactor = factors.some(factor => 
                    !gameBoard.find(n => n.value === factor).selected
                );
                
                if (hasUnselectedFactor) {
                    // There's at least one valid move left
                    return false;
                }
            }
        }
        
        // No valid moves left, game is over
        return true;
    }
    
    function endGame() {
        gameOver = true;
        updateGameMessage();
    }
}); 