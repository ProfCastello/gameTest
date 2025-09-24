// Base de dados de palavras em português brasileiro com dicas
const wordsDatabase = {
    // Palavras de 3 letras
    3: [
        { word: "SOL", clue: "Estrela do nosso sistema solar" },
        { word: "MAR", clue: "Grande massa de água salgada" },
        { word: "CÃO", clue: "Melhor amigo do homem" },
        { word: "LUA", clue: "Satélite natural da Terra" },
        { word: "PAI", clue: "Progenitor masculino" },
        { word: "MÃE", clue: "Progenitor feminino" },
        { word: "REI", clue: "Monarca masculino" },
        { word: "LEI", clue: "Norma jurídica" },
        { word: "DOR", clue: "Sensação desagradável" },
        { word: "PAZ", clue: "Ausência de guerra" },
        { word: "VEZ", clue: "Ocasião, turno" },
        { word: "VOZ", clue: "Som produzido pelas cordas vocais" },
        { word: "FEZ", clue: "Cidade do Marrocos" },
        { word: "LUZ", clue: "Radiação que permite enxergar" },
        { word: "NÓS", clue: "Pronome pessoal da 1ª pessoa do plural" },
        { word: "SIM", clue: "Resposta afirmativa" },
        { word: "NÃO", clue: "Resposta negativa" },
        { word: "BOM", clue: "De boa qualidade" },
        { word: "MAL", clue: "Oposto de bem" },
        { word: "GEL", clue: "Substância viscosa" }
    ],
    
    // Palavras de 4 letras
    4: [
        { word: "CASA", clue: "Local onde se mora" },
        { word: "VIDA", clue: "Estado dos seres vivos" },
        { word: "AMOR", clue: "Sentimento de afeição" },
        { word: "AGUA", clue: "Líquido incolor essencial à vida" },
        { word: "FOGO", clue: "Combustão que produz chamas" },
        { word: "VENTO", clue: "Movimento do ar" },
        { word: "TEMPO", clue: "Duração dos acontecimentos" },
        { word: "MESA", clue: "Móvel com tampo plano" },
        { word: "PORTA", clue: "Abertura para entrar ou sair" },
        { word: "GATO", clue: "Felino doméstico" },
        { word: "PATO", clue: "Ave aquática" },
        { word: "RATO", clue: "Pequeno roedor" },
        { word: "BOLO", clue: "Doce assado no forno" },
        { word: "SUCO", clue: "Líquido extraído de frutas" },
        { word: "PIPA", clue: "Brinquedo que voa no vento" },
        { word: "JOGO", clue: "Atividade recreativa" },
        { word: "ARTE", clue: "Expressão criativa" },
        { word: "NEVE", clue: "Precipitação de cristais de gelo" },
        { word: "COCO", clue: "Fruto do coqueiro" },
        { word: "CAFE", clue: "Bebida estimulante" },
        { word: "CHAO", clue: "Superfície onde pisamos" },
        { word: "FLOR", clue: "Parte colorida da planta" },
        { word: "DOCE", clue: "Sabor agradável" },
        { word: "MATO", clue: "Vegetação selvagem" }
    ],
    
    // Palavras de 5 letras
    5: [
        { word: "BRASIL", clue: "País sul-americano" },
        { word: "ESCOLA", clue: "Local de ensino" },
        { word: "AMIGO", clue: "Pessoa querida" },
        { word: "VERDE", clue: "Cor da natureza" },
        { word: "AZUL", clue: "Cor do céu" },
        { word: "BRANCO", clue: "Cor da neve" },
        { word: "PRETO", clue: "Ausência de cor" },
        { word: "CARRO", clue: "Veículo de transporte" },
        { word: "AVIAO", clue: "Meio de transporte aéreo" },
        { word: "NAVIO", clue: "Embarcação grande" },
        { word: "PRAIA", clue: "Faixa de areia junto ao mar" },
        { word: "MONTE", clue: "Elevação do terreno" },
        { word: "CAMPO", clue: "Área rural" },
        { word: "FESTA", clue: "Celebração alegre" },
        { word: "MUSICA", clue: "Arte dos sons" },
        { word: "DANCA", clue: "Arte do movimento" },
        { word: "SONHO", clue: "Imagens durante o sono" },
        { word: "SORTE", clue: "Boa fortuna" },
        { word: "FELIZ", clue: "Estado de alegria" },
        { word: "TRISTE", clue: "Estado de melancolia" },
        { word: "FORCA", clue: "Energia, poder" },
        { word: "TERRA", clue: "Planeta onde vivemos" },
        { word: "LIVRO", clue: "Conjunto de páginas escritas" },
        { word: "LEITE", clue: "Líquido branco nutritivo" }
    ],
    
    // Palavras de 6 letras
    6: [
        { word: "FUTEBOL", clue: "Esporte mais popular do Brasil" },
        { word: "FAMÍLIA", clue: "Grupo de parentes" },
        { word: "TRABALHO", clue: "Atividade profissional" },
        { word: "SAÚDE", clue: "Estado de bem-estar" },
        { word: "FELICIDADE", clue: "Estado de contentamento" },
        { word: "AMIZADE", clue: "Relação entre amigos" },
        { word: "LIBERDADE", clue: "Estado de quem é livre" },
        { word: "NATUREZA", clue: "Conjunto dos seres vivos" },
        { word: "CULTURA", clue: "Conjunto de tradições" },
        { word: "HISTÓRIA", clue: "Ciência do passado" },
        { word: "CIÊNCIA", clue: "Conhecimento sistemático" },
        { word: "PALAVRA", clue: "Unidade da linguagem" },
        { word: "NÚMERO", clue: "Símbolo matemático" },
        { word: "PLANETA", clue: "Corpo celeste" },
        { word: "ANIMAL", clue: "Ser vivo que se move" },
        { word: "VEGETAL", clue: "Reino das plantas" },
        { word: "MINERAL", clue: "Substância inorgânica" },
        { word: "ENERGIA", clue: "Capacidade de realizar trabalho" },
        { word: "MATÉRIA", clue: "Substância física" },
        { word: "ESPÍRITO", clue: "Essência imaterial" },
        { word: "CORAÇÃO", clue: "Órgão que bombeia sangue" },
        { word: "CABEÇA", clue: "Parte superior do corpo" },
        { word: "PESSOA", clue: "Indivíduo humano" },
        { word: "CIDADE", clue: "Área urbana" }
    ],
    
    // Palavras de 7+ letras
    7: [
        { word: "COMPUTADOR", clue: "Máquina eletrônica de calcular" },
        { word: "TELEVISÃO", clue: "Aparelho que recebe imagens" },
        { word: "TELEFONE", clue: "Aparelho de comunicação" },
        { word: "AUTOMÓVEL", clue: "Veículo motorizado" },
        { word: "BIBLIOTECA", clue: "Local com muitos livros" },
        { word: "HOSPITAL", clue: "Local de tratamento médico" },
        { word: "UNIVERSIDADE", clue: "Instituição de ensino superior" },
        { word: "RESTAURANTE", clue: "Local para refeições" },
        { word: "SUPERMERCADO", clue: "Loja de produtos variados" },
        { word: "FARMÁCIA", clue: "Loja de medicamentos" },
        { word: "PADARIA", clue: "Local que vende pão" },
        { word: "LIVRARIA", clue: "Loja que vende livros" },
        { word: "CINEMA", clue: "Local para assistir filmes" },
        { word: "TEATRO", clue: "Local de espetáculos" },
        { word: "MUSEU", clue: "Local de exposições culturais" },
        { word: "PARQUE", clue: "Área verde de lazer" },
        { word: "JARDIM", clue: "Área cultivada com plantas" },
        { word: "FLORESTA", clue: "Grande área com árvores" },
        { word: "DESERTO", clue: "Região árida e seca" },
        { word: "OCEANO", clue: "Grande massa de água" },
        { word: "MONTANHA", clue: "Grande elevação do terreno" },
        { word: "CALENDÁRIO", clue: "Sistema de contagem do tempo" },
        { word: "DICIONÁRIO", clue: "Livro com significados de palavras" },
        { word: "FOTOGRAFIA", clue: "Arte de capturar imagens" }
    ]
};

