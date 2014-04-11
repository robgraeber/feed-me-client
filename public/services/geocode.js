app.service('GeocodeService', function($http){
  return {
    'get': function(addr){
      return $http.get('https://maps.googleapis.com/maps/api/geocode/json?address='+addr+'&sensor=false')
    }
  };
});
