const form = document.getElementById("journalForm");
const entriesDiv = document.getElementById("entries");

let readings = JSON.parse(localStorage.getItem("readings")) || [];

displayReadings();

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const reading = {
        id: Date.now(),
        date: document.getElementById("date").value,
        cards: document.getElementById("cards").value,
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
