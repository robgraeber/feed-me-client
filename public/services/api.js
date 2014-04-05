app.service('ApiService', function($http){
  var api     = {
    'uri': 'http://10.1.1.211:3050/testdb?address=',
    'get': function(address){
      return $http({ 
        'method':'GET', 
        'url':this.uri,
        'params':{ 'address': address }
        });
      }
    };
  return api;
});
