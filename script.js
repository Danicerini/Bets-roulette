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
    } else if (randomNumber == 33 || randomNumber == 3){
        message = "Incredibile, Dio esiste!!! Ed Hai vinto un bonus di 100$";
    }else if (randomNumber == 666){
        message = "Dio non esiste, BRAVO! digitando questo numero hai vinto 1902$";
    }

    document.getElementById('result').innerHTML = `
        ${message}
    `;
});
