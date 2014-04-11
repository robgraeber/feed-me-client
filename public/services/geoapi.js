app.service('GeoapiService', function($http){
  var uri = 'https://maps.googleapis.com/maps/api/geocode/json?sensor=false&' ;
  return {
    'getLatLng' : function( addr ){ return $http.get(uri+'address='+ addr ) },
    'getAddress': function(coord){ 
      return $http.get(uri+'latlng=' +coord.latitude+','+coord.longitude) }
  };
});
