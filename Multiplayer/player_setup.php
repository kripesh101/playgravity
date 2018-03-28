<?php
$gid = $_GET["g_id"];
$pname = $_GET["player_name"];
$pcolor = $_GET["color"];
$file3 = fopen($gid ."/players.grg", "r");
$file4 = fopen($gid ."/game_data.grg", "r");

$player = fgets($file4);
fclose($file4);
$simp = 0;

$line = 1;
while(!feof($file3)) 
{
    $compare = fgets($file3);
    if ($line % 2 == 0)
    {
        if ($compare == $pcolor ."\n")
        {
            printf("ERR1");
            $simp = 0;
            break;
        }
        else
        {
            $simp = 1;
        }
    }
    else 
    {
        if ($compare == $pname ."\n")
        {
            printf("ERR2");
            $simp = 0;
            break;
        }
        else
        {
            $simp = 1;
        }
    }
    $line = $line + 1;
}

fclose($file3);

if ($player * 2 == $line - 2 && $simp == 1){
    printf("ERR3");
}

else if ($simp == 1)
    {
    $file1 = fopen($gid ."/players.grg", "a");
    fwrite($file1, $pname ."\n" .$pcolor ."\n");
    fclose($file1);
    }

?>