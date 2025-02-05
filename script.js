document.addEventListener("DOMContentLoaded", function () {
    function updateData() {
        fetch("dati.json")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Errore nel caricamento dei dati: " + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log(data); // Verifica che i dati siano corretti nel console log

                // Trova gli elementi HTML per la temperatura, umidità e timestamp
                const tempElement = document.getElementById("temperature");
                const humidityElement = document.getElementById("humidity");
                const timestampElement = document.getElementById("timestamp");

                console.log(tempElement, humidityElement, timestampElement); // Aggiungi questa riga per il debug

                if (tempElement && humidityElement && timestampElement) {
                    tempElement.innerText = data.temperature + " °C";
                    humidityElement.innerText = data.humidity + " %";
                    timestampElement.innerText = "⏰: " + data.timestamp;
                } else {
                    console.error("Elementi non trovati nel DOM.");
                }
            })
            .catch(error => {
                console.error("Errore nel caricamento dei dati:", error);
            });
    }

    // Aggiorna i dati ogni 10 secondi
    setInterval(updateData, 10000);
    updateData(); // Carica subito i dati
});

const snowflakeElement = document.getElementById('snowflake');
const temperatureElement = document.getElementById('temperature');

// Supponiamo che 'data.temperature' contenga il valore della temperatura
let temperature = parseFloat(data.temperature);

// Mostra il fiocchetto se la temperatura è inferiore a 1°C
if (temperature < 1) {
    snowflakeElement.style.display = 'block';
} else {
    snowflakeElement.style.display = 'none';
}

// Aggiorna la temperatura visualizzata
temperatureElement.innerText = temperature + '°C';

