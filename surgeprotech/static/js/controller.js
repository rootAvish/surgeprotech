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

	$scope.formData = {password: ''};
	$scope.cnfpass = '';

	this.Register = function () {
		if ($scope.formData.password !== $scope.cnfpass) {
			$scope.error = "Passowords don't match";
			return;
		}
		
		RegisterService.register($scope.formData)
		.then (function(res) {

			var data = res.data;

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

function uploadController($scope, FileUploader,$http, UploadAbstract) {
	$scope.formData = {};
	$scope.uploader = new FileUploader();
	$scope.uploader.url = "http://localhost:5000/api/paper";

	$scope.uploadAbstract = function() {

		console.log($scope.uploader.queue.length);

		if ($scope.uploader.queue.length) {
			var item = $scope.uploader.queue[0];
			item.upload();
		}

		else {
			UploadAbstract.save($scope.formData).$promise.then(function(res) {

				if(res.success == true) {
					$scope.success = true;
					waitingDialog.hide();
				}
			},
			function(data, error, headers, status) {
				waitingDialog.hide();
				$scope.error = true;
			});
		}
	}

	$scope.resetUpload = function() {
		console.log('clicked');
		$scope.uploader.clearQueue();
	}
	$scope.uploader.onBeforeUploadItem = function(item) {
		item.formData.push($scope.formData);
		console.log(item);

	};

	$scope.uploader.onSuccessItem = function(item, response, status, headers) {
		waitingDialog.hide();
		$scope.success = true;
	};
}

function paperController($scope, $http) {

	$scope.papers = [];
	$scope.currentPage = 1;

	$http({
			method: 'GET',
			url: '/api/paper/', params: {'page': $scope.currentPage}
		})
		.success(function(data) {	
			$scope.papers = data.papers;
			$scope.currentPage += 1;
			console.log($scope.papers.length);
		});
}
	
function abstController($scope, $routeParams, Papers,Review,Comments) {
	$scope.paper = {};
	var date = new Date();

	$scope.review = {date: date.toUTCString()};

	console.log($routeParams);

	Papers.getPaper($routeParams.paperId).success(function(res) {
		console.log(res);
		$scope.paper = res;
		$scope.paper.reviews = [];
		//console.log($scope.paper);
		Comments.getComments($scope.paper.p_id).success(function(data) {
			// console.log(data);
			$scope.paper.reviews = data;
		});
	}), function(res) {
		// Avoid error.
		console.log(error);
	};

	$scope.addReview = function(review) {
		date = new Date();
		review.date = date.toUTCString();
		review.p_id = $scope.paper.p_id;
		$scope.setUser();
		
		review.author = $scope.currentUser.userId;
		
		Review.add(review).then(function() {
			review.author = $scope.currentUser.userName;
			$scope.paper.reviews.reviews.push(review);
			$scope.review = {};	
		})
	};
}

function logoutController($scope,Logout,$location,Session) {
	Logout.logout().then(function() {
		$location.path('/login');
		Session.destroy();
	});
}


function tabController() {

	Logout.logout();
	
}