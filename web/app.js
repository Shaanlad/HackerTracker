var app = angular.module('HackerTracker', ['ngMaterial'])
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('pink')
    .accentPalette('orange')
    .secondaryPalette('blue');
});
