app.controller('HomeController',function($scope, SearchService, $location){
  $scope.times = SearchService.times;
  var currentTime = (new Date()).getTime();
});

//  // SETS DEFAULT SELECT MENU TIME TO CURRENT TIME
//  for(var i = $scope.times.length-1; 0 <= i ; i--){
//    if(currentTime > $scope.times[i].time){
//      $scope.time = $scope.times[i];
//      break;
//    }
//  }
//
//  // PASS QUERY PARAMETERS AND REDIRECT TO SEARCH ROUTE
//  $scope.submit = function(){
//    console.log("Params:", $scope.time);
//    $location.path("search");
//    $location.search("a", $scope.address);
//    if(!!$scope.time.time){
//      $location.search("t", $scope.time.time+"");
//    }
//  };
