angular.module('HackerTracker').controller('projectController', ['$http', '$scope', '$routeParams', '$mdDialog', function($http, $scope, $routeParams, $mdDialog) {

    $scope.project = {};
    $scope.newCard = {
        name: ''
    };
    
    $http.get('project/' + $routeParams.id).then(function(response) {
        console.log(response.data);
        $scope.project = response.data;
    }, function(response) {});

    $scope.centerAnchor = true;
    
    $scope.toggleCenterAnchor = function () {
        $scope.centerAnchor = !$scope.centerAnchor
    }

    var onDraggableEvent = function (evt, data) {
        console.log("128", "onDraggableEvent", evt, data);
    }

    $scope.$on('draggable:start', onDraggableEvent);
    $scope.$on('draggable:end', onDraggableEvent);

    $scope.unassignedCards = [];
    $scope.inProgressCards = [];
    $scope.completedCards = [];

    $scope.onDropComplete = function (containerName, data, evt) {
        var index = $scope[containerName].indexOf(data);
        if (index == -1)
            $scope[containerName].push(data);
    }
    $scope.onDragSuccess = function (containerName, data, evt) {
        var index = $scope[containerName].indexOf(data);
        if (index > -1) {
            $scope[containerName].splice(index, 1);
        }
    }
    var inArray = function (array, obj) {
        var index = array.indexOf(obj);
    }

    $scope.showCardCreator = function(container, ev) {
        $scope.newCard.container = container;
        $mdDialog.show({
            controller: DialogController,
            scope: $scope.$new(),
            templateUrl: '/views/createCardDialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        .then(function() {
            // $scope.create();
        }, function() {
            $mdDialog.cancel();
        });
    };

    function DialogController($scope, $mdDialog) {
        $scope.newCard.name = '';
        $scope.newCard.description = '';

        $scope.cancel = function() {
            $scope.newCard.name = '';
            $scope.newCard.description = '';
            $mdDialog.cancel();
        };

        $scope.create = function() {
            $scope[$scope.newCard.container].push(angular.copy($scope.newCard));
            $mdDialog.cancel();            
        };
    };

}]);