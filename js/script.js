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
