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
		
		$scope.setUser();
	});
};

loginController.$inject = ['$scope','$location','AuthService'];


function registerController($scope,$location, RegisterService) {

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

registerController.$inject = ['$scope','$location','RegisterService'];


function uploadController($scope, FileUploader, UploadAbstract, Papers) {
	$scope.formData = {};
	
	if ($scope.currentUser.paper != 0) {
		Papers.getPaper().get({paperId: $scope.currentUser.paper})
		.$promise.then(function(res) {
			
			var formData = JSON.parse(angular.toJson(res));
			
			$scope.formData.title = formData.title;
			$scope.formData.abstract = formData.abstract;
			
			if('link' in formData) {
				$scope.link = formData.link;
			}
		})
	}

	$scope.uploader = new FileUploader();
	$scope.uploader.url = "http://localhost:5000/api/paper";

	$scope.uploadAbstract = function() {

		

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
		
		$scope.uploader.clearQueue();
	}
	$scope.uploader.onBeforeUploadItem = function(item) {
		item.formData.push($scope.formData);
		

	};

	$scope.uploader.onSuccessItem = function(item, response, status, headers) {
		waitingDialog.hide();
		$scope.success = true;
	};
}

uploadController.$inject = ['$scope', 'FileUploader', 'UploadAbstract', 'Papers'];


function paperController($scope, Papers) {

	$scope.papers = [];
	$scope.currentPage = 1;
	var start = ($scope.currentPage - 1) * 5 + 1;
	var end = $scope.currentPage * 5;
	var papers;

	Papers.getPaper().get()
	.$promise.then(function(res) {
		papers = res.papers;
		$scope.papers = papers.slice(start-1, end);
	});

	$scope.next = function() {

		if (end >= papers.length)
			return;

		$scope.currentPage += 1;
	 	start = ($scope.currentPage - 1) * 5 + 1;
	 	end = $scope.currentPage * 5;
		$scope.papers = papers.slice(start-1, end);

		

	}

	$scope.previous = function() {

		if ($scope.currentPage == 1)
			return;

	 	$scope.currentPage -= 1;
	 	start = ($scope.currentPage - 1) * 5 + 1;
	 	end = $scope.currentPage * 5;

		$scope.papers = papers.slice(start-1, end);
		
	}
}

paperController.$inject = ['$scope','Papers'];

	
function abstController($scope, $routeParams, Papers,Review,Comments) {
	var date = new Date();

	$scope.review = {rv_date: date.toUTCString()};

	if ($routeParams.paperId != 0) {

		Papers.getPaper().get({paperId: $routeParams.paperId}).$promise.then(function(res) {
			$scope.success = true;
			$scope.paper = JSON.parse(angular.toJson(res));
			$scope.paper.reviews = [];

			Comments.getComments($scope.paper.p_id).success(function(data) {
				$scope.paper.reviews = data;
			});
		}, function(data, error, headers, status) {
			$scope.failure = true;
		});
	
	}

	else {
		$scope.success = true;
	}

	$scope.addReview = function(review) {
		review.rv_date = date.toUTCString();
		review.p_id = $scope.paper.p_id;
		$scope.setUser();
		
		review.author = $scope.currentUser.userId;
		
		Review.add(review).then(function() {
			review.author = $scope.currentUser.userName;

			
			$scope.paper.reviews.reviews.push(review);
			
			
			$scope.review = {};	
		});
	};
}

abstController.$inject = ['$scope', '$routeParams', 'Papers','Review','Comments'];



function logoutController($scope,Logout,$location,Session) {
	Logout.logout().then(function() {
		$location.path('/login');
		Session.destroy();
	});
}

logoutController.$inject = ['$scope','Logout','$location','Session'];


function tabController() {

	Logout.logout();
	
}