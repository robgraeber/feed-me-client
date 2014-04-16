app.controller('HomeController', 
  function(
    $scope, 
    $timeout, 
    $filter,
    $location,
    mapOptions, 
    tonight,
    tomorrow,
    weekdays,
    highlightMarkerUri,
    normalMarkerUri,
    pinMarkerUri,
    FeedmeService, 
    GeoapiService,
    GeolatlngService){

  // SCOPE VARIABLES
  $scope.mapOptions = Object.keys(mapOptions);
  $scope.address    = 'San Francisco';
  $scope.radius     = 5;
  $scope.predicate  = 'time';
  $scope.reverse    = false;
  $scope.timeframe  = 'today';
  $scope.isVisible  = function(event){return $filter('isVisible')(event, $scope)};
  var tempAddress   = '';
  var filterAddressTimeout;
  moment.lang('en', weekdays);  

  var mapOffset         = -0.10;
  var mapElement        = document.getElementById('map');
  var mapEvents         = [];
  var mapLastInfoWindow = null;
  var mapRadius, mapCenter;

  initMap = function(){
    GeolatlngService().then(function(pos){
      center = new google.maps.LatLng(pos.latitude, pos.longitude + mapOffset);
      var theme = $location.path() === '/' ? 'default' : $location.path();
      var mapTheme = mapOptions[theme.replace('/','')];
      mapTheme.center = center;
      mapTheme.zoomControlOptions = { 
	      style: google.maps.ZoomControlStyle.LARGE, 
	      position: google.maps.ControlPosition.RIGHT_CENTER };
      $scope.map.setCenter(mapTheme.center);
      $scope.map = new google.maps.Map(mapElement, mapTheme);
      google.maps.event.addDomListener($scope.map, 'bounds_changed', function(){
        var bounds = $scope.map.getBounds();
        var ne = bounds.getNorthEast();
        var sw = bounds.getSouthWest();
        var difflat = Math.abs(ne.lat()-sw.lat());
        var difflng = Math.abs(ne.lng()-sw.lng());
        mapOffset = difflng * .25 * (-1); 
        $scope.coord = mapCenter.getPosition();
        $scope.offsetCenter = new google.maps.LatLng(
          mapCenter.getPosition().lat(),
          mapCenter.getPosition().lng()+mapOffset);
        $scope.map.setCenter($scope.offsetCenter); 
      });
      google.maps.event.addDomListener(window, 'resize', function() { $scope.map.setCenter($scope.offsetCenter); });
      GeoapiService.getAddress(pos).then(function(address){
        $scope.address = address.data.results[0].formatted_address;
        $scope.filterMarkers();
      });
    });
  }
  
  setCenter = function(){
    var bounds = $scope.map.getBounds();
    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();
    var difflat = Math.abs(ne.lat()-sw.lat());
    var difflng = Math.abs(ne.lng()-sw.lng());
    mapOffset = difflng * .25 * (-1); 
    mapCenter && mapCenter.setMap(null);
    mapCenter && google.maps.event.clearListeners(mapCenter, "dragend");
    var pinImage = new google.maps.MarkerImage(pinMarkerUri,
      new google.maps.Size(21, 34),
      new google.maps.Point(0,0),
      new google.maps.Point(10, 34));
    mapCenter = new google.maps.Marker({
      title: 'My position',
      map: $scope.map, 
      draggable:true, 
      position: $scope.coord, 
      icon: pinImage });
    google.maps.event.addListener(mapCenter, "dragend", function(event) {
      $scope.coord = mapCenter.getPosition();
      $scope.offsetCenter = new google.maps.LatLng(
        mapCenter.getPosition().lat(),
        mapCenter.getPosition().lng()+mapOffset);
      $scope.map.setCenter($scope.offsetCenter); 
      $scope.address = mapCenter.getPosition().lat()+','+mapCenter.getPosition().lng();
      FeedmeService.get($scope.filterAddress).then(function(){ $scope.filterMarkers(); });
    });
  };

  drawRadius = function(){
    mapRadius && mapRadius.setMap(null);
    mapRadius = new google.maps.Circle({
      strokeColor: '#b2182b',
      strokeOpacity: 0.7,
      strokeWeight: 4,
      fillColor: '#b2182b',
      fillOpacity: 0.0,
      map: $scope.map,
      center: $scope.coord,
      radius: $scope.radius * 1.624 * 1000  
    });
  };

  $scope.filterMarkers = function() {
    var dat = $scope.events; 
    while(mapEvents.length > 0){ mapEvents.pop().setMap(null)};
    for (var i = 0; i < dat.length ; i++) {
      if($filter('isVisible')(dat[i], $scope)){
        venue = dat[i].venue.address;
        mapEvents.push(new google.maps.Marker({ 'title': dat[i].title }));
        id = mapEvents.length - 1;
        position = new google.maps.LatLng(venue.latitude, venue.longitude);
        mapEvents[id].setPosition(position);
        mapEvents[id].setMap($scope.map)
        dat[i].map = mapEvents[id];
        dat[i].highlightMarker = function(){ this.map.setIcon(highlightMarkerUri); };
        dat[i].normalizeMarker = function(){ this.map.setIcon(null); };
        dat[i].infoWindow = new google.maps.InfoWindow({content: dat[i].name});
        dat[i].infoWindow.setPosition(dat[i].map.getPosition());
        // http://stackoverflow.com/questions/7044587/adding-multiple-markers-with-infowindows-google-maps-api
        google.maps.event.addListener(dat[i].map, 'click', function(event) {
          return function() {
            mapLastInfoWindow && mapLastInfoWindow.close();
            mapLastInfoWindow = event.infoWindow;
            event.infoWindow.open($scope.map, event.map);
          }
        }(dat[i]));
      } 
    }
    drawRadius();
    setCenter();
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
    }, 800);
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
});
