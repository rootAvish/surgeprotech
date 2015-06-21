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
