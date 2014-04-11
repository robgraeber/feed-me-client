app.filter('radius', function(){
  return function(event, scope) {
    return event.distance < scope.radius; 
  }
});
