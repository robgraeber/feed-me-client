app.service('MapService', [
    '$filter',
    'GeoapiService',
    'MapCenterService',
    'MapRouteService',
    'MapMarkerService',
    'highlightMarkerUri',
    'normalMarkerUri',
    'pinMarkerUri',
    'mapOptions', 
    function($filter,
      GeoapiService, 
      MapCenterService, 
      MapRouteService, 
      MapMarkerService,
      highlightMarkerUri,
      normalMarkerUri,
      pinMarkerUri, 
      mapOptions){
  var radius, center ; 
  this.element        = document.getElementById('map');

  this.get            = function(){ return this.mapWrapper; };

  this.getCenter      = function(){ return MapCenterService.get();};

  this.set            = function(anAddress){
    return GeoapiService.getLatLng(anAddress).then(function(addr){
      var pos = addr.data.results[0].geometry.location;
      MapCenterService.set(new google.maps.LatLng(pos.lat, pos.lng));
    });
  };

  this.getRadius      = function(){ return radius };

  this.setRadius      = function(){
    radius && radius.setMap(null);
    radius = new google.maps.Circle({
      'strokeColor'   : '#b2182b',
      'strokeOpacity' : 0.7,
      'strokeWeight'  : 4,
      'fillColor'     : '#b2182b',
      'fillOpacity'   : 0.0,
      'map'           : map,
      'center'        : MapCenterService.get(),
      'radius'        : MapCenterService.getRadius() * 1.624 * 1000  
    });
  };

  this.update           = function(events){
    MapMarkerService.flush();
    for (var i = 0; i < events.length ; i++) {
      if($filter('isVisible')(events[i], this.scope)){
        MapMarkerService.mixin(events[i], this.get());
      } 
    }
  };

  this.init           = function(scope){
    this.scope        = scope;
    this.mapWrapper = scope.mapWrapper = new google.maps.Map(map, mapOptions.default);
    this.address      = scope.address;
    return GeoapiService.init().then(function(position){
      var point = new google.maps.LatLng(position.latitude, position.longitude);
      MapCenterService.init(scope, position, scope.mapWrapper);
      MapRouteService.init(scope.mapWrapper);
      // ON WINDOW RESIZE, AUTO RE-CENTER THE MAP
      google.maps.event.addDomListener(window, 'resize', function(event) {
        MapCenterService.set(MapCenterService.get()); 
      });
      // CHANGE ADDRESS FOR THE FORMATTED ONE GIVEN LAT-LON OF BROWSER 
      GeoapiService.getAddress(position).then(function(res){
        scope.address = res.data.results[0].formatted_address;
      });
    })
  };
}]);
