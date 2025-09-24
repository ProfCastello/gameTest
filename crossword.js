// Classe melhorada para gerenciar o grid de palavras cruzadas
class CrosswordGenerator {
    constructor(gridSize = 15) {
        this.gridSize = gridSize;
        this.grid = [];
        this.words = [];
        this.placedWords = [];
        this.wordNumbers = new Map();
        this.currentNumber = 1;
        this.initializeGrid();
    }
    
    initializeGrid() {
        this.grid = Array(this.gridSize).fill(null).map(() => 
            Array(this.gridSize).fill({ letter: '', isBlack: false, number: 0 })
        );
    }
    
    // Algoritmo melhorado para gerar palavras cruzadas
    generateCrossword(words) {
        this.words = words;
        this.placedWords = [];
        this.wordNumbers.clear();
        this.currentNumber = 1;
        this.initializeGrid();
        
        if (words.length === 0) return false;
        
        // Filtrar palavras por tamanho útil
        const usefulWords = words.filter(w => w.word.length >= 3 && w.word.length <= 10);
        if (usefulWords.length === 0) return false;
        
        // Colocar palavras usando estratégia simples mas efetiva
        this.placeWordsSimpleStrategy(usefulWords);
        
        if (this.placedWords.length === 0) return false;
        
        this.fillBlackCells();
        this.assignNumbers();
        
        return true;
    }
    
    // Estratégia simples: colocar palavras em grade
    placeWordsSimpleStrategy(words) {
        const maxWords = Math.min(words.length, 8); // Limitar número de palavras
        let wordsPlaced = 0;
        
        // Primeira palavra no centro horizontal
        if (words.length > 0) {
            const firstWord = words[0];
            const centerRow = Math.floor(this.gridSize / 2);
            const startCol = Math.floor((this.gridSize - firstWord.word.length) / 2);
            this.placeWordSimple(firstWord, centerRow, startCol, true);
            wordsPlaced++;
        }
        
        // Segunda palavra vertical cruzando a primeira
        if (words.length > 1 && this.placedWords.length > 0) {
            const secondWord = words[1];
            const firstPlaced = this.placedWords[0];
            
            // Encontrar uma letra em comum
            for (let i = 0; i < firstPlaced.word.length; i++) {
                for (let j = 0; j < secondWord.word.length; j++) {
                    if (firstPlaced.word[i] === secondWord.word[j]) {
                        const newRow = firstPlaced.row - j;
                        const newCol = firstPlaced.col + i;
                        
                        if (this.canPlaceWordSimple(secondWord, newRow, newCol, false)) {
                            this.placeWordSimple(secondWord, newRow, newCol, false);
                            wordsPlaced++;
                            break;
                        }
                    }
                }
                if (wordsPlaced > 1) break;
            }
        }
        
        // Tentar colocar palavras restantes
        for (let i = 2; i < Math.min(words.length, maxWords); i++) {
            if (this.findAndPlaceWord(words[i])) {
                wordsPlaced++;
            }
        }
        
        console.log(`Palavras colocadas: ${wordsPlaced}`);
    }
    
