var app = angular.module("myApp", ["ngRoute", "angularMoment"]);

app.config(function($routeProvider){
  $routeProvider.when('/',
                      {
                        templateUrl: 'partials/app.html',
                        controller: 'ChoreController'
                      })
});

app.config([
  "$httpProvider", function($httpProvider) {
    $httpProvider.defaults.headers.common['Authorization'] = 'Token token=some-secret';
  }
]);

app.factory('API', ['$http', function($http) {
  var API = {};

  API.allChores = function(){
    return $http.get('http://serene-bastion-9183.herokuapp.com/');
  };

  API.createChore = function(title, description){
    return $http.post('http://serene-bastion-9183.herokuapp.com/chores', {chore: { title: title, description: description}});
  };

  API.editChore = function(chore){
    return $http.put('http://serene-bastion-9183.herokuapp.com/chores/' + chore.id, {chore: { title: chore.title, description: chore.description}});
  };

  API.deleteChore = function(chore){
    return $http.delete('http://serene-bastion-9183.herokuapp.com/chores/' + chore.id);
  };

  return API;
}]);

app.controller('ChoreController', ['$scope', 'API', function($scope, CHORES){

  $scope.editable = false;

  $scope.editedChore = null;

  $scope.setEditChore = function(chore){
    $scope.editedChore = angular.copy(chore);
    $scope.editable = true;
  };

  $scope.cancelEdit = function(){
    $scope.editable = false;
  };

  $scope.edit = function(chore){
    CHORES.editChore(chore).success(function(data){
      $scope.editable = false;
      getChores();
      reset();
    });
  };

  $scope.deleteChore = function(chore){
    CHORES.deleteChore(chore).success(function(data){
      $scope.editable = false;
      getChores();
      reset();
    });
  };

  var getChores = function(){
    CHORES.allChores().success(function(data){
      $scope.chores = data;
    });
  };

  var reset = function(){
    $scope.title = '';
    $scope.description = '';
  };

  $scope.create = function(){
    CHORES.createChore($scope.title, $scope.description).success(function(data){
      getChores();
      reset();
    }).error(function(data){
    });
  };

  getChores();
}]);
