angular.controller('cartCtrl', function($location, $scope, $sce, $http, $uibModal, $log, $document){
	var $ctrl = this;
	$ctrl.items = ['a', 'b', 'c'];

	$ctrl.open = function() {
		var parentElem = parentSelector ? angular.element($document[0].querySelector('.cart-modal' + parentSelector)) : undefined;
		var modalInstance = $uibModal.open({
			animation: true,
			ariaLabelledBy: 'modal-title',
			ariaDescribedBy: 'modal-body',
			templateUrl: 'cartModal.html',
			controllerAs: '$ctrl',
			size: size,
			appendTo: parentElem,
			resolve: {
				items: function() {
					return $ctrl.items;
				}
			}
		});

		modalInstance.result.then(function (selectedItem) {
			$ctrl.selected = selectedItem;
		});
	};
});
