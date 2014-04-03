
/* 
   -timertask som oppdaterer age ?
   -append pos to polyline
   -adjust maxage ? timeout + accu
*/

var map;
var ownPosition;
var hale;
var own_marker;
var own_circle;
var updateLocation ;
var updCount = 0;
var visEgenPos = 1;


/*
*/
function StatkartMapType(name, layer) {
  this.layer = layer;
  this.name = name;
  this.alt = name;

  this.tileSize = new google.maps.Size(256,256);
  this.maxZoom = 19;

  /* set opp funksjon som henter karttiles */
  this.getTile = function(coord, zoom, ownerDocument) {
      var div = ownerDocument.createElement('DIV');
      div.style.width = this.tileSize.width + 'px';
      div.style.height = this.tileSize.height + 'px';
      div.style.backgroundImage = "url(http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=" + this.layer + "&zoom=" + zoom + "&x=" + coord.x + "&y=" + coord.y + ")";
      return div;
    };
}

      

/*
   handler for knapp - EgenPos
*/
function HomeControl(controlDiv, map) {

  // Set CSS styles for the DIV containing the control
  // Setting padding to 5 px will offset the control
  // from the edge of the map
  controlDiv.style.padding = '5px';

  // Set CSS for the control border
  var controlUI = document.createElement('HOMEDIV');
  controlUI.style.backgroundColor = 'white';
  controlUI.style.borderStyle = 'solid';
  controlUI.style.borderWidth = '2px';
  controlUI.style.cursor = 'pointer';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Klikk for &aring; sentrere p&aring; egen pos';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior
  var controlText = document.createElement('HOMEDIV');
  controlText.style.fontFamily = 'Arial,sans-serif';
  controlText.style.fontSize = '12px';
  controlText.style.paddingLeft = '4px';
  controlText.style.paddingRight = '4px';
  controlText.innerHTML = '<b>Egen pos</b>';
  controlUI.appendChild(controlText);

  // Set event listener: set egen pos i sentrum
  google.maps.event.addDomListener(controlUI, 'click', function() {
    updCount = 0;
    setText('gpsStatus', 'Henter egen pos igjen');
  
    // check pos 
    getOwnPosition();

    // set senter
    //map.setCenter(ownPosition);
  });

}

/*
   handler for knapp - Løype
*/
function DrevControl(controlDiv, map) {

  // Setting padding to 5 px will offset the control
  // from the edge of the map
  controlDiv.style.padding = '5px';

  var controlUI = document.createElement('DREVDIV');
  controlUI.style.backgroundColor = 'white';
  controlUI.style.borderStyle = 'solid';
  controlUI.style.borderWidth = '2px';
  controlUI.style.cursor = 'pointer';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Klikk for &aring; sentrere p&aring; loype';
  controlDiv.appendChild(controlUI);

  var controlText = document.createElement('DREVDIV');
  controlText.style.fontFamily = 'Arial,sans-serif';
  controlText.style.fontSize = '12px';
  controlText.style.paddingLeft = '4px';
  controlText.style.paddingRight = '4px';
  controlText.innerHTML = '<b>Senter</b>';
  controlUI.appendChild(controlText);

  // Set event listener: sentrer på løype
  google.maps.event.addDomListener(controlUI, 'click', function() {
    map.setCenter(pos_center);
    map.setZoom(zoom_level);
  });

}

/*
   Kalles når pos kommer OK
*/
function gotPositionOK(position) {
  ownPosition = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
  var posTime = new Date(position.timestamp);

  // flytt marker dit (ble satt til center først)
  own_marker.setPosition(ownPosition);

  // flytt own_circle and update radius & color
  own_circle.setCenter(ownPosition);
  
 // set egen plass midt på kart
  map.setCenter(ownPosition);
  own_circle.setRadius(position.coords.accuracy);

  setText('gpsStatus', "upd="+updCount+"," + "gotPosOK");
  setText('gpsPos', "lat: " + position.coords.latitude + ", lon: " +position.coords.longitude);
  setOppdatertTid(posTime);
  

/*
	hale
*/
	if (hale === undefined)
	{
		var linjefarge = "#E01BE0";
		var tykkelse = 3;
		hale = new google.maps.Polyline({
			strokeColor : linjefarge,
			strokeOpacity : 1.0,
			map : map,
			strokeWeight : tykkelse
		});
	}
	else
	{
		hale.getPath().clear();
	}
         
  // cancel any old watcher       
  if(updateLocation !== null)
  {
    navigator.geolocation.clearWatch(updateLocation);  
  }  
  
  // start watching      
  updateLocation = navigator.geolocation.watchPosition(
    positionUpdateFromWatch, 
    positionUpdateFailed,
    {enableHighAccuracy:true, maximumAge:30000, timeout:30000});               
}


  /* første get etter klikk feilet, typisk timeout 
     watch er ikke startet ?
     
     
     
  */
