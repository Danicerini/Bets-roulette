// Configurazione iniziale
const drawGraph = (processes, resources, events) => {
    // Stato iniziale delle risorse e delle assegnazioni
    const allocation = {}; // Risorse allocate ai processi
    const waiting = {};    // Risorse in attesa per i processi
    const edges = [];       // Connessioni del grafo

    processes.forEach(p => {
        allocation[p] = [];
        waiting[p] = [];
    });

    const available = {};
    resources.forEach(r => {
        available[r] = 1; // Ogni risorsa ha 1 unità disponibile
    });

    // Elaborazione degli eventi
    events.forEach(event => {
        const [process, action] = event.split(/[+-]/);
        const resource = event.slice(-2).trim();

        if (action === "+") {
            // Richiesta di risorsa
            if (available[resource] > 0) {
                available[resource]--;
                allocation[process].push(resource);
                edges.push({ from: resource, to: process, arrows: "to", color: { color: "black" } }); // Risorsa -> Processo
            } else {
                waiting[process].push(resource);
                edges.push({ from: process, to: resource, arrows: "to", color: { color: "red" } }); // Processo -> Risorsa (attesa)
            }
        } else if (action === "-") {
            // Rilascio di risorsa
            const index = allocation[process].indexOf(resource);
            if (index !== -1) {
                allocation[process].splice(index, 1);
                available[resource]++;
                edges.push({ from: process, to: resource, arrows: "to", color: { color: "green" } }); // Processo rilascia Risorsa
            }
        }
    });

    // Generazione del grafo con vis.js
    const nodes = [
        ...processes.map(p => ({ id: p, label: p, shape: "circle", color: "#FFD700" })), // Cerchi per processi
        ...resources.map(r => ({ id: r, label: r, shape: "box", color: "#90EE90" }))    // Rettangoli per risorse
    ];

    const graphData = {
        nodes: new vis.DataSet(nodes),
        edges: new vis.DataSet(edges)
    };

    const options = {
        nodes: {
            font: {
                size: 16
            }
        },
        edges: {
            arrows: {
                to: { enabled: true, scaleFactor: 1.5 } // Frecce visibili
            },
            color: {
                color: "black" // Colore predefinito delle frecce
            },
            font: {
                align: "middle"
            },
            smooth: {
                type: "curvedCW" // Curvatura per migliorare la leggibilità
            }
        },
        physics: {
            enabled: true,
            stabilization: {
                iterations: 500
            }
        }
    };

    const container = document.getElementById("graph-container");
    new vis.Network(container, graphData, options);
};

// Esempio di utilizzo del grafo con eventi che producono deadlock
document.getElementById("checkDeadlock").addEventListener("click", function () {
    const processesInput = document.getElementById("processes").value;
    const resourcesInput = document.getElementById("resources").value;
    const eventsInput = document.getElementById("events").value;

    if (!processesInput || !resourcesInput || !eventsInput) {
        document.getElementById("output").innerText = "Inserisci tutti i dati!";
        return;
    }

    const processes = processesInput.split(",").map(p => p.trim());
    const resources = resourcesInput.split(",").map(r => r.trim());
    const events = eventsInput.split(",").map(e => e.trim());

    drawGraph(processes, resources, events);
});
