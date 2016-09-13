angular.module('HackerTracker').controller('signupController', ['$http', '$scope', function($http, $scope) {
    $scope.signup = function() {
        $http.post('/signup', {
            userName: $scope.userName,
            email: $scope.email,
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
