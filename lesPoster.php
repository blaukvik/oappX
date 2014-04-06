
<?php

/*
    php kode som leser postposisjoner fra databasen
     angi løypenr i get request

*/

/* login i databasen

*/
$con = mysql_connect("localhost","oappbruker","oappbruker");
if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }

$db_selected = mysql_select_db("oapp", $con);
if (!$db_selected)
  {
  die('Could not use: ' . mysql_error());
  }


/* les tabell */
//$page = $_GET['$page'];
//$item = $_GET['$item'];
//$getContentQuery = "SELECT content FROM myTable WHERE page='".$page."' AND item='".$item."'";
//$content = mysql_query($getContentQuery, $db);


/*
TABELL LOYPER
NR	NAVN	 AV	ANTALLPOSTER
1	Testløp	 Bård	4
2	Mørk	 Bård	3


TABELL POSTER
LOPYE POSTNR POS
1 	0    x,y
1 	1 
1 	2 
1 	3 
1 	4 


*/

$loypeNr = $_GET["loypeNr"];
if ($loypeNr == null || loypeNr > 2)
   loypeNr=1;

$content = mysql_query("SELECT * FROM POSTER where loypenr='".$lopyeNr."'");
//echo $content;

    while($row = mysql_fetch_array($content))
    {
       echo $row['pos'];
    }

echo "slutt"
?>
