'use strict';

var app = angular.module('spForums',['ngResource', 'ngRoute','angularFileUpload','services'])
.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'templates/index.html'
	})
	.when('/login', {
		templateUrl: 'static/partials/login.html',
		controller: loginController,
		controllerAs: 'login'
	})
	.when('/register', {
		templateUrl: 'static/partials/register.html',
		controller: registerController,
		controllerAs: 'register'
	})
	.when('/user', {
		templateUrl: 'static/partials/upload.html',
		controller: uploadController,
		controllerAs: 'upload'
	})
	.when('/paper/', {
		templateUrl: 'static/partials/paperlist.html',
		controller: paperController
	})
	.when('/paper/:paperId', {
		templateUrl: 'static/partials/paper.html',
		controller: abstController,
		controllerAs: 'abst'
	});
	$locationProvider.html5Mode(true);
}]);

app.controller('appController',['$scope', function($scope) {
	$scope.currentUser = null;

	$scope.setUser = function() {
		$scope.currentUser = Session.User;
	};
}])
.run(['LoginState',function(LoginState,Session) {
	LoginState.then(function(res) {

		if (res.length) {
			Session.create(res);
		}
	}), function(err) {
		// Handle this error.
	};
}]);