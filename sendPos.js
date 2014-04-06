
/* 
   js funksjoner for å sende posisjon til server

   poster data til php side

*/


function SendPosisjon() {
	
	//alert("post 1");
	
    // Lag request
    var xhr;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
        xhr = new ActiveXObject("Msxml2.XMLHTTP");
    }
    else {
        throw new Error("Ajax is not supported by this browser");
    }

    //alert("post 2");
    // handle statuscode
    xhr.onreadystatechange = function () {
    	 
    	//alert("ready: " + xhr.readyState);
    	    
        if (xhr.readyState === 4) {
        	//alert("ready: status " + xhr.status);
            if (xhr.status == 200 && xhr.status < 300) {
		setText("Svar", xhr.responseText);

                // refresh poster etter 3 sek
                //var t=setTimeout(oppdaterPoster,3000)
            }
        }
    }

    //alert("post 3");
    var userid = "meg"
    var ownPos="her";
    var tid= "nu";

    // Send pos til server 
    xhr.open('POST', 'submitPosisjon.php');
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("loypeNr=1&loperNavn="+userid+"&pos=" + ownPos + "&tid=" + tid);    

    
}
