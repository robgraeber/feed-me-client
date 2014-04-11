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
      GeocodeService){

    $scope.timeframe  = 'today';
    moment.lang('en', weekdays);  

    mapOffset         = -0.125;
    mapElement        = document.getElementById('map');

    $scope.initMap    = function(){
      var dat         = $scope.events; 
      var addr        = $scope.address || 'San+Francisco';
      return GeocodeService.get(addr).then(function(geoCenter){
        geoloc        = geoCenter.data.results[0].geometry.location;
        mapOptions['center'] = new google.maps.LatLng(geoloc.lat, geoloc.lng+mapOffset);
        $scope.map    = new google.maps.Map(document.getElementById('map'), mapOptions);
        for (var i    = 0; i < dat.length ; i++) {
          if(dat[i].marker){
            dat[i].marker.setMap(null);
            delete dat[i].marker;
          }
        }
      });
    };

    $scope.updateMap  = function() {
      $scope.initMap().then($scope.filterMap);
    }

    $scope.filterMap  = function(){
      var dat         = $scope.events; 
      for (var i = 0; i < dat.length ; i++) {
        venue         = dat[i].venue.address;
        if($scope.isVisible(dat[i])){
          dat[i].marker = new google.maps.Marker({ 
            'title': "Marker: " + i,
            'map':$scope.map,
            'position':new google.maps.LatLng(venue.latitude, venue.longitude)
          });
        } 
      }
    };

    $scope.isVisible  = function(event){
      return $filter('time')(event, $scope) && $filter('radius')(event, $scope);
    };

    $scope.update = function(){
      FeedmeService.get($scope.filterAddress)
      .then(function(res){ 
        $scope.events = res.data.results; })
      .then(function(){
        $scope.initCounts();
        $scope.initEvents();
        $scope.updateCount();
        $scope.updateMap();
      });
    };

    var tempAddress = '', filterAddressTimeout;

    $scope.$watch('address', function(val){
      if(filterAddressTimeout) $timeout.cancel(filterAddressTimeout);
      tempAddress = val;
      filterAddressTimeout = $timeout(function() {
        $scope.filterAddress = tempAddress;
        $scope.update();
      }, 500);
    });

    $scope.initEvents = function(){
      var dat = $scope.events;
      for(var i = 0 ; i < dat.length ; i++){
        dat[i].showDescription  = false;
        dat[i].showTags         = false;
        dat[i].marker           = null;
      }
    }

    $scope.updateCount = function(){
      var dat = $scope.events; 
      for(var i = 0 ; i < dat.length ; i++){
        var itime              = new Date(dat[i].time);
        $scope.countLT1       += dat[i].distance < 1 ? 1 : 0;
        $scope.countLT3       += dat[i].distance < 3 ? 1 : 0;
        $scope.countLT5       += dat[i].distance < 5 ? 1 : 0;
        $scope.countToday     += itime <  tonight ? 1 : 0;
        $scope.countTomorrow  += itime >= tonight && itime < tomorrow ? 1 : 0;
        $scope.countThisWeek  += itime >= tomorrow ? 1 : 0;
        dat[i].timeFMT        = moment(new Date(dat[i].time)).calendar();
        dat[i].timeFMT = dat[i].timeFMT.replace(/(Today at )|(Tomorrow at )/,'');
      }
    }

    $scope.initCounts         = function(){
      $scope.countLT1         = $scope.countLT3      = $scope.countLT5      = 0;
      $scope.countToday       = $scope.countTomorrow = $scope.countThisWeek = 0;
    };

    $scope.init = function(){// INITITIALIZE CONTROLLER
      $scope.initCounts();
      $scope.address          = 'San Francisco';
      $scope.radius           = 5;
      $scope.predicate        = 'time';
      $scope.reverse          = false;
      $scope.update();      // BOOTSTRAP DATA 
    };

    $scope.init();
});
