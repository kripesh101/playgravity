<?php

$gid = $_GET["g_id"];
$p_count = $_GET["player"];

$file3 = fopen($gid ."/seen_status.grg", "a");

fwrite($file3, $p_count ."\n");

fclose($file3);
?>