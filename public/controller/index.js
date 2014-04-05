app.controller('HomeController', 
    function($scope, $http, SearchService, ApiService, $location){
    $scope.radius = 5;
    $scope.map = {
      center: { latitude: 45, longitude: -73 },
      zoom: 8
    };
    $scope.distanceLessThan = function(event){
      return event.distance < $scope.radius;
    }
    ApiService.get('').then(function(res){ 
      $scope.events= res.data; 
      });
});
