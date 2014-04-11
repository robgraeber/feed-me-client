//http://proccli.com/2013/10/angularjs-geolocation-service
app.factory("GeolatlngService", 
  ['$q', 
  '$window', 
  '$rootScope', 
  'GeoapiService',
  function ($q, $window, $rootScope, GeoapiService) {
    var position0 = {'latitude': 37.7,'longitude':-122.4}; // San Francisco
    return function(address){
      var deferred = $q.defer();
      if(!address && !$window.navigator){
        $rootScope.$apply(function(){ deferred.resolve(position0)});
      } else if(!address) {
        $window.navigator.geolocation.getCurrentPosition(function(position){
          $rootScope.$apply(function(){ deferred.resolve(position.coords)});
        }, function(error){
          $rootScope.$apply(function(){ deferred.resolve(position0)});
        });
      } else {
        return GeoapiService.getLatlng(address);
      }
      return deferred.promise;
    };
  }]);
