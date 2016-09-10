angular.module('HackerTracker').controller('homeController', ['$http', '$scope', '$mdDialog', function($http, $scope, $mdDialog) {  
  $http.get('project/').then(function(response) {
      console.log(response.data);
      $scope.projects = response.data;
  }, function(response) {});
  
  $scope.showAdvanced = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: '/views/createProjectDialog.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    })
    .then(function() {
        $scope.create();
    }, function() {
        $mdDialog.cancel();
    });
  };

  $scope.logout =function () {
    $http.get('logout/');
  }

  function DialogController($http, $scope, $mdDialog) {
    $scope.name = '';
    $scope.description = '';

    $scope.cancel = function() {
        $scope.name = '';
        $scope.description = '';
        $mdDialog.cancel();
    };

    $scope.create = function() {
        $http.post("/project", {
            name: $scope.name,
            description: $scope.description
        }).then(function(response) {
            if (response.insertedIds != null) {
                window.location.reload();
            } else {
                alert(response.data.message);
            }
        }, function (response) {
            alert(response);
        });
    };
  };
}]);
