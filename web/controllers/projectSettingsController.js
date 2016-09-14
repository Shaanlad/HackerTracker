angular.module('HackerTracker').controller('projectSettingsController', ['$http', '$scope', '$routeParams', '$mdDialog', '$mdToast', '$location', function($http, $scope, $routeParams, $mdDialog, $mdToast, $location) {
    $scope.initProject = function () {
        $http.get('project/' + $routeParams.id).then(function(response) {
            $scope.project = response.data;
        });
    }

    $scope.initProject();

    $scope.centerAnchor = true;
    
    $scope.toggleCenterAnchor = function () {
        $scope.centerAnchor = !$scope.centerAnchor
    }

    $scope.initUsers = function() {
        $http.get('users/' + $routeParams.id).then(function(response) {
            $scope.users = response.data;
            console.log($scope.users);
        }); 
    };

    $scope.initUsers();
}]);