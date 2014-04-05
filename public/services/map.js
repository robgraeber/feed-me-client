app.service('SearchService', function($http){
  var uri   = 'https://maps.googleapis.com/maps/api/js' ;
  var key   = 'AIzaSyDsN5VgdjwUBJVHlIyAE8ROKYwIYOYfM6U' ;
  var sensor= 'true' ;

  // PARSE URL
  $scope.GMAP_URI = uri+'?key='+key+'&sensor='+sensor;

  // INITIALIZE GOOGLE MAPS 
  var opt = {
    'center': new google.maps.LatLng(-34.397, 150.644),
    'zoom'  : 8 };
  var map = new google.maps.Map(document.getElementById("map-canvas"), opt);

  // ADD EVENT LISTENER ON WINDOW
  google.maps.event.addDomListener(window, 'load', initialize);
});
