app.controller('SearchController', 
  function($scope, SearchService, $location, $routeParams, $interval){

  $scope.times = SearchService.times;
  $scope.address = $routeParams.a || "";

  for(var i = 0; i < $scope.times.length; i++){
    if($scope.times[i].time+"" === $routeParams.t){
      $scope.time = $scope.times[i];
      break;
    }
  }

  $scope.moment = moment;

  SearchService.searchMe($routeParams.a, $routeParams.t)
  .then(function(data){
    console.log("result data:", data);
    var obj = {};
    //marks if item is first event of the day
    _.each(data.results, function(item){
      if(!obj[moment(item.time).format("dd")]){
        obj[moment(item.time).format("dd")] = true;
        item.firstEvent = true;
      }
    });
    $scope.results = [];

    if(data.results.length){ 
      $scope.results.push(data.results.shift());
    }else{
      $scope.errorText = "No meetups found :(";
    }
    if(data.results.length > 0){
      $interval(function(){
        $scope.results.push(data.results.shift());
      }, 50, data.results.length);
    }
    $scope.finishedLoading = true;
  });

  $scope.submit = function(){
    //update query parameters and search again
    $location.path("search");
    $location.search("a", $scope.address);
    if($scope.time && !!$scope.time.time){
      $location.search("t", $scope.time.time+"");
    }
  };

  //formatting numbers to 2 decimals
  $scope.round = function(num){
    return Math.floor(num * 10)/10;
  };

});

