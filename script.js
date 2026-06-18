const form = document.getElementById("journalForm");
const entriesDiv = document.getElementById("entries");

let readings = JSON.parse(localStorage.getItem("readings")) || [];

displayReadings();

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const reading = {
        date: document.getElementById("date").value,
        cards: document.getElementById("cards").value,
        notes: document.getElementById("notes").value
    };

    readings.push(reading);

    localStorage.setItem(
        "readings",
        JSON.stringify(readings)
    );

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
            </div>
        `;

    });
}
