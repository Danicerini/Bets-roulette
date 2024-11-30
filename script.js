document.addEventListener('DOMContentLoaded', () => {
    const numeriFissiCheckbox = document.getElementById('numeriFissi');
    const numeriFissiOptions = document.getElementById('numeriFissiOptions');
    const generateAdviceButton = document.getElementById('generateAdvice');
    const resultDiv = document.getElementById('result');

    // Mostra/nasconde le opzioni "Numeri Fissi"
    numeriFissiCheckbox.addEventListener('change', () => {
        numeriFissiOptions.style.display = numeriFissiCheckbox.checked ? 'block' : 'none';
    });

    // Genera consigli per la roulette
    generateAdviceButton.addEventListener('click', () => {
        const amount = parseFloat(document.getElementById('amount').value);
        if (isNaN(amount) || amount < 0.20) {
            displayError('Inserisci un importo valido di almeno €0.20.');
            return;
        }

        const selectedOptions = [];
        if (numeriFissiCheckbox.checked) {
            const numCountInput = document.getElementById('numCount');
            const numCount = parseInt(numCountInput.value);
            if (isNaN(numCount) || numCount < 1 || numCount > 36) {
                displayError('Inserisci un numero valido tra 1 e 36 per i Numeri Fissi.');
                return;
            }
            selectedOptions.push({ type: 'numeriFissi', count: numCount });
        }

        if (document.getElementById('rossoNero').checked) {
            selectedOptions.push({ type: 'rossoNero' });
        }
        if (document.getElementById('pariDispari').checked) {
            selectedOptions.push({ type: 'pariDispari' });
        }
        if (document.getElementById('dozzine').checked) {
            selectedOptions.push({ type: 'dozzine' });
        }
        if (document.getElementById('colonne').checked) {
            selectedOptions.push({ type: 'colonne' });
        }
        if (document.getElementById('meta').checked) {
            selectedOptions.push({ type: 'meta' });
        }

        if (selectedOptions.length === 0) {
            displayError('Seleziona almeno un tipo di puntata.');
            return;
        }

        resultDiv.className = '';

        // Calcola i consigli e distribuisce l'importo
        const advice = generateAdvice(amount, selectedOptions);
        resultDiv.innerHTML = advice;

        // Controllo per il saldo non utilizzato
        const totalBetAmount = parseFloat(resultDiv.querySelectorAll('li').reduce((sum, li) => sum + parseFloat(li.textContent.split('€')[1]), 0).toFixed(2));
        if (totalBetAmount < amount) {
            const unusedAmount = (amount - totalBetAmount).toFixed(2);
            displayError(`Nota: €${unusedAmount} non sono stati utilizzati (budget non speso).`);
        }
    });

    function generateAdvice(totalAmount, options) {
        const minBet = 0.2; // Puntata minima (in multipli di 0.20)
        const step = 0.2; // Incremento delle puntate (in multipli di 0.20)
        let adviceHTML = `<h2>Betting advice:</h2>`;
        let remainingAmount = totalAmount;
    
        // Gestione della parte dei numeri fissi
        const fixedNumbersOption = options.find(option => option.type === 'numeriFissi');
        if (fixedNumbersOption) {
            const numCount = fixedNumbersOption.count;
            let allocatedAmount = 0;
    
            // Calcola la puntata minima per ciascun numero fisso
            const minTotalBetForFixedNumbers = numCount * minBet;
            if (totalAmount < minTotalBetForFixedNumbers) {
                displayError('Il budget è insufficiente per coprire le puntate per tutti i numeri fissi.');
                return '';
            }
    
            // Calcola il budget disponibile per i numeri fissi
            let fixedNumbersBudget = Math.min(remainingAmount, totalAmount);
    
            // Calcola un valore medio per ciascun numero e arrotondalo al multiplo di 0.20 più vicino
            let averageBet = Math.floor((fixedNumbersBudget / numCount) / step) * step;
            averageBet = Math.max(averageBet, minBet); // Assicura che la puntata non sia inferiore al minimo
    
            adviceHTML += `<p><strong>Numeri Fissi:</strong></p><ul>`;
            const numbers = generateUniqueNumbers(numCount);
    
            numbers.forEach((number, index) => {
                if (remainingAmount <= 0) return; // Esci se non c'è più saldo disponibile
    
                // Calcola la puntata per ciascun numero (multiplo di 0.20)
                let bet = Math.min(averageBet, remainingAmount).toFixed(2);
                bet = Math.max(bet, minBet); // Assicura che la puntata non scenda sotto il minimo
    
                const color = isRedNumber(number) ? 'red' : 'black';
                adviceHTML += `<li>Puntata sul <span style="color: ${color}">${number}</span>: €${bet}</li>`;
                allocatedAmount += parseFloat(bet);
                remainingAmount -= parseFloat(bet);
    
                // Controlla se il budget è stato esaurito
                if (remainingAmount < minBet) {
                    return; // Esce se il budget non è più sufficiente per ulteriori puntate
                }
            });
            adviceHTML += `</ul>`;
        }
    
        // Distribuisce il budget rimanente tra le altre opzioni con puntate casuali
        const nonFixedOptions = options.filter(option => option.type !== 'numeriFissi');
    
        if (nonFixedOptions.length > 0 && remainingAmount >= minBet) {
            let bets = [];
            let totalBetAmount = 0;
    
            while (totalBetAmount < remainingAmount && bets.length < nonFixedOptions.length) {
                let betAmount = Math.floor(Math.random() * (remainingAmount / step)) * step;
                betAmount = Math.max(betAmount, minBet);
    
                if (totalBetAmount + betAmount <= remainingAmount) {
                    bets.push(betAmount);
                    totalBetAmount += betAmount;
                    remainingAmount -= betAmount;
                } else {
                    betAmount = remainingAmount;
                    bets.push(betAmount);
                    totalBetAmount += betAmount;
                    remainingAmount = 0;
                    break;
                }
            }
    
            // Aggiunge il resto alla ultima puntata se necessario
            if (remainingAmount > 0 && bets.length > 0) {
                bets[bets.length - 1] += remainingAmount;
                remainingAmount = 0;
            }
    
            for (let i = 0; i < nonFixedOptions.length; i++) {
                if (i < bets.length) {
                    const optionDescription = getRandomChoiceDescription(nonFixedOptions[i].type);
                    adviceHTML += `<p>${optionDescription}: Puntata €${bets[i].toFixed(2)}.</p>`;
                }
            }
        }
    
        return adviceHTML;
    }
    
    

    function isRedNumber(number) {
        const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
        return redNumbers.includes(number);
    }

    function generateUniqueNumbers(count) {
        const numbers = new Set();
        while (numbers.size < count) {
            numbers.add(Math.floor(Math.random() * 37)); // Include 0
        }
        return Array.from(numbers);
    }

    function getRandomChoiceDescription(optionType) {
        switch (optionType) {
            case 'rossoNero':
                return `Rosso/Nero: ${Math.random() < 0.5 ? 'Rosso' : 'Nero'}`;
            case 'pariDispari':
                return `Pari/Dispari: ${Math.random() < 0.5 ? 'Pari' : 'Dispari'}`;
            case 'dozzine':
                const dozzina = Math.floor(Math.random() * 3) + 1;
                return `La dozzina: ${dozzina}ª`;
            case 'colonne':
                const colonna = Math.floor(Math.random() * 3) + 1;
                return `La colonna: ${colonna}ª`;
            case 'meta':
                const meta = Math.random() < 0.5 ? '1-18' : '19-36';
                return `La Metà: ${meta}`;
            default:
                return '';
        }
    }

    function displayError(message) {
        resultDiv.innerHTML = `<span style="color: red; font-weight: bold;">${message}</span>`;
    }
});
