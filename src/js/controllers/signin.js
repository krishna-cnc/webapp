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
            if ( !response.data.user ) {
                $scope.authError = 'Email or Password not right';
            }else{
                firebase.auth().signInWithEmailAndPassword(email,pass).then(function(data){
                    window.localStorage.setItem('email',data.email)
                    if(data.email == "treverseapp2016@gmail.com"){
                        window.location = "#/app/table/hotel_list"
                        document.title = "Master Admin"
                    }
                    else{
                        firebase.database().ref().child('admin/').once('value',function(datas){
                            var _x_ = datas.val()
                            for(var _y_ in _x_){
                                if(data.email == _x_[_y_].email){
                                    window.localStorage.setItem("type",_x_[_y_].type)
                                    window.localStorage.setItem("h_id",_x_[_y_].hotel_id)
                                    firebase.database().ref().child('hotel/'+_x_[_y_].hotel_id).once('value',function(data){
                                        var _g_ = data.val()
                                        window.localStorage.setItem('hot_name',_g_.Name)
                                    })
                                    if(_x_[_y_].type == 'admin'){
                                        window.location = "#/app/report?list="+_x_[_y_].hotel_id
                                        document.title = "Admin"
                                        $('body').addClass('ng-admin')
                                    }
                                }
                            }
                        })
                    }
                }).catch(function(error) {
                    if(error.message == "The password is invalid or the user does not have a password."){
                        alert('The password you entered is incorrect. Please try again.')
                    }
                    if(error.message == "There is no user record corresponding to this identifier. The user may have been deleted."){
                        alert('Incorrect Password or Username')
                    }
                    if(error.message == 'signInWithEmailAndPassword failed: First argument "email" must be a valid string.'){
                        alert('Enter Proper Email')
                    }
                    /*console.log(error);*/
                });
            }
        }, function(x) {
            $scope.authError = 'Server Error';
        });
    };
}])
;
