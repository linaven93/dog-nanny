const container = document.getElementById("card-container");
const newCardsBtn = document.getElementById("new-cards-btn");
const breedFilter = document.getElementById("breed-filter");

const breeds = ["labrador", "husky", "pug", "beagle", "poodle"];

const dogMessages = [
  "Voff voff",
  "Grrr!",
  "Mjau??",
  "Voff!",
  "Voff voff voff",
  "WRAFF!!!",
];

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

function populateBreedFilter() {
  breeds.forEach((breed) => {
    const option = document.createElement("option");
    option.value = breed;
    option.textContent = breed;
    breedFilter.appendChild(option);
  });
}

populateBreedFilter();

async function createCard() {
  const user = await getRandomUser();
  const dogImage = await getDogImage();
  const breed = getRandomBreed();
  const chatKey = `chat-${user.name.first}-${user.name.last}`;

  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.breed = breed;

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
  const chatBtn = card.querySelector(".chat-btn");

  deleteBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    card.remove();

    const newCard = await createCard();
    container.appendChild(newCard);
  });

  chatBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    let chatBox = card.querySelector(".chat-box");

    if (chatBox) {
      chatBox.remove();
      return;
    }

    chatBox = document.createElement("div");
    chatBox.classList.add("chat-box");

    chatBox.innerHTML = `
      <p><strong>Owner:</strong> Hei! Kan du passe hunden min? 🐶</p>
      <button class="close-chat">X</button>
      <input type="text" class="chat-input" placeholder="Skriv melding..." />
      <button class="send-btn">Send</button>
      <div class="messages"></div>
    `;

    const input = chatBox.querySelector(".chat-input");
    const sendBtn = chatBox.querySelector(".send-btn");
    const messagesDiv = chatBox.querySelector(".messages");
    const closeBtn = chatBox.querySelector(".close-chat");

    function updateStorage() {
      const allMessages = [];
      messagesDiv.querySelectorAll(".message").forEach((message) => {
        allMessages.push(message.textContent);
      });

      localStorage.setItem(chatKey, JSON.stringify(allMessages));
    }

    function createMessage(text) {
      const msg = document.createElement("p");
      msg.textContent = text;
      msg.classList.add("message");

      msg.addEventListener("click", (e) => {
        e.stopPropagation();
        msg.remove();
        updateStorage();
      });

      messagesDiv.appendChild(msg);
    }

    const savedMessages = JSON.parse(localStorage.getItem(chatKey)) || [];

    savedMessages.forEach((message) => {
      createMessage(message);
    });

    sendBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      if (input.value.trim() === "") return;

      createMessage(input.value);
      input.value = "";
      updateStorage();
    });

    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      chatBox.remove();
    });

    card.appendChild(chatBox);
  });

  card.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("delete-btn") ||
      e.target.classList.contains("chat-btn") ||
      e.target.classList.contains("send-btn") ||
      e.target.classList.contains("chat-input") ||
      e.target.classList.contains("close-chat") ||
      e.target.classList.contains("message")
    ) {
      return;
    }

    let bubble = card.querySelector(".speech-bubble");

    if (bubble) {
      bubble.remove();
      return;
    }

    const message = dogMessages[Math.floor(Math.random() * dogMessages.length)];

    bubble = document.createElement("div");
    bubble.classList.add("speech-bubble");
    bubble.textContent = message;

    card.appendChild(bubble);
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

breedFilter.addEventListener("change", () => {
  const selected = breedFilter.value;
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    const deleteBtn = card.querySelector(".delete-btn");

    if (selected === "all") {
      card.style.display = "block";
      if (deleteBtn) deleteBtn.style.display = "inline-block";
    } else {
      if (card.dataset.breed === selected) {
        card.style.display = "block";
        if (deleteBtn) deleteBtn.style.display = "none";
      } else {
        card.style.display = "none";
      }
    }
  });
});

loadCards();
