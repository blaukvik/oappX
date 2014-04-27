
// constructor for Post objekt
function Post(lat, lon){
  this.lat=lat;
  this.lon= lon;
}


function loype_addPost(post)
{
  this.poster.push(post);
  this.numposter++;
}

function Loype(name, nr){

   this.navn=name;
   this.nummer=nr;
   this.numposter=0;
   this.poster = new Array();

   this.addPost=loype_addPost;

}





