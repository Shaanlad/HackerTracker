angular.module('HackerTracker').controller('projectController', ['$http', '$scope', '$routeParams', function($http, $scope, $routeParams) {

    $scope.project = {};
    $scope.obj = "Hello";
    
    $http.get('project/' + $routeParams.id).then(function(response) {
        console.log(response.data);
        $scope.project = response.data;
    }, function(response) {});

    // $scope.onDragComplete=function(data,evt){
    //    console.log("drag success, data:", data);
    // }
    // $scope.onDropComplete=function(data,evt){
    //     console.log("drop success, data:", data);
    // }
    
    // // Model to JSON for demo purpose
    // $scope.$watch('models', function(model) {
    //     $scope.modelAsJson = angular.toJson(model, true);
    // }, true);

  $scope.centerAnchor = true;
                $scope.toggleCenterAnchor = function () {
                    $scope.centerAnchor = !$scope.centerAnchor
                }
                //$scope.draggableObjects = [{name:'one'}, {name:'two'}, {name:'three'}];
                var onDraggableEvent = function (evt, data) {
                    console.log("128", "onDraggableEvent", evt, data);
                }
                $scope.$on('draggable:start', onDraggableEvent);
               // $scope.$on('draggable:move', onDraggableEvent);
                $scope.$on('draggable:end', onDraggableEvent);
                $scope.unassignedCards = [];
                $scope.inProgressCards = [];
                $scope.completedCards = [];
                $scope.onDropComplete = function (containerName, data, evt) {
                    console.log("127", "$scope", "onDropComplete1", containerName, data, evt);
                    var index = $scope[containerName].indexOf(data);
                    if (index == -1)
                        $scope[containerName].push(data);
                }
                $scope.onDragSuccess = function (containerName, data, evt) {
                    console.log("133", "$scope", "onDragSuccess1", "", evt);
                    var index = $scope[containerName].indexOf(data);
                    if (index > -1) {
                        $scope[containerName].splice(index, 1);
                    }
                }
                var inArray = function (array, obj) {
                    var index = array.indexOf(obj);
                }
}]);