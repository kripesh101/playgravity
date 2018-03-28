<?php
$uni = uniqid();
printf($uni);
mkdir($uni);

$file1 = fopen($uni ."/moves.grg", 'w');
$file2 = fopen($uni ."/latest.grg", "w");
$file3 = fopen($uni ."/seen_status.grg", "w");
$file4 = fopen($uni ."/players.grg", "w");
$file5 = fopen($uni ."/game_data.grg", "w");

fclose($file1);
fclose($file2);
fclose($file3);
fclose($file4);
fclose($file5);
?>
