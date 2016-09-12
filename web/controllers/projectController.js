angular.module('HackerTracker').controller('projectController', ['$http', '$scope', '$routeParams', '$mdDialog', '$mdToast', function($http, $scope, $routeParams, $mdDialog, $mdToast) {

    $scope.project = {};
    $scope.newCard = {};
    $scope.newState = {
        cards: []
    };

    $scope.cardsByStates = {};

    $scope.initCardsByStates = function () {
        for (var i = 0; i < $scope.project.states.length; i++) {            
            var cards = [];
            for (var j = 0; j < $scope.project.cards.length; j++) {
                if ($scope.project.cards[j].state == $scope.project.states[i].name) {
                    cards.push($scope.project.cards[j]);
                }
            }
            $scope.cardsByStates[$scope.project.states[i].name] = cards;
        }
        console.log($scope.cardsByStates);
    }
    
    $http.get('project/' + $routeParams.id).then(function(response) {
        console.log(response.data);
        $scope.project = response.data;
        $scope.initCardsByStates();
    });

    $scope.centerAnchor = true;
    
    $scope.toggleCenterAnchor = function () {
        $scope.centerAnchor = !$scope.centerAnchor
    }

    $scope.onDropComplete = function (stateName, card, evt) {
        if (card)
            card.state = stateName;
        var index = $scope.cardsByStates[stateName].indexOf(card);
        if (index == -1)
            $scope.cardsByStates[stateName].push(card);

        $http.put("/project/" + $routeParams.id + "/card", {
            card: card
        }).then(function(response) {
            if (response.data.success) {
                $mdToast.show(
                  $mdToast.simple()
                    .textContent(response.data.message)
                    .position('top right')
                    .hideDelay(3000)
                );
            } else {
                alert(response.data.message);
            }
        });

    }
    $scope.onDragSuccess = function (stateName, data, evt) {
        var index = $scope.cardsByStates[stateName].indexOf(data);
        if (index > -1) {
            $scope.cardsByStates[stateName].splice(index, 1);
        }
    }

    var inArray = function (array, obj) {
        var index = array.indexOf(obj);
    }

    $scope.showCardCreator = function(stateName, ev) {
        if ($scope.newCard)
            $scope.newCard.state = stateName;
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

    $scope.showCardEditor = function(stateName, ev, card_id) {
        if ($scope.newCard)
            $scope.newCard.state = stateName;
        $scope.card_id = card_id;
        $mdDialog.show({
            controller: CardEditorController,
            scope: $scope.$new(),
            templateUrl: '/views/editCardDialog.html',
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
            $http.post("/project/" + $routeParams.id + "/card", {
                card: $scope.newCard
            }).then(function(response) {
                if (response.data.success) {
                    $mdToast.show(
                      $mdToast.simple()
                        .textContent(response.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.project.cards.push(angular.copy($scope.newCard)); // When we get to EDIT funtionality, we'll have to get actual entry that was saved to database as we'll need the ID of it
                    $scope.cardsByStates[$scope.newCard.state].push(angular.copy($scope.newCard));
                    $mdDialog.cancel();
                } else {
                    alert(response.data.message);
                }
            }, function (response) {
                alert(response);
            });
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

    function CardEditorController($scope, $mdDialog) {
        $http.get('/card/' + $scope.card_id).then(function(response){
            $scope.card = response.data[0];
            console.log($scope.card);
        });

        $scope.cancel = function() {
            $scope.newCard.name = '';
            $scope.newCard.description = '';
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
                    $scope.initCardsByStates();
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