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
  markers           = [];

  initMap = function(){
    GeolatlngService().then(function(pos){
      center = new google.maps.LatLng(pos.latitude, pos.longitude + mapOffset);
      mapOptions.center = center;
      $scope.map.setCenter(mapOptions.center);
      $scope.map = new google.maps.Map(mapElement, mapOptions);
      GeoapiService.getAddress(pos).then(function(address){
        $scope.address = address.data.results[0].formatted_address;
        $scope.filterMarkers();
      });
    });
  }

  $scope.filterMarkers = function() {
    var dat = $scope.events; 
    while(markers.length > 0){ markers.pop().setMap(null)};
    for (var i = 0; i < dat.length ; i++) {
      if($filter('isVisible')(dat[i], $scope)){
        venue = dat[i].venue.address;
        markers.push(new google.maps.Marker({ 'title': dat[i].title }));
        id = markers.length - 1;
        position = new google.maps.LatLng(venue.latitude, venue.longitude);
        markers[id].setPosition(position);
        markers[id].setMap($scope.map)
      } 
    }
    markers.push(new google.maps.Circle({
      strokeColor: '#b2182b',
      strokeOpacity: 0.35,
      strokeWeight: 2,
      fillColor: '#b2182b',
      fillOpacity: 0.0,
      map: $scope.map,
      center: $scope.coord,
      radius: $scope.radius * 1.624 * 1000  
    }));
    var pinImage = new google.maps.MarkerImage("https://chart.googleapis.com/chart?chst=d_map_xpin_icon&chld=pin_star%7Chome%7Cb2182b%7CFFFFFF",
      new google.maps.Size(21, 34),
      new google.maps.Point(0,0),
      new google.maps.Point(10, 34));
    markers.push(new google.maps.Marker({title: 'My position',
      map: $scope.map, position: $scope.coord, icon: pinImage }));
  }

  $scope.update = function(){
    FeedmeService.get($scope.filterAddress)
    .then(function(res){ 
      $scope.events = res.data.results; 
      reset();
      var dat                 = $scope.events;
      for(var i = 0 ; i < dat.length ; i++){
        dat[i].showDescription= false;
        dat[i].showTags       = false;
        dat[i].marker         = null;
      }
      count();
      GeoapiService.getLatLng($scope.address).then(function(addr){
        var pos = addr.data.results[0].geometry.location;
        $scope.coord = new google.maps.LatLng(pos.lat, pos.lng);
        $scope.offsetCenter = new google.maps.LatLng(pos.lat, pos.lng + mapOffset);
        $scope.map.setCenter($scope.offsetCenter);
        $scope.filterMarkers();
      });
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
  initMap();
  $scope.update();
  google.maps.event.addDomListener(window, 'resize', function() {
      $scope.map.setCenter($scope.offsetCenter); });
});
