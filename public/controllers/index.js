app.controller('HomeController', 
    function(
      $scope, 
      $timeout, 
      $filter,
      mapOptions, 
      tonight,
      tomorrow,
      weekdays,
      FeedmeService, 
      GeoapiService,
      GeolatlngService){

    // SCOPE VARIABLES
    $scope.address    = 'San Francisco';
    $scope.radius     = 5;
    $scope.predicate  = 'time';
    $scope.reverse    = false;
    $scope.timeframe  = 'today';
    $scope.isVisible  = function(event){return $filter('isVisible')(event, $scope)};
    var tempAddress   = '';
    var filterAddressTimeout;
    moment.lang('en', weekdays);  

    mapOffset         = -0.0625;
    mapElement        = document.getElementById('map');

    initMap = function(){
      var dat         = $scope.events; 
      var addr        = $scope.address || 'San+Francisco';
      return GeolatlngService().then(function(pos){
        mapOptions.center = new google.maps.LatLng(pos.latitude,pos.longitude+mapOffset);
        $scope.map    = new google.maps.Map(mapElement, mapOptions);
        for (var i    = 0; i < dat.length ; i++) {
          if(dat[i].marker){
            dat[i].marker.setMap(null);
            delete dat[i].marker;
          }
        }
        GeoapiService.getAddress(pos).then(function(address){
          $scope.address = address.data.results[0].formatted_address;
        });
      });
    };

    updateMap  = function() {
      initMap().then(function(){
        var dat         = $scope.events; 
        for (var i = 0; i < dat.length ; i++) {
          venue         = dat[i].venue.address;
          if($filter('isVisible')(dat[i], $scope)){
            dat[i].marker = new google.maps.Marker({ 
              'title': "Marker: " + i,
              'map':$scope.map,
              'position':new google.maps.LatLng(venue.latitude, venue.longitude)
            });
          } 
        }
      });
    }

    $scope.update = function(){
      FeedmeService.get($scope.filterAddress)
      .then(function(res){ 
        $scope.events = res.data.results; })
      .then(function(){
        reset();
        var dat                 = $scope.events;
        for(var i = 0 ; i < dat.length ; i++){
          dat[i].showDescription= false;
          dat[i].showTags       = false;
          dat[i].marker         = null;
        }
        count();
        updateMap();
      });
    };

    $scope.$watch('address', function(val){
      if(filterAddressTimeout) $timeout.cancel(filterAddressTimeout);
      tempAddress = val;
      filterAddressTimeout      = $timeout(function() {
        $scope.filterAddress    = tempAddress;
        $scope.update();
      }, 500);
    });

    count = function(){
      var dat = $scope.events; 
      for(var i = 0 ; i < dat.length ; i++){
        var itime               = new Date(dat[i].time);
        $scope.countLT1         += dat[i].distance < 1 ? 1 : 0;
        $scope.countLT3         += dat[i].distance < 3 ? 1 : 0;
        $scope.countLT5         += dat[i].distance < 5 ? 1 : 0;
        $scope.countToday       += itime <  tonight ? 1 : 0;
        $scope.countTomorrow    += itime >= tonight && itime < tomorrow ? 1 : 0;
        $scope.countThisWeek    += itime >= tomorrow ? 1 : 0;
        dat[i].timeFMT          = moment(new Date(dat[i].time)).calendar();
        dat[i].timeFMT = dat[i].timeFMT.replace(/(Today at )|(Tomorrow at )/,'');
      }
    }

    reset                = function(){
      $scope.countLT1    = $scope.countLT3      = $scope.countLT5      = 0;
      $scope.countToday  = $scope.countTomorrow = $scope.countThisWeek = 0;
    };

    reset();
    $scope.update();
});
