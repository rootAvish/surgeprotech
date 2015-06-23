angular.module('tabControls', [])
.controller('tabController', function(){
	
	this.currentTab = 1;

	this.setTab = function(tabVal) {
		this.currentTab = tabVal;
		console.log(this.currentTab);
	} ;

	this.isSelected = function(tabVal) {

		if (this.currentTab == tabVal){
			return true;
		}
		else {
			return false;
		}
	}
});

angular.module('CommitteeList',[])

.controller('tcMemberController',['$scope', function($scope){
	
	$scope.tcmembers = {
		"CEA": ['Mr. S.K.Mahapatra'],
		"CPRI":		['Ms. Kanyakumari'],
		"GETCO": ['Mr. Y.V.Joshi'],
		"KPTCL": ['Mr. S. Sumanth'],
		"NTPC": ['Mr. Hirdesh Gupta'],
		"POWERGRID": ['Mr. A.P.Gangadharan'],
		'Raychem': ['Mr. V.Sasikumar'],
		'REC':['Mr. P.J.Thakkar','Mr. Sanjay Kulshrestha']
	};

}])

.controller('ocMemberController',['$scope', function($scope){
	$scope.ocmembers = {
	'APTRANSCO' : ['Mr. Janardhan Reddy'],
	'Chairman,BIS- ET 30': ['Mr. N.S.Sodha'],
	'Secretariat,BIS ET 30': ['Mr. S.S.Yadav'],
	'Crompton Greaves' : ['Mr. Milind Zodage'],
	'Elektrolites' : ['Mr. Anil Saboo'],
	'ERDA': [''],
	'Lamco': ['Mr. Padma Kumar'],
	'L & T': [''],
	'Lamer Power': ['Mr. Mukesh Mallik'],
	'MSEDCL': [''],
	'POWERGRID': ['Mr. Ravi Roshan Kumar']
	};

	console.log($scope.ocmembers);
}]);


angular.bootstrap(document.getElementById("speakers"),['CommitteeList']);