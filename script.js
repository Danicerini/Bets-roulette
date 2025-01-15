document.getElementById('dioForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const maxNumber = parseInt(document.getElementById('maxNumber').value, 10);
    if (isNaN(maxNumber) || maxNumber <= 0) {
        document.getElementById('result').innerText = "Inserisci un numero valido!";
        return;
    }

    const randomNumber = Math.floor(Math.random() * maxNumber) + 1;

    let message;
    if (randomNumber < 1000000) {
        message = "Dio non esiste!";
    } else if (randomNumber > 100) {
        message = "Dio è esistito!";
    } else {
        message = "Incredibile, Dio esiste!!!";
    }

    document.getElementById('result').innerHTML = `
        ${message}
    `;
});
