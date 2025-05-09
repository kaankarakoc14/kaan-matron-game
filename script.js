document.addEventListener('DOMContentLoaded', () => {
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
    let currentLang = 'en'; // Default language
    
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
    const langButtons = document.querySelectorAll('.lang-btn');
    
    // Language switching functionality
    function updateLanguage(lang) {
        currentLang = lang;
        const langData = languages[lang];
        
        // Update language buttons
        langButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
            }
        });
        
        // Update document title
        document.title = langData.title;
        
        // Update main heading
        document.querySelector('h1').textContent = langData.title;
        
        // Update game mode labels
        document.querySelector('.option-group label').textContent = langData.gameMode;
        document.querySelector('input[value="human"] + span').textContent = langData.twoPlayers;
        document.querySelector('input[value="ai"] + span').textContent = langData.vsComputer;
        
        // Update AI difficulty labels
        document.querySelector('.ai-difficulty label').textContent = langData.aiDifficulty;
        document.querySelector('input[value="easy"] + span').textContent = langData.easy;
        document.querySelector('input[value="medium"] + span').textContent = langData.medium;
        document.querySelector('input[value="hard"] + span').textContent = langData.hard;
        
        // Update board size label
        document.querySelector('.board-size-selector label').textContent = langData.boardSize;
        
        // Update player labels
        document.querySelector('#player1 h2').textContent = langData.player1;
        document.querySelector('#player2 h2').textContent = gameMode === 'ai' ? langData.computer : langData.player2;
        
        // Update score labels
        document.querySelector('#player1 .score').textContent = `${langData.score}: `;
        document.querySelector('#player2 .score').textContent = `${langData.score}: `;
        
        // Update last move labels
        document.querySelector('#player1 .last-move').textContent = `${langData.lastMove}: `;
        document.querySelector('#player2 .last-move').textContent = `${langData.lastMove}: `;
        
        // Update factors used labels
        document.querySelector('#player1 .factors').textContent = `${langData.factorsUsed}: `;
        document.querySelector('#player2 .factors').textContent = `${langData.factorsUsed}: `;
        
        // Update turn indicators
        turn1Element.textContent = langData.yourTurn;
        turn2Element.textContent = langData.waiting;
        
        // Update buttons
        resetButton.textContent = langData.newGame;
        instructionsButton.textContent = langData.instructions;
        
        // Update AI thinking text
        aiThinkingElement.querySelector('span').textContent = langData.computerThinking;
        
        // Update message
        updateMessage();
    }
    
    // Add click event listeners to language buttons
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            updateLanguage(btn.dataset.lang);
        });
    });
    
    // Set initial language
    updateLanguage(currentLang);
    
    // Update message based on current game state
    function updateMessage() {
        const langData = languages[currentLang];
        if (gameOver) {
            const player1Name = langData.player1;
            const player2Name = gameMode === 'ai' ? langData.computer : langData.player2;
            
            if (scores[0] > scores[1]) {
                messageElement.textContent = `${langData.gameOver} ${player1Name} ${langData.wins} ${scores[0]} ${langData.points}!`;
            } else if (scores[1] > scores[0]) {
                messageElement.textContent = `${langData.gameOver} ${player2Name} ${langData.wins} ${scores[1]} ${langData.points}!`;
            } else {
                messageElement.textContent = `${langData.gameOver} ${langData.tie} ${scores[0]} ${langData.pointsEach}!`;
            }
        } else {
            const currentPlayerName = currentPlayer === 1 ? langData.player1 : (gameMode === 'ai' ? langData.computer : langData.player2);
            messageElement.textContent = `${currentPlayerName}: ${langData.selectNumber}`;
        }
    }
    
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
        
        // Update player 2 label
        document.querySelector('#player2 h2').textContent = gameMode === 'ai' ? 'Computer' : 'Player 2';
    }
    
    // Initial UI setup
    initUI();
    
    // Event listeners
    resetButton.addEventListener('click', initGame);
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
        messageElement.textContent = 'Player 1: Select a number to start';
        
        // Update player labels
        document.querySelector('#player2 h2').textContent = gameMode === 'ai' ? 'Computer' : 'Player 2';
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
                return { value: n.value, score, factorSum };
            })
            .filter(n => n.factorSum > 0); // Must have at least one unselected factor
        
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
                    factorSum
                };
            })
            .filter(n => n.factorSum > 0); // Must have at least one unselected factor
        
        if (availableNumbers.length === 0) return null;
        
        // Sort by strategic score (descending) and pick the best option
        availableNumbers.sort((a, b) => b.score - a.score);
        return availableNumbers[0].value;
    }
    
    function selectNumber(value) {
        const langData = languages[currentLang];
        const number = gameBoard.find(n => n.value === value);
        
        // Check if the number has any unselected factors
        const unselectedFactors = getProperFactors(value).filter(factor => 
            !gameBoard.find(n => n.value === factor).selected
        );
        
        if (unselectedFactors.length === 0) {
            messageElement.textContent = `${langData.noFactors} ${langData[currentPlayer === 1 ? 'player1' : 'player2']} ${langData.losesTurn}`;
            switchPlayer();
            return;
        }
        
        // Mark the number as selected
        number.selected = true;
        number.owner = currentPlayer;
        
        // Add points to the current player
        scores[currentPlayer - 1] += value;
        
        // Update last move for current player
        lastMoves[currentPlayer - 1] = value;
        
        // Update UI for the selected number
        const numberElement = gameBoardElement.querySelector(`[data-value="${value}"]`);
        numberElement.classList.add(`player${currentPlayer}`);
        numberElement.classList.add('disabled');
        
        // Get the other player
        const otherPlayer = getOtherPlayer();
        
        // Clear factors used for the other player from previous round
        factorsUsed[otherPlayer - 1] = [];
        
        // Now automatically select all proper factors for the other player
        let factorSum = 0;
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
        const currentPlayerName = currentPlayer === 1 ? langData.player1 : (gameMode === 'ai' ? langData.computer : langData.player2);
        const otherPlayerName = otherPlayer === 1 ? langData.player1 : (gameMode === 'ai' ? langData.computer : langData.player2);
        
        messageElement.textContent = `${currentPlayerName} ${langData.selected} ${value} (+${value} ${langData.points}). ${otherPlayerName} ${langData.received} (+${factorSum} ${langData.pointsAdded}).`;
        
        // Check if the game is over
        if (isGameOver()) {
            endGame();
            return;
        }
        
        // Switch player for the next turn
        switchPlayer();
        
        // Update message for next turn
        const nextPlayerName = currentPlayer === 1 ? langData.player1 : (gameMode === 'ai' ? langData.computer : langData.player2);
        messageElement.textContent = `${nextPlayerName}: ${langData.selectNumber}`;
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
        // Check if there are any numbers left with unselected factors
        for (let i = 1; i <= maxNumber; i++) {
            const number = gameBoard.find(n => n.value === i);
            
            if (!number.selected) {
                const hasUnselectedFactors = getProperFactors(i).some(factor => 
                    !gameBoard.find(n => n.value === factor).selected
                );
                
                if (hasUnselectedFactors) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    function endGame() {
        gameOver = true;
        
        const player1Name = langData.player1;
        const player2Name = gameMode === 'ai' ? langData.computer : langData.player2;
        
        if (scores[0] > scores[1]) {
            messageElement.textContent = `${langData.gameOver} ${player1Name} ${langData.wins} ${scores[0]} ${langData.points}!`;
        } else if (scores[1] > scores[0]) {
            messageElement.textContent = `${langData.gameOver} ${player2Name} ${langData.wins} ${scores[1]} ${langData.points}!`;
        } else {
            messageElement.textContent = `${langData.gameOver} ${langData.tie} ${scores[0]} ${langData.pointsEach}!`;
        }
    }
}); 