const form = document.getElementById("journalForm");
const entriesDiv = document.getElementById("entries");
const spreadType = document.getElementById("spreadType");
const cardFields = document.getElementById("cardFields");
const meaningPreview = document.getElementById("meaningPreview");
const searchInput = document.getElementById("searchInput");

let tarotCards = [];
let tarotData = {};
let readings = JSON.parse(localStorage.getItem("readings")) || [];

Papa.parse("export.csv", {
    download: true,
    header: true,
    complete: function(results) {
        results.data.forEach(function(card) {
            if (card.label) {
                tarotCards.push(card.label);

                tarotData[card.label] = {
                    description: card.description,
                    upright: card.description_endroit,
                    reversed: card.description_envers
                };
            }
        });

        renderCardFields();
        displayReadings();
    }
});

spreadType.addEventListener("change", renderCardFields);

form.addEventListener("submit", function(event) {
    event.preventDefault();

   const positions = getSpreadPositions();
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
        spread: getSpreadName(),
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
    const positions = getSpreadPositions();

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
    updateMeaningPreview();
    document.querySelectorAll("#cardFields select").forEach(function(select) {
    select.addEventListener("change", updateMeaningPreview);
});
}

function displayReadings() {
    entriesDiv.innerHTML = "";

    const searchTerm = searchInput.value.toLowerCase();

    const filteredReadings = readings.filter(function(reading) {
        const cardsText = reading.cards.map(function(card) {
            return `${card.position} ${card.card} ${card.orientation}`;
        }).join(" ");

        const fullText = `
            ${reading.date}
            ${reading.spread}
            ${cardsText}
            ${reading.notes}
        `.toLowerCase();

        return fullText.includes(searchTerm);
    });

    filteredReadings.forEach(function(reading) {
        const cardList = reading.cards.map(function(card) {
            const info = tarotData[card.card];

            let meaning = "Meaning not found.";
            let description = "Description not found.";

            if (info) {
                meaning = card.orientation === "Upright"
                    ? info.upright
                    : info.reversed;

                description = info.description;
            }

            return `
                <div class="card-meaning">
                    <p>
                        <strong>${card.position}:</strong>
                        ${card.card} (${card.orientation})
                    </p>

                    <details>
    <summary>Meaning</summary>
    <p>${meaning}</p>
</details>

                    
                </div>
            `;
        }).join("");

        entriesDiv.innerHTML += `
            <div class="entry">
                <h3>${reading.date}</h3>
                <h4>${reading.spread}</h4>

                ${cardList}
<h4>My Interpretation:</h4>
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

    spreadType.value = reading.spread === "Past / Present / Future" ? "three" : "one";

    renderCardFields();

    reading.cards.forEach(function(card) {
        document.getElementById(`${card.position}-card`).value = card.card;
        document.getElementById(`${card.position}-orientation`).value = card.orientation;
    });

    deleteReading(id);
}
function updateMeaningPreview() {
    if (tarotCards.length === 0) {
        return;
    }

    const positions = getSpreadPositions();

    let previewHTML = `<h3>Card Meanings</h3>`;

    positions.forEach(function(position) {
        const selectedCard = document.getElementById(`${position}-card`).value;
        const orientation = document.getElementById(`${position}-orientation`).value;
        const info = tarotData[selectedCard];

        if (!info) {
            return;
        }

        const meaning = orientation === "Upright"
            ? info.upright
            : info.reversed;

        previewHTML += `
    <div class="preview-card">
        <img class="tarot-card-img" src="${getCardImage(selectedCard)}" alt="${selectedCard}">

        <p><strong>${position}:</strong> ${selectedCard} (${orientation})</p>

        <details>
            <summary>Meaning</summary>
            <p>${meaning}</p>
        </details>
    </div>
`;
    });

    meaningPreview.innerHTML = previewHTML;
}
function getSpreadPositions() {
    if (spreadType.value === "three") {
        return ["Past", "Present", "Future"];
    }

    if (spreadType.value === "problem") {
        return ["Problem", "Advice", "Outcome"];
    }

    if (spreadType.value === "situation") {
        return ["Situation", "Obstacle", "Advice"];
    }

    if (spreadType.value === "mindbody") {
        return ["Mind", "Body", "Spirit"];
    }

    return ["Card"];
}

function getSpreadName() {
    if (spreadType.value === "three") {
        return "Past / Present / Future";
    }

    if (spreadType.value === "problem") {
        return "Problem / Advice / Outcome";
    }

    if (spreadType.value === "situation") {
        return "Situation / Obstacle / Advice";
    }

    if (spreadType.value === "mindbody") {
        return "Mind / Body / Spirit";
    }

    return "One Card";
}


function getCardImage(cardName) {
    const normalizedCardName = cardName.trim().toLowerCase();

    const majorArcana = {
        "the fool": "00-TheFool.jpg",
        "the magician": "01-TheMagician.jpg",
        "the high priestess": "02-TheHighPriestess.jpg",
        "the empress": "03-TheEmpress.jpg",
        "the emperor": "04-TheEmperor.jpg",
        "the hierophant": "05-TheHierophant.jpg",
        "the lovers": "06-TheLovers.jpg",
        "the chariot": "07-TheChariot.jpg",
        "strength": "08-Strength.jpg",
        "the hermit": "09-TheHermit.jpg",
        "wheel of fortune": "10-WheelOfFortune.jpg",
        "justice": "11-Justice.jpg",
        "the hanged man": "12-TheHangedMan.jpg",
        "death": "13-Death.jpg",
        "temperance": "14-Temperance.jpg",
        "the devil": "15-TheDevil.jpg",
        "the tower": "16-TheTower.jpg",
        "the star": "17-TheStar.jpg",
        "the moon": "18-TheMoon.jpg",
        "the sun": "19-TheSun.jpg",
        "judgement": "20-Judgement.jpg",
        "the world": "21-TheWorld.jpg"
    };

    if (majorArcana[normalizedCardName]) {
        return `images/${majorArcana[normalizedCardName]}`;
    }

    const cardNumbers = {
        "ace": "01",
        "two": "02",
        "three": "03",
        "four": "04",
        "five": "05",
        "six": "06",
        "seven": "07",
        "eight": "08",
        "nine": "09",
        "ten": "10",
        "page": "11",
        "knight": "12",
        "queen": "13",
        "king": "14"
    };

    const parts = normalizedCardName.split(" of ");
    const number = cardNumbers[parts[0]];
    const suit = parts[1];

    if (!number || !suit) {
        console.log("No image match for:", cardName);
        return "";
    }

    const formattedSuit = suit.charAt(0).toUpperCase() + suit.slice(1);

    return `images/${formattedSuit}${number}.jpg`;
}

