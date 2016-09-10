var app = angular.module('HackerTracker', ['ngMaterial','ngRoute','ngDraggable']);
app.config(function($mdThemingProvider, $routeProvider) {
  $mdThemingProvider.theme('default');

  $routeProvider
  	.when('/', {
        templateUrl : 'views/home.html',
        controller  : 'homeController'
    })
    .when('/project/:id',{
    	templateUrl : 'views/project.html',
    	controller 	: 'projectController'
    })

});
