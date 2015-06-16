'use strict';

function isEmptyObject( obj ) {
    for ( var name in obj ) {
        return false;
    }
    return true;
};

function loginController($scope, $location, AuthService) {
	$scope.formData = {
		"remember": false
	};

	this.authenticate = function (formData) {
		
		AuthService.login(formData)
		.then(function(user) { /*
			$scope.setUser();*/

			if (!isEmptyObject(user.data)) {
				$location.path('/user');
			}
			else
			{
				$scope.wrong = true;
			}
		}),

		function(err) {
			// Handle error	
		}
	};

	$scope.$on('session:created',function (event,data) {
		console.log('created',data);
		$scope.setUser();
	});
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
				$scope.setUser();
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
	
function abstController($scope, $routeParams, Resources) {

	Resources.get({},function(res) {
		console.log(res);
	}), function(res) {
		// Avoid error.
	};

	$scope.review = {};

	$scope.paper = {reviews:[]};

	$scope.addReview = function(review) {
		var date = new Date();
		review.date = date.toUTCString();
		$scope.setUser();
		
		review.author = $scope.currentUser.userName;
		$scope.paper.reviews.push(review);
		$scope.review = {};
	};
}

function logoutController($scope,Logout,$location,Session) {
	Logout.logout().then(function() {
		$location.path('/login');
		Session.destroy();
	});
}