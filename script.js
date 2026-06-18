const form = document.getElementById("journalForm");
const entriesDiv = document.getElementById("entries");
const spreadType = document.getElementById("spreadType");
const cardFields = document.getElementById("cardFields");

const tarotCards = [
    "The Fool", "The Magician", "The High Priestess", "The Empress",
    "The Emperor", "The Hierophant", "The Lovers", "The Chariot",
    "Strength", "The Hermit", "Wheel of Fortune", "Justice",
    "The Hanged Man", "Death", "Temperance", "The Devil",
    "The Tower", "The Star", "The Moon", "The Sun",
    "Judgement", "The World",

    "Ace of Cups", "Two of Cups", "Three of Cups", "Four of Cups",
    "Five of Cups", "Six of Cups", "Seven of Cups", "Eight of Cups",
    "Nine of Cups", "Ten of Cups", "Page of Cups", "Knight of Cups",
    "Queen of Cups", "King of Cups",

    "Ace of Wands", "Two of Wands", "Three of Wands", "Four of Wands",
    "Five of Wands", "Six of Wands", "Seven of Wands", "Eight of Wands",
    "Nine of Wands", "Ten of Wands", "Page of Wands", "Knight of Wands",
    "Queen of Wands", "King of Wands",

    "Ace of Swords", "Two of Swords", "Three of Swords", "Four of Swords",
    "Five of Swords", "Six of Swords", "Seven of Swords", "Eight of Swords",
    "Nine of Swords", "Ten of Swords", "Page of Swords", "Knight of Swords",
    "Queen of Swords", "King of Swords",

    "Ace of Pentacles", "Two of Pentacles", "Three of Pentacles",
    "Four of Pentacles", "Five of Pentacles", "Six of Pentacles",
    "Seven of Pentacles", "Eight of Pentacles", "Nine of Pentacles",
    "Ten of Pentacles", "Page of Pentacles", "Knight of Pentacles",
    "Queen of Pentacles", "King of Pentacles"
];

let readings = JSON.parse(localStorage.getItem("readings")) || [];

renderCardFields();
displayReadings();

spreadType.addEventListener("change", renderCardFields);

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const positions = spreadType.value === "three"
        ? ["Past", "Present", "Future"]
        : ["Card"];

    const cards = positions.map(function(position) {
        return {
            position: position,
            card: document.getElementById(`${position}-card`).value,
            orientation: document.getElementById(`${position}-orientation`).value
        };
    });

    const reading = {
        id: Date.now(),
        date: document.getElementById("date").value,
        spread: spreadType.value === "three" ? "Past / Present / Future" : "One Card",
        cards: cards,
        notes: document.getElementById("notes").value
    };

    readings.push(reading);
    localStorage.setItem("readings", JSON.stringify(readings));

    displayReadings();
    form.reset();
    renderCardFields();
});

function renderCardFields() {
    const positions = spreadType.value === "three"
        ? ["Past", "Present", "Future"]
        : ["Card"];

    cardFields.innerHTML = "";

    positions.forEach(function(position) {
        cardFields.innerHTML += `
            <label>${position}</label>

            <select id="${position}-card" required>
                ${tarotCards.map(card => `<option value="${card}">${card}</option>`).join("")}
            </select>

            <select id="${position}-orientation" required>
                <option value="Upright">Upright</option>
                <option value="Reversed">Reversed</option>
            </select>
        `;
    });
}

function displayReadings() {
    entriesDiv.innerHTML = "";

    readings.forEach(function(reading) {

        const cardList = reading.cards.map(function(card) {
            return `
                <p>
                    <strong>${card.position}:</strong>
                    ${card.card} (${card.orientation})
                </p>
            `;
        }).join("");

        entriesDiv.innerHTML += `
            <div class="entry">
                <h3>${reading.date}</h3>

                <h4>${reading.spread}</h4>

                ${cardList}

                <p>${reading.notes}</p>

                <button onclick="editReading(${reading.id})">
                    Edit
                </button>

                <button onclick="deleteReading(${reading.id})">
                    Delete
                </button>
            </div>
        `;
    });
}

function deleteReading(id) {
    readings = readings.filter(function(reading) {
        return reading.id !== id;
    });

    localStorage.setItem("readings", JSON.stringify(readings));

    displayReadings();
}
function editReading(id) {

    const reading = readings.find(function(reading) {
        return reading.id === id;
    });

    document.getElementById("date").value = reading.date;
    document.getElementById("notes").value = reading.notes;

    if (reading.spread === "Past / Present / Future") {
        spreadType.value = "three";
    } else {
        spreadType.value = "one";
    }

    renderCardFields();

    reading.cards.forEach(function(card) {

        document.getElementById(`${card.position}-card`).value =
            card.card;

        document.getElementById(`${card.position}-orientation`).value =
            card.orientation;

    });

    deleteReading(id);
}
