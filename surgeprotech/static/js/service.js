'use strict';

angular.module('services',[])

.service('Session', function ($rootScope) {

  this.create = function (userinfo) {

    this.userId = userinfo.u_id;
    this.userName = userinfo.Name;
    this.userRole = userinfo.role;

    $rootScope.$broadcast('session:created', this);
  };
  this.destroy = function () {
    this.userId = null;
    this.userName = null;
    this.userRole = null;

    $rootScope.$broadcast('session:destroyed');
  };

  this.getUser = function() {
  	return {
  		userId: this.userId,
  		userName: this.userName,
  		userRole: this.userRole
  	};
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
			Session.create(data.data);
			return data;
		});
	};

	auth.getUser = function() {
		return Session.userId;
	}
	return auth;
}])

.factory('Resources', ['$resource', function($resource){
	return $resource('/api/paper/:AuthorId', {}, {
		query: {
			method: 'GET',
			params: {AuthorId: ''},
			isArray: true
		}
	});
}])

.factory('LoginState', ['$http', function($http){

		var login = {};

		login.login = function() {
			return $http({
						url:'/api/user/',
						method: 'GET',
						params: {}
					});
		};

		return login;
}])

.factory('RegisterService', ['$http','Session', function($http,Session){
	var reg = {};

	reg.register = function (formData)	{
		return $http({
						method: 'POST',
						url: '/api/user/',
						data: formData,
						headers: {'Content-Type': 'application/json'}
				})
				.success(function(res) {
					console.log(res);
					
					if(res['success'] == true) {

						Session.create({Name: formData['name'],u_id: res['userId'],role: res['userRole']});
					}

					else {
						return false;
					}
				});
	};

	return reg;
}])

.factory('Logout', ['$http', function($http){
	
	var logout = {};

	logout.logout = function() {

		return $http({
			method: 'GET',
			url: '/api/logout'
		})
	};

	return logout;
}])

.factory('Review', ['$http', function($http){
	
	var review = {};

	review.add = function(review) {
		return $http({
						method: 'POST',
						url: '/api/comment/',
						data: review,
						headers: {"Content-Type":"application/json"}
					});
	};

	return review;
}]);