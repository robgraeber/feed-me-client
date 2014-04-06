app.config(function($routeProvider) {
  $routeProvider.
    when('/', {
      templateUrl: '/templates/home.html',
       controller: 'HomeController'
    })
    .when('/search', {
      templateUrl: '/templates/search.html',
       controller: 'SearchController'
    });
});

