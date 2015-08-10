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

.controller('memberController', ['$scope', function($scope){

	$scope.technical = true;

	$scope.change = function() {
		$scope.technical = !$scope.technical;
	};
	
}])

.controller('tcMemberController',['$scope', function($scope){
	
	$scope.tcmembers = {
		"CEA": 'Mr. S.K.Mahapatra',
		"CPRI":	'Ms. Kanyakumari',
		"GETCO": 'Mr. Y.V.Joshi',
		"KPTCL": 'Mr. S. Sumanth',
		"NTPC": 'Mr. Hirdesh Gupta',
		"POWERGRID": 'Mr. A.P.Gangadharan',
		'Raychem': 'Mr. V.Sasikumar',
		'REC':'Mr. P.J.Thakkar'
	};

}])

.controller('ocMemberController',['$scope', function($scope){

	$scope.ocmembers = {
	'APTRANSCO' : 'Mr. Janardhan Reddy',
	'Chairman,BIS- ET 30': 'Mr. N.S.Sodha',
	'Secretariat,BIS ET 30': 'Mr. S.S.Yadav',
	'Crompton Greaves' :'Mr. Milind Zodage',
	'Elektrolites' : 'Mr. Anil Saboo',
	'ERDA': 'Mr. Tritha Vishwakarma',
	'Lamco': 'Mr. Padma Kumar',
	'Lamer Power': 'Mr. Mukesh Mallik',
	'MSEDCL': 'Mr. Pratik Bhandarkar'
	};
}]);


angular.bootstrap(document.getElementById("speakers"),['CommitteeList']);