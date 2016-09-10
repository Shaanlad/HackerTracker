angular.module('HackerTracker').controller('projectController', ['$http', '$scope', '$routeParams', '$mdDialog', '$mdToast', function($http, $scope, $routeParams, $mdDialog, $mdToast) {

    $scope.project = {};
    $scope.newCard = {};
    $scope.newState = {
        cards: []
    };

    $scope.GetCards = function (stateName) {
        for (var i = 0; i < $scope.project.states.length; i++) {
            console.log($scope.project.states[i].name, stateName);
            if ($scope.project.states[i].name == stateName) {
                return $scope.project.states[i].cards;
            }
        }
    }
    
    $http.get('project/' + $routeParams.id).then(function(response) {
        console.log(response.data);
        $scope.project = response.data;
    }, function(response) {});

    $scope.centerAnchor = true;
    
    $scope.toggleCenterAnchor = function () {
        $scope.centerAnchor = !$scope.centerAnchor
    }

    $scope.onDropComplete = function (stateName, data, evt) {
        var index = $scope.GetCards(stateName).indexOf(data);
        if (index == -1)
            $scope.GetCards(stateName).push(data);
    }
    $scope.onDragSuccess = function (stateName, data, evt) {
        var index = $scope.GetCards(stateName).indexOf(data);
        if (index > -1) {
            $scope.GetCards(stateName).splice(index, 1);
        }
    }

    var inArray = function (array, obj) {
        var index = array.indexOf(obj);
    }

    $scope.showCardCreator = function(stateName, ev) {
        $scope.newCard.stateName = stateName;
        $mdDialog.show({
            controller: CardCreatorController,
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

    function CardCreatorController($scope, $mdDialog) {
        $scope.newCard.name = '';
        $scope.newCard.description = '';

        $scope.cancel = function() {
            $scope.newCard.name = '';
            $scope.newCard.description = '';
            $mdDialog.cancel();
        };

        $scope.create = function() {
            console.log($scope.newCard.stateName);
            console.log($scope.project.states);
            for (var i = 0; i < $scope.project.states.length; i++) {
                if ($scope.project.states[i].name == $scope.newCard.stateName) {
                    $scope.project.states[i].cards.push(angular.copy($scope.newCard));
                    break;
                }
            }
            $mdDialog.cancel();            
        };

        $scope.loadAssignees = function () {
            console.log($scope.project);
            $http.get('/card/assignees/' + $scope.project._id)
                .then(function(response) {
                    $scope.users = response.data.users;
                    $scope.groups = response.data.groups;
                }, function(response) {});
        };
    };

    $scope.showStateCreator = function() {
        $mdDialog.show({
            controller: StateCreatorController,
            scope: $scope.$new(),
            templateUrl: '/views/createStateDialog.html',
            parent: angular.element(document.body),
            clickOutsideToClose:true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        .then(function() {
            // $scope.create();
        }, function() {
            $mdDialog.cancel();
        });
    };

    function StateCreatorController($scope, $mdDialog) {
        $scope.newState.name = '';
        $scope.newState.description = '';

        $scope.cancel = function() {
            $scope.newState.name = '';
            $scope.newState.description = '';
            $mdDialog.cancel();
        };

        $scope.create = function() {
            $http.post("/project/" + $routeParams.id + "/state", {
                state: $scope.newState
            }).then(function(response) {
                if (response.data.success) {
                    $mdToast.show(
                      $mdToast.simple()
                        .textContent(response.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.project.states.push(angular.copy($scope.newState));
                    $mdDialog.cancel();
                } else {
                    alert(response.data.message);
                }
            }, function (response) {
                alert(response);
            });

        };
    };

}]);