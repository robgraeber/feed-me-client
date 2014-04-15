app.service('FeedmeService', function($http){
  return {
    'get': function(addr){
      return $http.get('http://feedmeapi.cloudapp.net/api?address='+addr);
    }
  };
});
