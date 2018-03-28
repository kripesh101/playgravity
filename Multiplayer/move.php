<?php

$gid = $_GET["g_id"];
$x = $_GET["x"];
$y = $_GET["y"];
$player = $_GET["by"];
$seenfile = fopen($gid ."/seen_status.grg", "r");
$p_count = fopen($gid ."/game_data.grg", "r");
$la_data = fopen($gid ."/latest.grg", "r");
$latest_inf = fgets($la_data);
fclose($la_data);

$leng = 0;
$p_number = fgets($p_count) + 1;

while(!feof($seenfile))
{
    $nothing = fgets($seenfile);
    $leng = $leng + 1;
}

fclose($seenfile);
fclose($p_count);

$da = $x ."," .$y ."," .$player;
if ($p_number <= $leng && $da != $latest_inf)
{
    $clear_file = fopen($gid ."/seen_status.grg", "w");
    fwrite($clear_file, $player ."\n");
    
    $file2 = fopen($gid ."/moves.grg", "a"); 
    $file1 = fopen($gid ."/latest.grg", "w");
    
	
		fwrite($file1, $x ."," .$y ."," .$player);
		fwrite($file2, $x ."," .$y ."," .$player ."\n");
    
		echo "Sent";
    
    fclose($clear_file);
    fclose($file1);
    fclose($file2);
}
else
{
    echo "Invalid";
}
?>