// Função para obter palavras aleatórias
function getRandomWords(count) {
    const allWords = [];
    
    // Coletar todas as palavras de todos os tamanhos
    Object.values(wordsDatabase).forEach(wordList => {
        allWords.push(...wordList);
    });
    
    // Embaralhar e selecionar
    const shuffled = allWords.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Função para obter palavras por tamanho específico
function getWordsByLength(length, count = 10) {
    if (!wordsDatabase[length]) return [];
    
    const words = [...wordsDatabase[length]];
    const shuffled = words.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Função para obter uma mistura balanceada de palavras
function getBalancedWords(totalCount) {
    const words = [];
    const lengths = [3, 4, 5, 6, 7];
    const wordsPerLength = Math.floor(totalCount / lengths.length);
    const remainder = totalCount % lengths.length;
    
    lengths.forEach((length, index) => {
        const count = wordsPerLength + (index < remainder ? 1 : 0);
        words.push(...getWordsByLength(length, count));
    });
    
    // Se ainda precisarmos de mais palavras, adicione aleatoriamente
    while (words.length < totalCount) {
        const randomLength = lengths[Math.floor(Math.random() * lengths.length)];
        const availableWords = wordsDatabase[randomLength].filter(
            wordObj => !words.some(w => w.word === wordObj.word)
        );
        if (availableWords.length > 0) {
            words.push(availableWords[Math.floor(Math.random() * availableWords.length)]);
        } else {
            break; // Não há mais palavras disponíveis
        }
    }
    
    return words.slice(0, totalCount);
}