<?php
header("Access-Control-Allow-Origin: *");

$data = file_get_contents("php://input");
if ($data === false) {
    echo "Errore nella lettura dei dati!";
    exit();
}

parse_str($data, $output);

if (empty($output['temperature']) || empty($output['humidity'])) {
    echo "Dati incompleti!";
    exit();
}

$output['timestamp'] = date('Y-m-d H:i:s');

// Salva i dati come JSON nel file
if (file_put_contents("dati.json", json_encode($output, JSON_PRETTY_PRINT)) === false) {
    echo "Errore nel salvataggio dei dati!";
    exit();
}

echo "Dati aggiornati!";
?>
