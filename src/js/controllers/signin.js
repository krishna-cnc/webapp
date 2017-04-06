'use strict';

/* Controllers */
// signin controller
app.controller('SigninFormController', ['$scope', '$http', '$state', function($scope, $http, $state) {
    $scope.user = {};
    $scope.authError = null;
    $scope.login = function(email,pass) {
        $scope.authError = null;
        // Try to login
        $http.post('api/login', {email: $scope.user.email, password: $scope.user.password})
            .then(function(response) {
            if ( email == null || pass == null || email == "" || pass == "" || email == undefined || pass == undefined) {
                $scope.authError = 'Email or Password not right';
                alert("Email or Password not right")
            }else{
                firebase.auth().signInWithEmailAndPassword(email,pass).then(function(data){
                    window.localStorage.setItem('email',data.email)
                    $state.go('app.table.datatable');
                }).catch(function(error) {
                    console.log(error);
                    console.log(error.message);
                    if(error.message == "There is no user record corresponding to this identifier. The user may have been deleted."){
                        alert('There is no user record')
                    }
                    if(error.message == "The password is invalid or the user does not have a password."){
                        alert('Passord not match')
                    }
                    
                });
            }
        }, function(x) {
            $scope.authError = 'Server Error';
        });
    };
}])
;
