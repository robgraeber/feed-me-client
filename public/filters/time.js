app.filter('time', function(tonight, tomorrow){
  return function(event, scope) {
    var aTime = new Date(event.time);
    if(scope.timeframe === "today"){
      return aTime < tonight;
    } else if(scope.timeframe === "tomorrow"){
      return aTime >= tonight && aTime < tomorrow;
    } else if(scope.timeframe === "later"){
      return aTime >= tomorrow ;
    } 
    return true;
  }
});
