app.controller('HomeController', 
    function($scope, $http, SearchService, ApiService, $location){

    $scope.filterByTime = function(event){
      var aTime = new Date(event.time);
      if($scope.filterByTimeValue === "today"){
        return aTime < $scope.tonight;
      } else if($scope.filterByTimeValue === "tomorrow"){
        return aTime >= $scope.tonight && aTime < $scope.tomorrow;
      } else if($scope.filterByTimeValue === "later"){
        return aTime >= $scope.tomorrow ;
      } 
      return true;
    }

    $scope.filterByRadiusLT = function(event){
      return event.distance < $scope.radius;
    }

    $scope.getByAddress = function(){
      ApiService.get($scope.address).then(function(res){ 
        var dat ;  
        $scope.events = dat = res.data.results; 
        for(var i = 0 ; i < dat.length ; i++){
          var itime              = new Date(dat[i].time);
          $scope.countLT1       += dat[i].distance < 1 ? 1 : 0;
          $scope.countLT3       += dat[i].distance < 3 ? 1 : 0;
          $scope.countLT5       += dat[i].distance < 5 ? 1 : 0;
          $scope.countToday     += itime <  $scope.tonight ? 1 : 0;
          $scope.countTomorrow  += itime >= $scope.tonight && itime < $scope.tomorrow ? 1 : 0;
          $scope.countThisWeek  += itime >= $scope.tomorrow ? 1 : 0;
          dat[i].timeFMT        = moment(new Date(dat[i].time)).calendar();
        }
      });
    };

    $scope.init = function(){// INITITIALIZE CONTROLLER
      $scope.countLT1         = $scope.countLT3      = $scope.countLT5      = 0;
      $scope.countToday       = $scope.countTomorrow = $scope.countThisWeek = 0;
      $scope.address          = 'San Francisco';
      $scope.tonight          = new Date();
      $scope.tonight.setHours(23,59,59,999);
      $scope.tomorrow         = new Date($scope.tonight.getFullYear(), 
          $scope.tonight.getMonth(), $scope.tonight.getDate()+1);
      $scope.map = { 'center': {'latitude': 45, 'longitude': -73}, 'zoom': 8 };
    };

    $scope.sortByDistance   = false;
    $scope.radius           = 5;
    $scope.init();
    $scope.getByAddress();// BOOTSTRAP DATA 
});
