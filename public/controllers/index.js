app.controller('HomeController', 
    function($scope, $timeout, $filter, ApiService, GeocodeService){

    moment.lang('en', { weekdays : [ "Sun", "Mon", "Tue",
      "Wed", "Thu", "Fri", "Sat" ] });  
    $scope.tagStyle = 'float:right;margin:0 4px 0 4px;opacity:.5;position:relative;height:17px';

    mapElement       = document.getElementById('map');
    mapOptions       = { 'center': new google.maps.LatLng(37.7, -122.4), 'zoom': 12, "styles": [{"featureType":"water","stylers":[{"color":"#021019"}]},{"featureType":"landscape","stylers":[{"color":"#08304b"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#0c4152"},{"lightness":5}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#0b434f"},{"lightness":25}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#0b3d51"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"}]},{"elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#000000"},{"lightness":13}]},{"featureType":"transit","stylers":[{"color":"#146474"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#144b53"},{"lightness":14},{"weight":1.4}]}]};

    $scope.initMap    = function(){
      var dat         = $scope.events; 
      var addr        = $scope.address || 'San+Francisco';
      return GeocodeService.get(addr).then(function(geoCenter){
        geoloc        = geoCenter.data.results[0].geometry.location;
        mapOptions['center'] = new google.maps.LatLng(geoloc.lat, geoloc.lng);
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
      ApiService.get($scope.filterAddress)
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
        $scope.countToday     += itime <  $scope.tonight ? 1 : 0;
        $scope.countTomorrow  += itime >= $scope.tonight && itime < $scope.tomorrow ? 1 : 0;
        $scope.countThisWeek  += itime >= $scope.tomorrow ? 1 : 0;
        dat[i].timeFMT        = moment(new Date(dat[i].time)).calendar();
        dat[i].timeFMT = dat[i].timeFMT.replace(/(Today at )|(Tomorrow at )/,'');
      }
    }

    $scope.initCounts         = function(){
      $scope.countLT1         = $scope.countLT3      = $scope.countLT5      = 0;
      $scope.countToday       = $scope.countTomorrow = $scope.countThisWeek = 0;
    };

    $scope.initDatetime       = function(){
      $scope.timeframe        = 'today';
      $scope.tonight          = new Date();
      $scope.tonight.setHours(23,59,59,999);
      $scope.tomorrow         = new Date($scope.tonight.getFullYear(), 
          $scope.tonight.getMonth(), $scope.tonight.getDate()+1);
      $scope.tomorrow.setHours(23,59,59,999);
    };

    $scope.init = function(){// INITITIALIZE CONTROLLER
      $scope.initCounts();
      $scope.initDatetime();
      $scope.address          = 'San Francisco';
      $scope.radius           = 5;
      $scope.predicate        = 'time';
      $scope.reverse          = false;
      $scope.update();      // BOOTSTRAP DATA 
    };

    $scope.init();
});
