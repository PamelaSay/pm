<?php

if ($_SERVER["request_mothod"] == "post") {
    $prolabore = $_POST["prolabore"];
    $margem = $_POST["margem"];
    $custos = $_POST["custos"];

    //calcula o precificação de venda necessario
    $precoVenda = $custo + $prolabore +($margem / 100 * $custos);


    // exibe o resultado
    echo("<h2>Preço de Venda: R$". number_format ($precoVenda, 2, ',','.')."</h2>");
}
error_reporting(E_ALL);
ini_set("display_errors",1);
?>