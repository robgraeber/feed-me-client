app.controller('HomeController', 
  function(
    $scope, 
    $timeout, 
    $filter,
    $location,
    $window,
    MapService,
    MapCenterService,
    SpinnerService,
    CountService,
    TimeService,
    FeedmeService, 
    GeoapiService){
  $scope.address    = 'San Francisco';
  $scope.predicate  = 'time';
  $scope.reverse    = false;
  $scope.timeframe  = 'today';
  $scope.isVisible  = function(event){return $filter('isVisible')(event, $scope)};
  $scope.radius     = 5;
  $scope.tableHeight= .5*$window.innerHeight;
  $scope.hasEvents  = false;

  // var tempAddress   = '';
  // var filterAddressTimeout;
  $scope.getCount   = CountService.get;

  $scope.update               = function(){
    SpinnerService.start();
    // FeedmeService.get($scope.filterAddress).then(function(res){ 
    FeedmeService.get($scope.address).then(function(res){ 
      $scope.events           = res.data.results; 
      for(var i = 0 ; i < $scope.events.length ; i++){
        $scope.events[i].showDescription= false ;
        $scope.events[i].showTags       = false ;
        $scope.events[i].marker         = null  ;
        $scope.events[i].timeFMT        = TimeService.format($scope.events[i]);
        if($scope.events[i].description.length > 143){
          $scope.events[i].text = $scope.events[i].description.slice(0,143)+' ...';
        } else {
          $scope.events[i].text = $scope.events[i].description;
        }
      }
      CountService.update($scope.events);
      return MapService.update($scope.events);
    }).then(function(){
      SpinnerService.stop();
    });
  };

  SpinnerService.start();
  MapService.init($scope).then(function(position){
    $scope.update();
    $scope.$watch('radius', function(val){
      MapCenterService.setRadius(val);
      MapService.setRadius();
      $scope.update();
    });
    $scope.$watch('timeframe', function(val){
      $scope.update();
    });
//    $scope.$watch('address', function(val){
//      debugger;
//      if(filterAddressTimeout) $timeout.cancel(filterAddressTimeout);
//      tempAddress = val;
//      filterAddressTimeout      = $timeout(function() {
//        $scope.filterAddress    = tempAddress;
//        $scope.update();
//      }, 800);
//    });
  });
});
