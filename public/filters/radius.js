app.filter('radius', function(){
  mapDistance = function(pos, event){
    var lat1 = (Math.PI / 180) * pos.lat()   ;
    var lat2 = (Math.PI / 180) * event.venue.address.latitude ;
    var lon1 = (Math.PI / 180) * pos.lng() ; 
    var lon2 = (Math.PI / 180) * event.venue.address.longitude ;
    var x = (lon2-lon1) * Math.cos((lat1+lat2)/2);
    var y = (lat2-lat1);
    var R = 6371;
    var km2miles = 0.621371192;
    var d = Math.sqrt(x*x + y*y) * R * km2miles ;
    console.log(d);
    return d;
  };

  return function(event, scope) {
    return mapDistance(scope.coord, event) < scope.radius ; 
  }
});