function gotPositionFailed(error) {
  /*
       bytt til GUL
  */
  updCount = updCount + 1;
	
  setText('gpsStatus', "upd="+updCount+"," + "gotPosFailed:" + error.message);
  setText('gpsPos',"?");  
  setText('gpsAccu', "?");  
  setText('gpsAge', "?");
  
  own_marker.setIcon('yellow.png');
  
}

function setText(elem, txt)
{
	//alert("e" + elem + "-" + txt);
	
	if (document.getElementById(elem) && document.getElementById(elem).innerHTML) 
	   document.getElementById(elem).innerHTML = txt;
	
}

function setOppdatertTid(posTime) {
	setText('gpsAge', ("0" + posTime
			.getHours())
		.slice(-2) + ":" + ("0" + posTime
			.getMinutes())
		.slice(-2) + ":" + ("0" + posTime
			.getSeconds())
		.slice(-2));


}

function egenposOnClick() {

  var cb= document.getElementById("cb1");

  if (cb.checked)
  {
     setText("vis", "true");
     own_marker.setVisible(true);
     own_circle.setVisible(true);
  }
  else
  {
     setText("vis", "false");
     own_marker.setVisible(false);
     own_circle.setVisible(false);
  }
}



function positionUpdateFromWatch(position) 
{
//var now = new Date();
//var age = now.getTime() - position.timestamp;
  
//lastposition = position;
  
  ownPosition = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
  var posTime = new Date(position.timestamp);
  
  // flytt markør
  own_marker.setPosition(ownPosition);

  // lagre i historien
  if (hale.getPath().length > 50)
    hale.getPath().removeAt(0);
	
  hale.getPath().push(ownPosition);	
	
  // flytt sirkel, set radius & farge
  own_circle.setCenter(ownPosition);
  own_circle.setRadius(position.coords.accuracy);
              
  if (position.coords.accuracy > 100.0){
    own_circle.setOptions({strokeColor: '#FF0000'});  //red
  }
  else if (position.coords.accuracy > 50.0){
    own_circle.setOptions({strokeColor: 'yellow'});
  }
  else if (position.coords.accuracy > 25.0){
    own_circle.setOptions({strokeColor: '#00AA00'});  // dark green
  }
  else {//if (position.coords.accuracy > 0){
    own_circle.setOptions({strokeColor: 'green'});
  } 
  
  if (map.getBounds().contains(ownPosition))
  {
    setText("Inbounds", "ja");
  }
  else
  {
    setText("Inbounds", "nei");
    map.setCenter(ownPosition);
  }
  
  updCount = updCount + 1;
  setText('gpsStatus', "upd="+updCount+"," + "updFromWatchOK");
  setText('gpsPos', "lat: " + position.coords.latitude + ", lon: " +position.coords.longitude);  
  setText('gpsAccu', position.coords.accuracy);  
  setOppdatertTid(posTime);

  // fix postene
/*
  for (n=1; n <=num_poster; n++)
  {
   var rad = 10;

   if (map.getZoom() > 14)
   	rad = 5;
   else
   	rad = 15;
   }
*/
}

function positionUpdateFailed(error) 
{ 
  /* oppdatering feilet 
     dvs ingen ny pos i tiden ...
     bytt til '?'
     
     timertask som oppdaterer age ?
     
  */
  //var now = new Date();
  //var age = now.getTime() - lastposition.timestamp;

  
  updCount = updCount + 1;
  setText('gpsStatus', "upd="+updCount+"," + "updFromWatchFailed:" + error.message);  
  
  //setOppdatertTid(posTime);
  
  own_marker.setIcon('yellow.png');
  own_circle.setOptions({strokeColor: '#FF0000'});
  
}


