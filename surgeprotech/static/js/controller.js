'use strict';

function loginController($scope, $location, AuthService) {
	$scope.formData = {
		"remember": false
	};

	this.authenticate = function (formData) {
		
		AuthService.login(formData)
		.then(function(user) {
			$scope.setUser(user);
			$location.path('/user');
		})
	};
};

function registerController($scope,$http,$location) {

	$scope.formData = {};

	this.Register = function () {
		$http({
			method: 'POST',
			url: '/api/user/',
			data: $scope.formData,
			headers: {'Content-Type': 'application/json'}
		})
		.success (function(data) {
			console.log(data);

			if (data.success == true) {
				$scope.login = true;
				$location.path('/user');
			}
			else {
				$scope.exists = true;
			}
		});
	};
};

function uploadController($scope, FileUploader,$http) {
	this.formData = {};
	$scope.uploader = new FileUploader();
	$scope.uploader.url = "http://localhost:5000/api/paper/";
	$scope.uploader.formData.push(this.formData);
}

function paperController($scope, $http) {

	$scope.papers = [];

	$http({
		method: 'GET',
		url: '/api/paper/',
		params: {'user': 'avishkar.gupta.delhi@gmail.com', 'page': 1}
	})
	.success(function (data) {
		$scope.papers = data;
		console.log(data);
	});
}

function abstController($scope,$http,$routeParams) {
	console.log($routeParams.paperId);
}