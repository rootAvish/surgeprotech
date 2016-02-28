(function(){

	'use strict';

	var app = angular/**
	* delegateApp Mod''ule
	*
	* Description
	*/
	.module('delegateApp', []);

	app.controller('formController',['$http','$scope', function($http, $scope){
		
		$scope.formData = {"days": "two"};

		$scope.formSubmit = function(formdata) {

			$http({
	            method: 'POST',
	            url: '/delegate-registration',
				headers: {"Content-type": "application/json"},
	            data: formdata
        	})
        	.success(function(res) {

        		$scope.success = true;
        		alert("Your registration was successful, we will get in touch with you regarding the payment details for the same. For further queries please send an e-mail to anita.gupta@ieema.org");

        	})
        	.error(function(x,y,c,z) {

        		$scope.error = true;
        	});
		}

	}]);

})();