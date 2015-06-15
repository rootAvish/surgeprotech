'use strict';

function loginController($scope, $location, AuthService) {
	$scope.formData = {
		"remember": false
	};

	this.authenticate = function (formData) {
		
		AuthService.login(formData)
		.then(function(user) {
			$scope.setUser();
			$location.path('/user');
		})
	};
};

function logoutcontroller($scope) {
	$scope.currenUser = null;
}

function registerController($scope,$http,$location, RegisterService) {

	$scope.formData = {};

	this.Register = function () {
		
		RegisterService.register($scope.formData)
		.success (function(data) {

			if (data.success == true) {
				$scope.login = true;
				$location.path('/user');
			}
			else {
				$scope.exists = true;
			}
		});
	};
}

function uploadController($scope, FileUploader,$http) {
	$scope.formData = {};
	$scope.uploader = new FileUploader();
	$scope.uploader.url = "http://localhost:5000/api/paper/";
	
	this.Qclear = function() {
		$scope.uploader.clearQueue();
	};
		
	$scope.uploader.onBeforeUploadItem = function(item) {
		item.formData.push($scope.formData);
		console.log(item);
	};
}

function paperController($scope, $http) {

	$scope.papers = [];

	$http({
		method: 'GET',
		url: '/api/paper/',
		params: {'page': 1}
	})
	.success(function (data) {
		$scope.papers = data;
		console.log(data);
	});
}

function abstController($scope,$http,$routeParams) {
	console.log($routeParams.paperId);

	$scope.review = {};

	$scope.paper = {reviews:[]};

	$scope.addReview = function(review) {
		review.date = new Date();
		review.author = $scope.currentUser.data.Name + "(Technical Committee Member)";
		console.log(review.author);
		$scope.paper.reviews.push(review);
		$scope.review = {};
	};
}