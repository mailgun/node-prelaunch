angular.module('app', []);

angular.module('app', []).controller('MainCtrl', function($scope, $http) {

  $scope.email = '';
  $scope.submitted = false;
  $scope.formError = false;
  $scope.formSuccess = false;
  $scope.errorMsg = '';

  $scope.submit = function() {
    $scope.submitted = true;
    $scope.formError = false;

    var req = {
      method: 'POST',
      url: '/signup',
      headers: {
       'Content-Type': 'application/json'
      },
      data: {
        email: $scope.email
      }
    };

    $http(req).success(function(data, status, headers){
      $scope.submitted = true;
      $scope.formSuccess = true;
    }).error(function(data, status, headers){
      if(data.errors && data.errors[0].msg){
        $scope.errorMsg = data.errors[0].msg;
      } else {
        $scope.errorMsg = 'Houston, We Have A Uh-Oh';
      }
      $scope.submitted = false;
      $scope.formError = true;
    });
  };
});
