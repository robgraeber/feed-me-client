app.service('SearchService', function($http){
  // DEFINE THE TIME BLOCKS OF THE DAY
  this.times = [
    {'value':'breakfast'  , 'text':'Breakfast'}, 
    {'value':'lunch'      , 'text':'Lunch'    }, 
    {'value':'evening'    , 'text':'Evening'  }];

  // RETRIEVE results FROM REST-API 
  this.searchMe = function(address, time){
    console.log("GET /results from server, address:", address, "time:", time);
    return $http({
      url: "127.0.0.1:6542/results", 
      method: "GET",
      params: {
        'address': address, 
        'time': time
      }
    }).then(function(response){
      return response.data;
    });
  };
});
