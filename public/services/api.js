app.service('ApiService', function($http){
  return {
    'get': function(addr){
      return $http.get('http://feedmeapi.azurewebsites.net/testdb?address='+addr);
    }
  };
});
