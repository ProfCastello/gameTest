// Classe principal do jogo de palavras cruzadas
class CrosswordGame {
    constructor() {
        this.crosswordGenerator = new CrosswordGenerator();
        this.selectedWords = [];
        this.userGrid = [];
        this.selectedCell = null;
        this.selectedWord = null;
        this.completedWords = new Set();
        this.currentDifficulty = 5;
        
        this.initializeEventListeners();
        this.showMenu();
    }
    
    // Inicializar event listeners
    initializeEventListeners() {
        // Botões de dificuldade
        const difficultyButtons = document.querySelectorAll('.difficulty-btn');
        difficultyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentDifficulty = parseInt(e.target.dataset.words);
                this.startGame();
            });
        });
        
        // Botões de controle do jogo
        document.getElementById('newGameBtn').addEventListener('click', () => {
            this.showMenu();
        });
        
        document.getElementById('hintBtn').addEventListener('click', () => {
            this.showHint();
        });
        
        document.getElementById('checkBtn').addEventListener('click', () => {
            this.checkAnswers();
        });
        
        // Teclado virtual
        const keys = document.querySelectorAll('.key');
        keys.forEach(key => {
            key.addEventListener('click', (e) => {
                this.handleKeyInput(e.target.dataset.key);
            });
        });
        
        // Teclado físico
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardInput(e);
        });
    }
    
    // Mostrar menu principal
    showMenu() {
        document.getElementById('menuScreen').classList.add('active');
        document.getElementById('gameScreen').classList.remove('active');
        document.getElementById('virtualKeyboard').classList.remove('active');
    }
    
    // Iniciar o jogo
    startGame() {
        this.selectedWords = getBalancedWords(this.currentDifficulty);
        
        if (this.crosswordGenerator.generateCrossword(this.selectedWords)) {
            this.initializeUserGrid();
            this.renderGrid();
            this.renderClues();
            this.updateStats();
            
            document.getElementById('menuScreen').classList.remove('active');
            document.getElementById('gameScreen').classList.add('active');
            document.getElementById('virtualKeyboard').classList.add('active');
        } else {
            alert('Erro ao gerar palavras cruzadas. Tente novamente.');
        }
    }
    
    // Inicializar grid do usuário
    initializeUserGrid() {
        const grid = this.crosswordGenerator.getGrid();
        this.userGrid = grid.map(row => 
            row.map(cell => cell.isBlack ? '' : '')
        );
        this.selectedCell = null;
        this.selectedWord = null;
        this.completedWords.clear();
    }
    
    // Renderizar o grid na tela
    renderGrid() {
        const gridContainer = document.getElementById('crosswordGrid');
        const grid = this.crosswordGenerator.getGrid();
        const gridSize = grid.length;
        
        gridContainer.innerHTML = '';
        
        const gridElement = document.createElement('div');
        gridElement.className = 'grid-container';
        gridElement.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const cell = grid[row][col];
                const cellElement = document.createElement('div');
                cellElement.className = 'grid-cell';
                cellElement.dataset.row = row;
                cellElement.dataset.col = col;
                
                if (cell.isBlack) {
                    cellElement.classList.add('black');
                } else {
                    // Adicionar número se existir
                    if (cell.number > 0) {
                        const numberElement = document.createElement('span');
                        numberElement.className = 'number';
                        numberElement.textContent = cell.number;
                        cellElement.appendChild(numberElement);
                    }
                    
                    // Adicionar evento de clique
                    cellElement.addEventListener('click', () => {
                        this.selectCell(row, col);
                    });
                    
                    // Mostrar letra do usuário
                    const userLetter = this.userGrid[row][col];
                    if (userLetter) {
                        cellElement.textContent = (cellElement.textContent || '') + userLetter;
                    }
                }
                
                gridElement.appendChild(cellElement);
            }
        }
        
        gridContainer.appendChild(gridElement);
    }
    
    // Renderizar dicas
    renderClues() {
        const clues = this.crosswordGenerator.getClues();
        
        // Dicas horizontais
        const horizontalContainer = document.getElementById('horizontalClues');
        horizontalContainer.innerHTML = '';
        clues.horizontal.forEach((wordObj, index) => {
            const clueElement = document.createElement('div');
            clueElement.className = 'clue-item';
            clueElement.dataset.wordIndex = index;
            clueElement.dataset.direction = 'horizontal';
            clueElement.innerHTML = `<strong>${wordObj.number}.</strong> ${wordObj.clue}`;
            
            clueElement.addEventListener('click', () => {
                this.selectWord(wordObj, 'horizontal');
            });
            
            horizontalContainer.appendChild(clueElement);
        });
        
        // Dicas verticais
        const verticalContainer = document.getElementById('verticalClues');
        verticalContainer.innerHTML = '';
        clues.vertical.forEach((wordObj, index) => {
            const clueElement = document.createElement('div');
            clueElement.className = 'clue-item';
            clueElement.dataset.wordIndex = index;
            clueElement.dataset.direction = 'vertical';
            clueElement.innerHTML = `<strong>${wordObj.number}.</strong> ${wordObj.clue}`;
            
            clueElement.addEventListener('click', () => {
                this.selectWord(wordObj, 'vertical');
            });
            
            verticalContainer.appendChild(clueElement);
        });
    }
    
    // Selecionar célula
    selectCell(row, col) {
        this.selectedCell = { row, col };
        this.highlightCell(row, col);
        
        // Tentar encontrar palavra que contém esta célula
        const words = this.crosswordGenerator.getPlacedWords();
        for (const word of words) {
            if (this.isCellInWord(word, row, col)) {
                this.selectWord(word, word.isHorizontal ? 'horizontal' : 'vertical');
                break;
            }
        }
    }
    
    // Verificar se a célula está em uma palavra
    isCellInWord(word, row, col) {
        if (word.isHorizontal) {
            return row === word.row && 
                   col >= word.col && 
                   col < word.col + word.word.length;
        } else {
            return col === word.col && 
                   row >= word.row && 
                   row < word.row + word.word.length;
        }
    }
    
    // Selecionar palavra
    selectWord(wordObj, direction) {
        this.selectedWord = { word: wordObj, direction };
        
        // Highlight da palavra
        this.highlightWord(wordObj);
        
        // Highlight da dica
        this.highlightClue(wordObj, direction);
        
        // Selecionar primeira célula vazia da palavra
        for (let i = 0; i < wordObj.word.length; i++) {
            const row = wordObj.isHorizontal ? wordObj.row : wordObj.row + i;
            const col = wordObj.isHorizontal ? wordObj.col + i : wordObj.col;
            
            if (!this.userGrid[row][col]) {
                this.selectedCell = { row, col };
                this.highlightCell(row, col);
                break;
            }
        }
    }
    
    // Highlight célula selecionada
    highlightCell(row, col) {
        // Remover highlights anteriores
        document.querySelectorAll('.grid-cell').forEach(cell => {
            cell.classList.remove('selected', 'highlighted');
        });
        
        // Highlight célula atual
        const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (cellElement) {
            cellElement.classList.add('selected');
        }
    }
    
    // Highlight palavra selecionada
    highlightWord(wordObj) {
        // Remover highlights anteriores
        document.querySelectorAll('.grid-cell').forEach(cell => {
            cell.classList.remove('highlighted');
        });
        
        // Highlight células da palavra
        for (let i = 0; i < wordObj.word.length; i++) {
            const row = wordObj.isHorizontal ? wordObj.row : wordObj.row + i;
            const col = wordObj.isHorizontal ? wordObj.col + i : wordObj.col;
            
            const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (cellElement) {
                cellElement.classList.add('highlighted');
            }
        }
    }
    
    // Highlight dica selecionada
    highlightClue(wordObj, direction) {
        // Remover highlights anteriores
        document.querySelectorAll('.clue-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        // Highlight dica atual
        const clueElement = document.querySelector(
            `[data-direction="${direction}"] .clue-item`
        );
        if (clueElement) {
            // Encontrar a dica correta pelo número
            const clues = document.querySelectorAll(`#${direction}Clues .clue-item`);
            clues.forEach(clue => {
                if (clue.innerHTML.includes(`${wordObj.number}.`)) {
                    clue.classList.add('selected');
                }
            });
        }
    }
    
    // Lidar com entrada do teclado virtual
    handleKeyInput(key) {
        if (!this.selectedCell) return;
        
        const { row, col } = this.selectedCell;
        
        if (key === 'BACKSPACE') {
            this.userGrid[row][col] = '';
            this.updateCellDisplay(row, col);
            this.moveToPreviousCell();
        } else if (key.length === 1) {
            this.userGrid[row][col] = key;
            this.updateCellDisplay(row, col);
            this.moveToNextCell();
            this.checkWordCompletion();
        }
    }
    
    // Lidar com entrada do teclado físico
    handleKeyboardInput(e) {
        if (!this.selectedCell) return;
        
        e.preventDefault();
        
        const key = e.key.toUpperCase();
        
        if (key === 'BACKSPACE') {
            this.handleKeyInput('BACKSPACE');
        } else if (key.match(/^[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ]$/)) {
            this.handleKeyInput(key);
        } else if (key === 'ARROWLEFT') {
            this.moveToPreviousCell();
        } else if (key === 'ARROWRIGHT') {
            this.moveToNextCell();
        }
    }
    
    // Atualizar display da célula
    updateCellDisplay(row, col) {
        const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (cellElement) {
            const numberElement = cellElement.querySelector('.number');
            const numberText = numberElement ? numberElement.textContent : '';
            cellElement.textContent = numberText + this.userGrid[row][col];
            if (numberElement) {
                cellElement.appendChild(numberElement);
            }
        }
    }
    
    // Mover para próxima célula
    moveToNextCell() {
        if (!this.selectedWord) return;
        
        const { word } = this.selectedWord;
        const currentRow = this.selectedCell.row;
        const currentCol = this.selectedCell.col;
        
        // Encontrar próxima célula vazia na palavra
        for (let i = 0; i < word.word.length; i++) {
            const row = word.isHorizontal ? word.row : word.row + i;
            const col = word.isHorizontal ? word.col + i : word.col;
            
            if ((row > currentRow || (row === currentRow && col > currentCol)) && 
                !this.userGrid[row][col]) {
                this.selectCell(row, col);
                return;
            }
        }
    }
    
    // Mover para célula anterior
    moveToPreviousCell() {
        if (!this.selectedWord) return;
        
        const { word } = this.selectedWord;
        const currentRow = this.selectedCell.row;
        const currentCol = this.selectedCell.col;
        
        // Encontrar célula anterior na palavra
        for (let i = word.word.length - 1; i >= 0; i--) {
            const row = word.isHorizontal ? word.row : word.row + i;
            const col = word.isHorizontal ? word.col + i : word.col;
            
            if (row < currentRow || (row === currentRow && col < currentCol)) {
                this.selectCell(row, col);
                return;
            }
        }
    }
    
    // Verificar se palavra foi completada
    checkWordCompletion() {
        if (!this.selectedWord) return;
        
        const { word } = this.selectedWord;
        let isComplete = true;
        let isCorrect = true;
        
        for (let i = 0; i < word.word.length; i++) {
            const row = word.isHorizontal ? word.row : word.row + i;
            const col = word.isHorizontal ? word.col + i : word.col;
            
            const userLetter = this.userGrid[row][col];
            
            if (!userLetter) {
                isComplete = false;
                break;
            }
            
            if (userLetter !== word.word[i]) {
                isCorrect = false;
            }
        }
        
        if (isComplete) {
            if (isCorrect) {
                this.markWordAsCompleted(word);
                this.createSparkleEffect();
            } else {
                this.markWordAsIncorrect(word);
            }
        }
    }
    
    // Marcar palavra como completa
    markWordAsCompleted(word) {
        this.completedWords.add(word.number);
        
        // Highlight células como corretas
        for (let i = 0; i < word.word.length; i++) {
            const row = word.isHorizontal ? word.row : word.row + i;
            const col = word.isHorizontal ? word.col + i : word.col;
            
            const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (cellElement) {
                cellElement.classList.add('correct');
            }
        }
        
        // Marcar dica como completa
        const direction = word.isHorizontal ? 'horizontal' : 'vertical';
        const clues = document.querySelectorAll(`#${direction}Clues .clue-item`);
        clues.forEach(clue => {
            if (clue.innerHTML.includes(`${word.number}.`)) {
                clue.classList.add('completed');
            }
        });
        
        this.updateStats();
        this.checkGameCompletion();
    }
    
    // Marcar palavra como incorreta
    markWordAsIncorrect(word) {
        // Highlight células como incorretas temporariamente
        for (let i = 0; i < word.word.length; i++) {
            const row = word.isHorizontal ? word.row : word.row + i;
            const col = word.isHorizontal ? word.col + i : word.col;
            
            const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (cellElement) {
                cellElement.classList.add('incorrect');
                
                // Remover classe após 2 segundos
                setTimeout(() => {
                    cellElement.classList.remove('incorrect');
                }, 2000);
            }
        }
    }
    
    // Criar efeito de brilho
    createSparkleEffect() {
        if (!this.selectedCell) return;
        
        const cellElement = document.querySelector(
            `[data-row="${this.selectedCell.row}"][data-col="${this.selectedCell.col}"]`
        );
        
        if (cellElement) {
            for (let i = 0; i < 6; i++) {
                setTimeout(() => {
                    const sparkle = document.createElement('div');
                    sparkle.className = 'sparkle';
                    sparkle.style.left = Math.random() * 30 + 'px';
                    sparkle.style.top = Math.random() * 30 + 'px';
                    cellElement.appendChild(sparkle);
                    
                    setTimeout(() => {
                        sparkle.remove();
                    }, 800);
                }, i * 100);
            }
        }
    }
    
    // Verificar se o jogo foi completado
    checkGameCompletion() {
        const totalWords = this.crosswordGenerator.getPlacedWords().length;
        
        if (this.completedWords.size === totalWords) {
            setTimeout(() => {
                alert('Parabéns! Você completou todas as palavras cruzadas! 🎉');
            }, 500);
        }
    }
    
    // Mostrar dica
    showHint() {
        if (!this.selectedWord) {
            alert('Selecione uma palavra primeiro!');
            return;
        }
        
        const { word } = this.selectedWord;
        
        // Encontrar próxima letra vazia
        for (let i = 0; i < word.word.length; i++) {
            const row = word.isHorizontal ? word.row : word.row + i;
            const col = word.isHorizontal ? word.col + i : word.col;
            
            if (!this.userGrid[row][col]) {
                this.userGrid[row][col] = word.word[i];
                this.updateCellDisplay(row, col);
                
                const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                if (cellElement) {
                    cellElement.classList.add('pulse');
                    setTimeout(() => {
                        cellElement.classList.remove('pulse');
                    }, 600);
                }
                
                this.checkWordCompletion();
                return;
            }
        }
        
        alert('Esta palavra já está completa!');
    }
    
    // Verificar respostas
    checkAnswers() {
        let correctWords = 0;
        let totalWords = 0;
        
        const placedWords = this.crosswordGenerator.getPlacedWords();
        
        placedWords.forEach(word => {
            totalWords++;
            let isWordCorrect = true;
            
            for (let i = 0; i < word.word.length; i++) {
                const row = word.isHorizontal ? word.row : word.row + i;
                const col = word.isHorizontal ? word.col + i : word.col;
                
                if (this.userGrid[row][col] !== word.word[i]) {
                    isWordCorrect = false;
                    break;
                }
            }
            
            if (isWordCorrect) {
                correctWords++;
                if (!this.completedWords.has(word.number)) {
                    this.markWordAsCompleted(word);
                }
            }
        });
        
        alert(`Você acertou ${correctWords} de ${totalWords} palavras!`);
    }
    
    // Atualizar estatísticas
    updateStats() {
        document.getElementById('wordsFound').textContent = 
            `Palavras: ${this.completedWords.size}`;
        document.getElementById('totalWords').textContent = 
            `Total: ${this.crosswordGenerator.getPlacedWords().length}`;
    }
}

// Inicializar o jogo quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new CrosswordGame();
});