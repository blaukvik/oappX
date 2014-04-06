<?php 

/*
    javascript i sendit.js poster data til denne php siden

    siden vises ikke - men lagrer i databasen

    data er:

    - loypeNr
    - postNr
    - pos
*/

  $loypeNr = trim($_POST["loypeNr"]);
  $postNr = trim($_POST["postNr"]);
  $pos = trim($_POST["pos"]);
  
  if ($pos == "")              
    echo "Ingen posisjon"; 
  else                    
    echo "Ny posisjon= \"".$pos."\" ";
    
    
    
/* connect og login til databasen 
*/
$con = mysql_connect("localhost","oappuser","oappuser");
if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }

/* Åpne schema
*/
$db_selected = mysql_select_db("OAPP", $con);
if (!$db_selected)
  {
  die('Could not use: ' . mysql_error());
  }

  
/* legg inn i tabell  POSTER

   
*/

$result_res = mysql_query("INSERT INTO POSTER (LoypeNr, postNr, pos)
                          VALUES ('$loypeNr', '$postNr', '$pos' )");
if ($result_res == FALSE)
{
  die('Query failed: ' . mysql_error());
}


mysql_close($con);
    
?>
