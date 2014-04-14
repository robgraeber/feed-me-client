app.service('FeedmeService', function($http){
  return {
    'get': function(addr){
      return $http.get('http://feedmeapi.azurewebsites.net/api?address='+addr);
    }
  };
});