function getOwnPosition() {  
  setText('gpsStatus', "leter etter gps");
  // W3C Geolocation 
  if(navigator.geolocation) 
  {  
    navigator.geolocation.getCurrentPosition(
      gotPositionOK, 
      gotPositionFailed,
      {enableHighAccuracy:true, maximumAge:30000, timeout:30000}
    );                     
  } else {
    // Browser doesn't support Geolocation
    setText('gpsStatus',  "GPS virker ikke ?");  
    alert("Kan ikke få GPS pos, er det skrudd av ?" );

    // fjern fra kart  
    if(own_marker)
    {
      own_marker.setMap(null);
    }
    if(own_circle)
    {
      own_circle.setMap(null);
    }
    // bruk drevsenter    
    ownPosition = pos_center;  
  }    
    
}


/*

*/
function initialize() {

  setText('gpsStatus', "start init");

/* set navigerings stil for maps
*/
  var useragent = navigator.userAgent;
  var myStyle;

  if (useragent.indexOf('iPhone') != -1) {
    myStyle = google.maps.NavigationControlStyle.SMALL;
  } else if (useragent.indexOf('Android') != -1 ) {
    myStyle = google.maps.NavigationControlStyle.ANDROID;    
  } else {
    myStyle = google.maps.NavigationControlStyle.DEFAULT;  // DEFAULT, SMALL, ZOOM_PAN    
  } 
    
  map = new google.maps.Map(document.getElementById("mapCanvas"),
                {
                zoom: zoom_level,
                center: pos_center,
                scaleControl : true,
                navigationControlOptions: {
                  style: myStyle
                },
                mapTypeControlOptions: {
                  mapTypeIds: ['topo2',google.maps.MapTypeId.SATELLITE, 'europa'],
                  style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
                  }
                });

  map.mapTypes.set('topo2',new StatkartMapType("Kart", "topo2"));
  
  
/*
  //flere kart i meny:
  mapTypeIds: ['kartdata2', 'sjo_hovedkart2', 'topo2', 'topo2graatone', 'toporaster2', 'europa',google.maps.MapTypeId.SATELLITE],
                 
  
  map.mapTypes.set('sjo_hovedkart2',new StatkartMapType("Sjo hovedkart", "sjo_hovedkart2"));
  map.mapTypes.set('kartdata2',new StatkartMapType("Kartdata 2", "kartdata2"));
  map.mapTypes.set('topo2graatone',new StatkartMapType("Graatone", "topo2graatone"));
  map.mapTypes.set('toporaster2',new StatkartMapType("Toporaster", "toporaster2"));
*/
  map.mapTypes.set('europa',new StatkartMapType("Europa", "europa"));

  // default maptype
  map.setMapTypeId('topo2');

  // lag "buttons"	
  var homeControlDiv = document.createElement('HOMEDIV');
  var homeControl = new HomeControl(homeControlDiv, map);
  homeControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);  
    
  var drevControlDiv = document.createElement('DREVDIV');
  var drevControl = new DrevControl(drevControlDiv, map);
  drevControlDiv.index = 2;
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(drevControlDiv);  

  /* checkbox for egen pos */
  var egenposCheckbox = document.createElement('INPUT');
  egenposCheckbox.id= "cb1";
  egenposCheckbox.checked = true;
  egenposCheckbox.type="checkbox";
  egenposCheckbox.onclick=egenposOnClick;
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(egenposCheckbox);

  /* Legg ut postene */
  setText('gpsStatus', "legger ut poster");
  var n;                  
  for (n=1; n <=num_poster; n++)
  {
     var rad = 10;

     if (map.getZoom() > 14)
   	  rad = 5;
     else
   	  rad = 15;

     var marker_post= new google.maps.Circle({center:post_pos[n-1],
                                     radius: rad,
                                     map:map,
                                     strokeColor: 'red'});                        
  }                         

  

  setText('gpsStatus', "start i senter");
    // lag egen markør - midt i kartet  
    own_marker = new google.maps.Marker({
                    position: pos_center,
		    visible: false,
                    map:map,
                    icon: 'blue.png'
                    }
                  ); 
                    
    own_circle = new google.maps.Circle({center:pos_center,
                                   radius: 1000,
		                   visible: false,
                                   map:map,
                                   strokeColor: 'red'});                        
  
  if (visEgenPos==1)
  {
	own_marker.setVisible(true);
	own_circle.setVisible(true);
  }  
 

  /* start posisjonering */
  getOwnPosition();

}

function setText(elem, txt)
{
  if(console)
     console.log(elem + ":" +txt);
}

function setOppdatertTid(posTime) {
	setText('gpsAge', ("0" + posTime
			.getHours())
		.slice(-2) + ":" + ("0" + posTime
			.getMinutes())
		.slice(-2) + ":" + ("0" + posTime
			.getSeconds())
		.slice(-2));


}


