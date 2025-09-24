// Classe para gerenciar o grid de palavras cruzadas
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
    
    // Gerar palavras cruzadas
    generateCrossword(words) {
        this.words = words;
        this.placedWords = [];
        this.wordNumbers.clear();
        this.currentNumber = 1;
        this.initializeGrid();
        
        if (words.length === 0) return false;
        
        // Ordenar palavras por tamanho (maiores primeiro para melhor encaixe)
        const sortedWords = words.sort((a, b) => b.word.length - a.word.length);
        
        // Colocar a primeira palavra no centro
        const firstWord = sortedWords[0];
        const centerRow = Math.floor(this.gridSize / 2);
        const centerCol = Math.floor((this.gridSize - firstWord.word.length) / 2);
        
        this.placeWord(firstWord, centerRow, centerCol, true); // horizontal
        
        // Tentar colocar as outras palavras com múltiplas tentativas
        for (let i = 1; i < Math.min(sortedWords.length, this.getMaxWordsForGrid()); i++) {
            let attempts = 0;
            let placed = false;
            
            while (attempts < 20 && !placed) {
                placed = this.findBestPlacement(sortedWords[i]);
                attempts++;
                
                if (!placed && attempts > 10) {
                    // Tentar posicionamento aleatório como último recurso
                    placed = this.tryRandomPlacement(sortedWords[i]);
                }
            }
        }
        
        this.fillBlackCells();
        this.assignNumbers();
        
        return true;
    }
    
    // Encontrar a melhor posição para uma palavra
    findBestPlacement(wordObj) {
        const word = wordObj.word;
        const bestPlacements = [];
        
        // Procurar intersecções com palavras já colocadas
        for (const placedWord of this.placedWords) {
            for (let i = 0; i < word.length; i++) {
                for (let j = 0; j < placedWord.word.length; j++) {
                    if (word[i] === placedWord.word[j]) {
                        // Encontrou uma letra em comum
                        const newRow = placedWord.isHorizontal ? 
                            placedWord.row - i : 
                            placedWord.row + j;
                        const newCol = placedWord.isHorizontal ? 
                            placedWord.col + j : 
                            placedWord.col - i;
                        const newIsHorizontal = !placedWord.isHorizontal;
                        
                        if (this.canPlaceWord(wordObj, newRow, newCol, newIsHorizontal)) {
                            bestPlacements.push({
                                row: newRow,
                                col: newCol,
                                isHorizontal: newIsHorizontal,
                                intersections: this.countIntersections(wordObj, newRow, newCol, newIsHorizontal)
                            });
                        }
                    }
                }
            }
        }
        
        if (bestPlacements.length > 0) {
            // Escolher o placement com mais intersecções
            bestPlacements.sort((a, b) => b.intersections - a.intersections);
            const best = bestPlacements[0];
            this.placeWord(wordObj, best.row, best.col, best.isHorizontal);
            return true;
        }
        
        return false;
    }
    
    // Tentar posicionamento aleatório
    tryRandomPlacement(wordObj) {
        const word = wordObj.word;
        const maxAttempts = 50;
        
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const isHorizontal = Math.random() < 0.5;
            const maxRow = isHorizontal ? this.gridSize - 1 : this.gridSize - word.length;
            const maxCol = isHorizontal ? this.gridSize - word.length : this.gridSize - 1;
            
            if (maxRow < 0 || maxCol < 0) continue;
            
            const row = Math.floor(Math.random() * (maxRow + 1));
            const col = Math.floor(Math.random() * (maxCol + 1));
            
            if (this.canPlaceWordLoose(wordObj, row, col, isHorizontal)) {
                this.placeWord(wordObj, row, col, isHorizontal);
                return true;
            }
        }
        
        return false;
    }
    
    // Verificação mais flexível para posicionamento
    canPlaceWordLoose(wordObj, row, col, isHorizontal) {
        const word = wordObj.word;
        
        if (row < 0 || col < 0) return false;
        
        if (isHorizontal) {
            if (col + word.length > this.gridSize) return false;
            if (row >= this.gridSize) return false;
        } else {
            if (row + word.length > this.gridSize) return false;
            if (col >= this.gridSize) return false;
        }
        
        // Verificar se há espaço suficiente
        for (let i = 0; i < word.length; i++) {
            const currentRow = isHorizontal ? row : row + i;
            const currentCol = isHorizontal ? col + i : col;
            
            const cell = this.grid[currentRow][currentCol];
            
            // Se há uma letra diferente, não pode colocar
            if (cell.letter && cell.letter !== word[i]) {
                return false;
            }
        }
        
        return true;
    }
    
    // Calcular número máximo de palavras baseado no tamanho do grid
    getMaxWordsForGrid() {
        return Math.min(this.words.length, Math.floor(this.gridSize * 1.2));
    }
    
    // Verificar se uma palavra pode ser colocada
    canPlaceWord(wordObj, row, col, isHorizontal) {
        const word = wordObj.word;
        
        if (row < 0 || col < 0) return false;
        
        if (isHorizontal) {
            if (col + word.length > this.gridSize) return false;
            if (row >= this.gridSize) return false;
        } else {
            if (row + word.length > this.gridSize) return false;
            if (col >= this.gridSize) return false;
        }
        
        // Verificar conflitos
        for (let i = 0; i < word.length; i++) {
            const currentRow = isHorizontal ? row : row + i;
            const currentCol = isHorizontal ? col + i : col;
            
            const cell = this.grid[currentRow][currentCol];
            
            if (cell.letter && cell.letter !== word[i]) {
                return false; // Conflito de letra
            }
        }
        
        // Verificar espaços adjacentes
        return this.checkAdjacentSpaces(word, row, col, isHorizontal);
    }
    
    // Verificar espaços adjacentes para evitar palavras inválidas
    checkAdjacentSpaces(word, row, col, isHorizontal) {
        for (let i = 0; i < word.length; i++) {
            const currentRow = isHorizontal ? row : row + i;
            const currentCol = isHorizontal ? col + i : col;
            
            // Verificar células adjacentes perpendiculares
            const adjacentCells = isHorizontal ? 
                [
                    { r: currentRow - 1, c: currentCol },
                    { r: currentRow + 1, c: currentCol }
                ] :
                [
                    { r: currentRow, c: currentCol - 1 },
                    { r: currentRow, c: currentCol + 1 }
                ];
            
            for (const adj of adjacentCells) {
                if (adj.r >= 0 && adj.r < this.gridSize && adj.c >= 0 && adj.c < this.gridSize) {
                    const adjCell = this.grid[adj.r][adj.c];
                    if (adjCell.letter && !this.isPartOfIntersection(currentRow, currentCol, adj.r, adj.c)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    
    // Verificar se duas células fazem parte de uma intersecção válida
    isPartOfIntersection(row1, col1, row2, col2) {
        // Implementação simplificada - verifica se as células estão em palavras cruzadas
        for (const placedWord of this.placedWords) {
            if (this.isPartOfWord(placedWord, row1, col1) && 
                this.isPartOfWord(placedWord, row2, col2)) {
                return false; // Mesma palavra, não é intersecção
            }
        }
        return true;
    }
    
    // Verificar se uma célula faz parte de uma palavra
    isPartOfWord(placedWord, row, col) {
        if (placedWord.isHorizontal) {
            return row === placedWord.row && 
                   col >= placedWord.col && 
                   col < placedWord.col + placedWord.word.length;
        } else {
            return col === placedWord.col && 
                   row >= placedWord.row && 
                   row < placedWord.row + placedWord.word.length;
        }
    }
    
    // Contar intersecções de uma palavra
    countIntersections(wordObj, row, col, isHorizontal) {
        let count = 0;
        const word = wordObj.word;
        
        for (let i = 0; i < word.length; i++) {
            const currentRow = isHorizontal ? row : row + i;
            const currentCol = isHorizontal ? col + i : col;
            
            if (this.grid[currentRow][currentCol].letter === word[i]) {
                count++;
            }
        }
        
        return count;
    }
    
    // Colocar uma palavra no grid
    placeWord(wordObj, row, col, isHorizontal) {
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
            number: 0 // Será atribuído depois
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
        const processedPositions = new Set();
        
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