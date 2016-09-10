angular.module('HackerTracker').controller('homeController', ['$http', '$scope', function($http, $scope) {
    $scope.create = function() {
        $http.post("/project", {
            name: 'name',
            description: 'description'
        }).then(function(response) {
            if (response.data.success == true) {
                window.location.href = response.data.route;
            } else {
                alert(response.data.message);
            }
        }, function (response) {
            alert(response);
        });
    };
}]);
