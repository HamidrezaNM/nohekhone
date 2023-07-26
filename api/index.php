<?php

    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: *');

    include 'query.php';

    $data = json_decode(file_get_contents('php://input'));

    switch ($data->method) {
        case 'getMadahes':
            echo json_encode(getMadahes());
            break;
        case 'getNohes':
            echo json_encode(getNohes());
            break;
        default:
            break;
    }
?>