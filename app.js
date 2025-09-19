document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');

    // Aquí puedes usar URLs de imágenes reales o caracteres/emojis
    const cardImages = [
        '🍎', '🍊', '🍇', '🍉',
        '🍓', '🍑', '🍒', '🍋','img/lapiz.png ' ];
    // Duplicar,crear pares
    let cards = [...cardImages, ...cardImages];
    let flippedCards = [];
    let matchedCards = 0;
    let lockBoard = false; // Evita hacer clic en más cartas mientras se procesan dos

    // Barajar las cartas
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Inicializar el tablero
    function initializeGame() {
        cards = shuffle(cards);
        gameBoard.innerHTML = ''; // Limpiar el tablero por si se reinicia

        cards.forEach((image, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.name = image; // Usar el emoji/URL como identificador
            cardElement.dataset.index = index; // Para identificar cada carta única

            cardElement.innerHTML = `
                <div class="card-inner">
                    <div class="card-face card-front">?</div>
                    <div class="card-face card-back">${image.startsWith('http') || image.startsWith('data:') ? `<img src="${image}" alt="Card Image">` : image}</div>
                </div>
            `;
            cardElement.addEventListener('click', flipCard);
            gameBoard.appendChild(cardElement);
        });
    }

    // Voltear una carta
    function flipCard() {
        if (lockBoard) return;
        if (this === flippedCards[0]) return; // Evitar hacer doble clic en la misma carta

        this.classList.add('flipped');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            lockBoard = true;
            checkForMatch();
        }
    }

    // Hay coincidencia
    function checkForMatch() {
        const [firstCard, secondCard] = flippedCards;
        const isMatch = firstCard.dataset.name === secondCard.dataset.name;

        isMatch ? disableCards() : unflipCards();
    }

    // Deshabilitar cartas coincidentes
    function disableCards() {
        flippedCards[0].removeEventListener('click', flipCard);
        flippedCards[1].removeEventListener('click', flipCard);
        
        flippedCards[0].classList.add('matched');
        flippedCards[1].classList.add('matched');

        matchedCards += 2;
        resetBoard();

        if (matchedCards === cards.length) {
            setTimeout(() => alert('¡Felicidades! ¡Has encontrado todas las parejas!'), 500);
        }
    }

    // Volver a girar cartas no coincidentes
    function unflipCards() {
        setTimeout(() => {
            flippedCards[0].classList.remove('flipped');
            flippedCards[1].classList.remove('flipped');
            resetBoard();
        }, 1000); // Esperar un segundo antes de voltear
    }

    // Restablecer el estado del tablero después de cada intento
    function resetBoard() {
        [flippedCards, lockBoard] = [[], false];
    }

    initializeGame(); // Iniciar el juego al cargar la página
});