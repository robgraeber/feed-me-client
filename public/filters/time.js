app.filter('time', function(){
  return function(event, scope) {
    var aTime = new Date(event.time);
    if(scope.timeframe === "today"){
      return aTime < scope.tonight;
    } else if(scope.timeframe === "tomorrow"){
      return aTime >= scope.tonight && aTime < scope.tomorrow;
    } else if(scope.timeframe === "later"){
      return aTime >= scope.tomorrow ;
    } 
    return true;
  }
});
