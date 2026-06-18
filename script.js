const form = document.getElementById("journalForm");
const entriesDiv = document.getElementById("entries");
const arcanaSelect = document.getElementById("arcana");
const cardSelect = document.getElementById("card");

const majorCards = [
    "The Fool",
    "The Magician",
    "The High Priestess",
    "The Empress",
    "The Emperor",
    "The Hierophant",
    "The Lovers",
    "The Chariot",
    "Strength",
    "The Hermit",
    "Wheel of Fortune",
    "Justice",
    "The Hanged Man",
    "Death",
    "Temperance",
    "The Devil",
    "The Tower",
    "The Star",
    "The Moon",
    "The Sun",
    "Judgement",
    "The World"
];

const minorCards = [
    "Ace of Cups",
    "Two of Cups",
    "Three of Cups",
    "Four of Cups",
    "Five of Cups",
    "Six of Cups",
    "Seven of Cups",
    "Eight of Cups",
    "Nine of Cups",
    "Ten of Cups",
    "Page of Cups",
    "Knight of Cups",
    "Queen of Cups",
    "King of Cups",

    "Ace of Wands",
    "Two of Wands",
    "Three of Wands",
    "Four of Wands",
    "Five of Wands",
    "Six of Wands",
    "Seven of Wands",
    "Eight of Wands",
    "Nine of Wands",
    "Ten of Wands",
    "Page of Wands",
    "Knight of Wands",
    "Queen of Wands",
    "King of Wands",

    "Ace of Swords",
    "Two of Swords",
    "Three of Swords",
    "Four of Swords",
    "Five of Swords",
    "Six of Swords",
    "Seven of Swords",
    "Eight of Swords",
    "Nine of Swords",
    "Ten of Swords",
    "Page of Swords",
    "Knight of Swords",
    "Queen of Swords",
    "King of Swords",

    "Ace of Pentacles",
    "Two of Pentacles",
    "Three of Pentacles",
    "Four of Pentacles",
    "Five of Pentacles",
    "Six of Pentacles",
    "Seven of Pentacles",
    "Eight of Pentacles",
    "Nine of Pentacles",
    "Ten of Pentacles",
    "Page of Pentacles",
    "Knight of Pentacles",
    "Queen of Pentacles",
    "King of Pentacles"
];

let readings = JSON.parse(localStorage.getItem("readings")) || [];

populateCardDropdown();
displayReadings();

arcanaSelect.addEventListener("change", function() {
    populateCardDropdown();
});

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const selectedCard = document.getElementById("card").value;
    const orientation = document.getElementById("orientation").value;

    const reading = {
        id: Date.now(),
        date: document.getElementById("date").value,
        cards: `${selectedCard} (${orientation})`,
        notes: document.getElementById("notes").value
    };

    readings.push(reading);

    localStorage.setItem("readings", JSON.stringify(readings));

    displayReadings();

    form.reset();
    populateCardDropdown();
});

function populateCardDropdown() {
    cardSelect.innerHTML = "";

    let cardsToShow;

    if (arcanaSelect.value === "major") {
        cardsToShow = majorCards;
    } else {
        cardsToShow = minorCards;
    }

    cardsToShow.forEach(function(card) {
        cardSelect.innerHTML += `
            <option value="${card}">${card}</option>
        `;
    });
}

function displayReadings() {
    entriesDiv.innerHTML = "";

    readings.forEach(function(reading) {
        entriesDiv.innerHTML += `
            <div class="entry">
                <h3>${reading.date}</h3>
                <strong>${reading.cards}</strong>
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

    const cardText = reading.cards.replace(" (Upright)", "").replace(" (Reversed)", "");
    const orientationText = reading.cards.includes("Reversed") ? "Reversed" : "Upright";

    document.getElementById("orientation").value = orientationText;

    if (majorCards.includes(cardText)) {
        arcanaSelect.value = "major";
    } else {
        arcanaSelect.value = "minor";
    }

    populateCardDropdown();

    cardSelect.value = cardText;

    deleteReading(id);
}
