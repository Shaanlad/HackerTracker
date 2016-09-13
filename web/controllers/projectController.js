angular.module('HackerTracker').controller('projectController', ['$http', '$scope', '$routeParams', '$mdDialog', '$mdToast', function($http, $scope, $routeParams, $mdDialog, $mdToast) {

    $scope.project = {};
    $scope.newState = {
        cards: []
    };

    $scope.cardsByStates = {};
    $scope.cardCreator = {
        card: {},
        GetCard: function (cardId, callback) {
            $http.get('/project/' + $routeParams.id + '/card/' + cardId).then(function(response){
                $scope.cardCreator.card = response.data;
                $scope.cardCreator.card.startDate = new Date($scope.cardCreator.card.startDate);
                $scope.cardCreator.card.endDate = new Date($scope.cardCreator.card.endDate);
                if (typeof callback === "function")
                    callback(response);
            });
        },
        GetAssignee: function (assigneeId) {
            for (var i = 0; i < $scope.cardCreator.users.length; i++) {
                if ($scope.cardCreator.users[i]._id == assigneeId) {
                    return $scope.cardCreator.users[i];
                }
            }
            for (var i = 0; i < $scope.cardCreator.groups.length; i++) {
                if ($scope.cardCreator.groups[i]._id == assigneeId) {
                    return $scope.cardCreator.groups[i];
                }
            }
        }
    };

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
    }

    $scope.initAssignees = function () {
        $http.get('/project/' + $routeParams.id + '/assignees/')
            .then(function(response) {
                $scope.cardCreator.users = response.data.users;
                $scope.cardCreator.groups = response.data.groups;
            });
    }

    $scope.initAssigneeIds = function (card) {
        card.assigneeIds = [];
        for (var i = 0; i < card.assignees.length; i++) {
            card.assigneeIds.push(card.assignees[i]._id);
        }
    }
    
    $scope.initProject = function () {
        $http.get('project/' + $routeParams.id).then(function(response) {
            $scope.project = response.data;
            $scope.initCardsByStates();
            $scope.initAssignees();
        });
    }

    $scope.initProject();

    $scope.centerAnchor = true;
    
    $scope.toggleCenterAnchor = function () {
        $scope.centerAnchor = !$scope.centerAnchor
    }

    $scope.onDropComplete = function (stateName, card, evt) {
        if (card)
        {
            card.state = stateName;
            var index = $scope.cardsByStates[stateName].indexOf(card);
            if (index == -1)
                $scope.cardsByStates[stateName].push(card);

            $http.put('/project/' + $routeParams.id + '/card/' + card._id, {
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
    }

    $scope.onDragSuccess = function (stateName, card, evt) {
        var index = $scope.cardsByStates[stateName].indexOf(card);
        if (index > -1) {
            $scope.cardsByStates[stateName].splice(index, 1);
        }
    }

    var inArray = function (array, obj) {
        var index = array.indexOf(obj);
    }

    $scope.showCardCreator = function(stateName, ev) {
        $scope.cardCreator.card.state = stateName;
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

    $scope.showCardEditor = function(cardId, ev) {
        $scope.cardCreator.cardId = cardId;
        $mdDialog.show({
            controller: CardEditorController,
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
        $scope.cardCreator.card.name = '';
        $scope.cardCreator.card.description = '';
        $scope.cardCreator.actionText = 'Create';
        $scope.cardCreator.saveText = 'Create';

        $scope.cancelCard = function() {
            $scope.cardCreator.card.name = '';
            $scope.cardCreator.card.description = '';
            $mdDialog.cancel();
        };

        $scope.saveCard = function() {
            // Workaround to display/check existing use/group selection
            $scope.cardCreator.card.assignees = [];
            for (var i = 0; i < $scope.cardCreator.card.assigneeIds.length; i++) {
                $scope.cardCreator.card.assignees.push($scope.cardCreator.GetAssignee($scope.cardCreator.card.assigneeIds[i]))
            }
            $scope.cardCreator.card.assigneeIds = null;

            $http.post('/project/' + $routeParams.id + '/card', {
                card: $scope.cardCreator.card
            }).then(function(response) {
                if (response.data.success) {
                    $mdToast.show(
                      $mdToast.simple()
                        .textContent(response.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.initProject();
                    $mdDialog.cancel();
                } else {
                    alert(response.data.message);
                }
            }, function (response) {
                alert(response);
            });
        };
    };

    function CardEditorController($scope, $mdDialog) {
        $scope.cardCreator.actionText = 'Edit';
        $scope.cardCreator.saveText = 'Edit';

        $scope.cardCreator.GetCard($scope.cardCreator.cardId, function () {
            $scope.initAssigneeIds($scope.cardCreator.card);
        });

        $scope.cancelCard = function() {
            $scope.cardCreator.card.name = '';
            $scope.cardCreator.card.description = '';
            $mdDialog.cancel();
        };

        $scope.saveCard = function() {
            // Workaround to display/check existing use/group selection
            $scope.cardCreator.card.assignees = [];
            for (var i = 0; i < $scope.cardCreator.card.assigneeIds.length; i++) {
                $scope.cardCreator.card.assignees.push($scope.cardCreator.GetAssignee($scope.cardCreator.card.assigneeIds[i]))
            }
            $scope.cardCreator.card.assigneeIds = null;

            $http.put('/project/' + $routeParams.id + '/card/' + $scope.cardCreator.card._id, {
                card: $scope.cardCreator.card,
                project_id: $routeParams.id
            }).then(function(response) {
                if (response.data.success) {
                    $mdToast.show(
                      $mdToast.simple()
                        .textContent(response.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.initProject();
                    $mdDialog.cancel();
                } else {
                    alert(response.data.message);
                }
            });
        }
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
            $http.post('/project/' + $routeParams.id + '/state', {
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