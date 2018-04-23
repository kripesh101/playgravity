<?php
$gid = $_GET["g_id"];
$p_no = $_GET["nop"];
$gr = $_GET["gridr"];
$gc = $_GET["gridc"];
$p1name = strip_tags($_GET["pname"]);
$p1color = $_GET["color"];

$file5 = fopen($gid ."/game_data.grg", "w");
$file1 = fopen($gid ."/players.grg", "w");
fwrite($file5, $p_no ."\n" .$gr ."\n" .$gc);
fwrite($file1, $p1name ."\n" .$p1color ."\n");

fclose($file1);
fclose($file5);
?>