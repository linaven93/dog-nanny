console.log;

const container = document.getElementById("card-container");
const newCardsBtn = document.getElementById("new-cards-btn");

const breeds = ["labrador", "husky", "pug", "beagle", "poodle"];

async function getRandomUser() {
  const res = await fetch("https://randomuser.me/api/");
  const data = await res.json();
  return data.results[0];
}

async function getDogImage() {
  const res = await fetch("https://dog.ceo/api/breeds/image/random");
  const data = await res.json();
  return data.message;
}

function getRandomBreed() {
  return breeds[Math.floor(Math.random() * breeds.length)];
}

async function createCard() {
  const user = await getRandomUser();
  const dogImage = await getDogImage();
  const breed = getRandomBreed();

  const card = document.createElement("div");
  card.classList.add("card");

  card.innerHTML = `
    <img src="${dogImage}" alt="Dog">
    <img src="${user.picture.medium}" alt="User">
    <h3>${user.name.first} ${user.name.last}</h3>
    <p>${user.location.city}</p>
    <p>Breed: ${breed}</p>
    <button class="delete-btn">Delete</button>
    <button class="chat-btn">Chat</button>
  `;

  const deleteBtn = card.querySelector(".delete-btn");

  deleteBtn.addEventListener("click", async (event) => {
    event.stopPropagation();
    card.remove();

    const newCard = await createCard();
    container.appendChild(newCard);
  });

  return card;
}

async function loadCards() {
  container.innerHTML = "";

  for (let i = 0; i < 10; i++) {
    const card = await createCard();
    container.appendChild(card);
  }
}

newCardsBtn.addEventListener("click", loadCards);

loadCards();
