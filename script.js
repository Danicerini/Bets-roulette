document.getElementById('dioForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const maxNumber = parseInt(document.getElementById('maxNumber').value, 10);
    const resultElement = document.getElementById('result');

    if (isNaN(maxNumber) || maxNumber <= 0) {
        resultElement.innerText = "Inserisci un numero valido!";
        return;
    }

    const randomNumber = Math.floor(Math.random() * maxNumber) + 1;

    let message;

    switch (randomNumber) {
        case 33:
        case 3:
            message = "Incredibile, Dio esiste!!! Ed hai vinto un bonus di 100$";
            break;
        case 666:
            message = "Dio non esiste, BRAVO! Digitando questo numero hai vinto 1902$";
            break;
        default:
            if (randomNumber < 1000000) {
                message = "Dio non esiste!";
            } else if (randomNumber > 100) {
                message = "Dio è esistito!";
            }
            break;
    }

    resultElement.innerHTML = message;
});