    // Encontrar e colocar palavra
    findAndPlaceWord(wordObj) {
        for (const placedWord of this.placedWords) {
            for (let i = 0; i < placedWord.word.length; i++) {
                for (let j = 0; j < wordObj.word.length; j++) {
                    if (placedWord.word[i] === wordObj.word[j]) {
                        const newRow = placedWord.isHorizontal ? 
                            placedWord.row - j : 
                            placedWord.row + i;
                        const newCol = placedWord.isHorizontal ? 
                            placedWord.col + i : 
                            placedWord.col - j;
                        const newIsHorizontal = !placedWord.isHorizontal;
                        
                        if (this.canPlaceWordSimple(wordObj, newRow, newCol, newIsHorizontal)) {
                            this.placeWordSimple(wordObj, newRow, newCol, newIsHorizontal);
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
    
    // Verificação simples de posicionamento
    canPlaceWordSimple(wordObj, row, col, isHorizontal) {
        const word = wordObj.word;
        
        // Verificar limites
        if (row < 0 || col < 0) return false;
        
        if (isHorizontal) {
            if (col + word.length > this.gridSize || row >= this.gridSize) return false;
        } else {
            if (row + word.length > this.gridSize || col >= this.gridSize) return false;
        }
        
        // Verificar conflitos com palavras existentes
        for (let i = 0; i < word.length; i++) {
            const currentRow = isHorizontal ? row : row + i;
            const currentCol = isHorizontal ? col + i : col;
            
            const existingLetter = this.grid[currentRow][currentCol].letter;
            
            if (existingLetter && existingLetter !== word[i]) {
                return false;
            }
        }
        
        return true;
    }
    
    // Colocar palavra simples
    placeWordSimple(wordObj, row, col, isHorizontal) {
        const word = wordObj.word;
        
        for (let i = 0; i < word.length; i++) {
            const currentRow = isHorizontal ? row : row + i;
            const currentCol = isHorizontal ? col + i : col;
            
            this.grid[currentRow][currentCol] = {
                letter: word[i],
                isBlack: false,
                number: 0
            };
        }
        
        this.placedWords.push({
            word: word,
            clue: wordObj.clue,
            row: row,
            col: col,
            isHorizontal: isHorizontal,
            number: 0
        });
    }
    
    // Preencher células vazias com células pretas
    fillBlackCells() {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (!this.grid[row][col].letter) {
                    this.grid[row][col] = {
                        letter: '',
                        isBlack: true,
                        number: 0
                    };
                }
            }
        }
    }
    
    // Atribuir números às palavras
    assignNumbers() {
        // Percorrer o grid da esquerda para direita, de cima para baixo
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (this.grid[row][col].isBlack) continue;
                
                const hasHorizontalWord = this.hasWordStartingAt(row, col, true);
                const hasVerticalWord = this.hasWordStartingAt(row, col, false);
                
                if (hasHorizontalWord || hasVerticalWord) {
                    this.grid[row][col].number = this.currentNumber;
                    
                    // Atribuir número às palavras que começam aqui
                    for (const placedWord of this.placedWords) {
                        if (placedWord.row === row && placedWord.col === col) {
                            placedWord.number = this.currentNumber;
                        }
                    }
                    
                    this.currentNumber++;
                }
            }
        }
    }
    
    // Verificar se uma palavra começa em uma posição específica
    hasWordStartingAt(row, col, isHorizontal) {
        for (const placedWord of this.placedWords) {
            if (placedWord.row === row && 
                placedWord.col === col && 
                placedWord.isHorizontal === isHorizontal) {
                return true;
            }
        }
        return false;
    }
    
    // Obter o grid atual
    getGrid() {
        return this.grid;
    }
    
    // Obter palavras colocadas com suas informações
    getPlacedWords() {
        return this.placedWords;
    }
    
    // Obter palavras separadas por direção
    getClues() {
        const horizontal = this.placedWords
            .filter(word => word.isHorizontal)
            .sort((a, b) => a.number - b.number);
            
        const vertical = this.placedWords
            .filter(word => !word.isHorizontal)
            .sort((a, b) => a.number - b.number);
            
        return { horizontal, vertical };
    }
    
    // Verificar se o grid está completo corretamente
    isComplete(userGrid) {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const correctCell = this.grid[row][col];
                const userCell = userGrid[row][col];
                
                if (!correctCell.isBlack && 
                    correctCell.letter !== userCell.toUpperCase()) {
                    return false;
                }
            }
        }
        return true;
    }
    
    // Verificar se uma palavra específica está correta
    isWordComplete(wordIndex, userGrid) {
        if (wordIndex >= this.placedWords.length) return false;
        
        const word = this.placedWords[wordIndex];
        
        for (let i = 0; i < word.word.length; i++) {
            const row = word.isHorizontal ? word.row : word.row + i;
            const col = word.isHorizontal ? word.col + i : word.col;
            
            if (userGrid[row][col].toUpperCase() !== word.word[i]) {
                return false;
            }
        }
        
        return true;
    }
}