
<?php

/*
    php kode som leser L�yper
     angi l�ypenr i get request

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


/*
TABELL LOYPER
NR	NAVN	 AV	ANTALLPOSTER
1	Testl�p	 B�rd	4
2	M�rk	 B�rd	3

*/

$content = mysql_query("SELECT * FROM LOYPER");
echo $content;

    while($row = mysql_fetch_array($content))
    {
       echo $row['Navn'];
    }

echo "slutt"
?>
