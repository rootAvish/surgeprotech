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

	.when('/reset/:token', {
		templateUrl: 'static/partials/reset.html',
		controller: pwResetController
	})

	.when('/forgot', {
		templateUrl: 'static/partials/forgot.html',
		controller: resetController
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

.run(['LoginState','Session','$rootScope', '$location', function(LoginState,Session,$rootScope,$location) {

	function isEmptyObject( obj ) {
	    for ( var name in obj ) {
	        return false;
	    }
	    return true;
	};

	$rootScope.$on("$routeChangeSuccess", function(event, next, current) {

		if (next.templateUrl == 'static/partials/register.html' && Session.getUser().userId != null) {
			console.log("Event triggered Inside");

			if(Session.getUser().userRole == true) {
				$location.path('/paper');
			}
			else {
				$location.path('/user');
			}
		}
	});

	LoginState.login().then(function(res) {

		if (isEmptyObject(res.data) == false) {
			Session.create(res.data);
		}

	}), function(err) {
		// Handle this error.
	};


	// if (sessionid in Session.user)
}]);