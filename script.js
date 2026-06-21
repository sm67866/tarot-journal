const form = document.getElementById("journalForm");
const entriesDiv = document.getElementById("entries");
const spreadType = document.getElementById("spreadType");
const cardFields = document.getElementById("cardFields");
const meaningPreview = document.getElementById("meaningPreview");


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

    readings.forEach(function(reading) {
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
