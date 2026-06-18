const form = document.getElementById("journalForm");
const entriesDiv = document.getElementById("entries");

let readings = JSON.parse(localStorage.getItem("readings")) || [];

displayReadings();

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
});

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
    document.getElementById("cards").value = reading.cards;
    document.getElementById("notes").value = reading.notes;

    deleteReading(id);
}
