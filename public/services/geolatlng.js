//http://proccli.com/2013/10/angularjs-geolocation-service
app.factory("GeolatlngService", 
  ['$q', 
  '$window', 
  '$rootScope', 
  function ($q, $window, $rootScope) {
    var position0 = {'latitude': 37.7,'longitude':-122.4}; // San Francisco
    return function(){
      var deferred = $q.defer();
      if(!$window.navigator){
        $rootScope.$apply(function(){ deferred.resolve(position0)});
      } else {
        $window.navigator.geolocation.getCurrentPosition(function(position){
          $rootScope.$apply(function(){ deferred.resolve(position.coords)});
        }, function(error){
          $rootScope.$apply(function(){ deferred.resolve(position0)});
        });
      }
      return deferred.promise;
    };
  }]);
