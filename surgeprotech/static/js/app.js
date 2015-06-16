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
	})
	.when('/logout', {
		templateUrl: 'static/partials/logout.html',
		controller: logoutController
	});

	$locationProvider.html5Mode(true);
}]);

app.controller('appController',['$scope','Session', function($scope, Session) {
	$scope.currentUser = null;

	$scope.setUser = function() {
		$scope.currentUser = Session.getUser();
	};

	$scope.$on('session:created',function (event,data) {
		console.log('created',data);
		$scope.setUser();
	});

	$scope.$on('session:destroyed',function (event,data) {
		console.log('destroyed', data);
		$scope.setUser();
	});

}])

.run(['LoginState','Session',function(LoginState,Session) {

	function isEmptyObject( obj ) {
	    for ( var name in obj ) {
	        return false;
	    }
	    return true;
	};

	LoginState.login().then(function(res) {

		if (isEmptyObject(res.data) == false) {
			Session.create(res.data);
		}

	}), function(err) {
		// Handle this error.
	};
}]);