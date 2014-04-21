app.service('MapCenterService',
    ['pinMarkerUri',
    function(pinMarkerUri){
  var radius = 5 ; // in miles
  this.center = null;
  this.home = null;

  this.lat  = function(){ return this.home.getPosition().lat(); };

  this.lng  = function(){ return this.home.getPosition().lng() ; };

  this.get  = function(){ return this.home.getPosition() ; };

  this.getRadius = function(){ return radius ; }

  this.setRadius = function(val){ radius = val; }

  this.init = function(scope, position, map){
    this.scope = scope;
    this.center && this.center.setMap(null);
    this.center && google.maps.event.clearListeners(this.center, "dragend");
    var pinImage = new google.maps.MarkerImage(pinMarkerUri,
      new google.maps.Size(21, 34),
      new google.maps.Point(0,0),
      new google.maps.Point(10, 34));
    this.home = new google.maps.Marker({ 
      'title': 'My position', 
      'map': map,
      'draggable':true, 
      'position': new google.maps.LatLng(position.latitude, position.longitude), 
      'icon': pinImage
    });
    this.set(this.home.getPosition());
    google.maps.event.addListener(this.home, "dragend", function(MapCenterService){
      return function(event) { 
        var position = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());
        MapCenterService.scope.address = position.lat()+','+position.lng();
        MapCenterService.set(position);
        MapCenterService.scope.update();
      }
    }(this));
  };

  this.set  = function(pos){
    if(!this.scope.mapWrapper.getBounds()) return;
    var ne            = this.scope.mapWrapper.getBounds().getNorthEast();
    var sw            = this.scope.mapWrapper.getBounds().getSouthWest();
    var delta         = Math.abs(ne.lng()-sw.lng()) ;
    if(!this.home){
      this.home       = pos;
      var lat         = pos.lat();
      var lng         = pos.lng();
    } else{
      var lat         = .5 * (pos.lat()+this.lat());
      var lng         = .5 * (pos.lng()+this.lng());
    }
    var offset = new google.maps.LatLng(lat, lng + delta*.25*(-1));
    this.scope.mapWrapper.setCenter(offset); 
  };
}]);
