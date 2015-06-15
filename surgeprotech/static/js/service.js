'use strict';

angular.module('services',[])

.service('Session', function () {
  this.create = function (userinfo) {
    this.userId = userinfo.u_id;
    this.userName = userinfo.Name;
    this.userRole = userinfo.role;
  };
  this.destroy = function () {
    this.userId = null;
    this.userName = null;
    this.userRole = null;
  };
})

.factory('AuthService', ['$http', 'Session',function($http, Session){	

	var auth = {};

	auth.login = function(credentials) {

		return $http({
			method: 'POST',
			url: "/api/login",
			data: credentials,
			headers: {"Content-type": "application/json"}
		}).then(function(data) {
			Session.create(data);
			return data;
		});
	};

	auth.getUser = function() {
		return Session.userId;
	}
	return auth;
}])

.factory('Resources', ['$resource', function($resource){
	
	return $resource('/api/paper/', {}, {
		query: {
			method: 'GET',
			isArray: true
		}
	});

}])

.factory('LoginState', ['$http', function($http){
		return $http({
					url:'/api/user/',
					method: 'GET',
					params: {}
				});
}])

.factory('RegisterService', ['$http', function(http){
	var reg = {};

	reg.register = function (formData){
		$http({
			method: 'POST',
			url: '/api/user/',
			data: formData,
			headers: {'Content-Type': 'application/json'}
		});
	};

	return reg;
}]);