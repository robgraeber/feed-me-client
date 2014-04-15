app.config(function($routeProvider, mapOptions) {
  var config = {'templateUrl':'/templates/home.html', 'controller':'HomeController'};
  $routeProvider.when('/', config);
  for(var theme in mapOptions) $routeProvider.when('/'+theme, config);
});

