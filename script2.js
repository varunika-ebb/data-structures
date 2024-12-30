// Game logic
const cards = [];
const images = [
   "https://e7.pngegg.com/pngimages/496/496/png-clipart-dora-the-explorer-illustration-dora-animated-cartoon-character-cartoon-characters-dora-the-explorer-s-miscellaneous-television.png",
   "https://cn.i.cdn.ti-platform.com/content/2302/pokemon/showpage/za/pokemon_icon_cms.ec3b1bb3.png",
   "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAf22Vce6NmiByfgU9balaRVUpp_Jfp51VWg&usqp=CAU",
   "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyV5dFF0lhZRi5D0wMFgyNjW2dGkT_C1JsUg&usqp=CAU",
   "https://www.animaker.com/hub/wp-content/uploads/2023/03/Mickey_Mouse_Disney_1.webp",
   "https://m.media-amazon.com/images/I/51DwGfBvcBL._AC_UF894,1000_QL80_.jpg",
   "https://i.pinimg.com/originals/9b/a2/57/9ba25796112cad616be27e473ae1e149.jpg",
   "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaxkYo0mIcMOAJFrzJciMmJA12GRdt0mlXKA&usqp=CAU"
];

let firstCardClicked = null;
let secondCardClicked = null;

function createGame() {
    for (let i = 0; i < 8; i++) {
        cards.push({ id: i, imageUrl: images[i], matched: false });
        cards.push({ id: i, imageUrl: images[i], matched: false });
    }
    shuffle(cards);
    displayCards(cards);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function displayCards(cards) {
    const gameContainer = document.getElementById("game-container");
    cards.forEach(card => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        const imgElement = document.createElement("img");
        imgElement.src = "https://via.placeholder.com/150/000000/FFFFFF?text=Closed";
        imgElement.dataset.imageUrl = card.imageUrl;
        imgElement.addEventListener("click", () => handleCardClick(imgElement));
        cardElement.appendChild(imgElement);
        gameContainer.appendChild(cardElement);
    });
}

function handleCardClick(imgElement) {
    if (!firstCardClicked) {
        firstCardClicked = imgElement;
        firstCardClicked.src = firstCardClicked.dataset.imageUrl;
    } else if (!secondCardClicked) {
        secondCardClicked = imgElement;
        secondCardClicked.src = secondCardClicked.dataset.imageUrl;
        setTimeout(checkForMatch, 1000);
    }
}

function checkForMatch() {
    if (firstCardClicked.dataset.imageUrl === secondCardClicked.dataset.imageUrl) {
        firstCardClicked.removeEventListener("click", () => handleCardClick(firstCardClicked));
        secondCardClicked.removeEventListener("click", () => handleCardClick(secondCardClicked));
    } else {
        firstCardClicked.src = "https://via.placeholder.com/150/000000/FFFFFF?text=Closed";
        secondCardClicked.src = "https://via.placeholder.com/150/000000/FFFFFF?text=Closed";
    }
    firstCardClicked = null;
    secondCardClicked = null;
}

createGame();
