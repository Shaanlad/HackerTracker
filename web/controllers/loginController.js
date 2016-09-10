angular.module('HackerTracker').controller('loginController', ['$http', '$scope', function($http, $scope) {
    $scope.login = function() {
        $http.post('/login', {
            userName: $scope.userName,
            password: $scope.password
        }).then(function(response) {
            if (response.data.success == true) {
                window.location.href = response.data.route;
            } else {
                alert(response.data.message);
            }
        }, function(response) {
            alert(response);
        });
    }
}]);
