if(sessionStorage.sessionID == undefined) {
	var sessionID = Math.floor(Math.random() * 1000000000);
	sessionStorage.setItem("sessionID", sessionID);
}

console.log(sessionStorage.sessionID);


var app = angular.module('Compounds', ['ui.router', 'ui.bootstrap', 'ngCookies']);

app.config(function($stateProvider, $locationProvider, $urlRouterProvider) {
  $urlRouterProvider.when('', '/');   
  $urlRouterProvider.rule(function ($injector, $location) {
	var path = $location.path();
	var match = path.match(/(.*)!\/{0,1}$/);

	if(match) {
		return match[1];
    }
  });
  
  $locationProvider.html5Mode(true);

  var indexState = {
  	name: 'index',
  	url: '/',
  	templateUrl: '/home.html'
  }

  var productIndexState = {
  	name: 'products',
  	url: '/products/',
 	templateUrl: '/products/products-home.html'
  }

  var productState = {
  	name: 'products.compounds',
  	parent: productIndexState,
  	url: 'compounds',
  	templateUrl: '/products/products.html'
  }

  var serviceState = {
  	name: "services",
  	url: '/services/',
  	templateUrl: '/services/services.html'
  }

  var researchState = {
  	name: "research",
  	url: '/research/',
  	templateUrl: '/research/research.html'
  }

  var supportState = {
  	name: "support",
  	url: '/support/',
  	templateUrl: '/support/support.html'
  }

  var aboutUsState = {
  	name: 'about-us',
  	url: '/support/about-us',
  	templateUrl: '/support/about_us.html'
  }

  var contactState = {
  	name: 'contact-us',
  	url: '/support/contact-us',
  	templateUrl: '/support/contact_us.html'
  }

  var orderState = {
  	name: 'order',
  	url: '/support/order',
  	templateUrl: '/support/order.html'
  }

  var confirmState = {
  	name: 'confirm',
  	url: '/support/confirm',
  	templateUrl: '/support/order-confirm.html'
  }

  $stateProvider.state(indexState);
  $stateProvider.state(productIndexState);
  $stateProvider.state(productState);
  $stateProvider.state(serviceState);
  $stateProvider.state(researchState);
  $stateProvider.state(supportState);
  $stateProvider.state(aboutUsState);
  $stateProvider.state(contactState);
  $stateProvider.state(orderState);
  $stateProvider.state(confirmState);
});

app.controller('compoundCtrl', function($location, $scope, $sce, $http, $uibModal, $log, $document, $cookies, $state){
	$http.get("/products/compounds.php")
	.then(function (response) {
		$scope.compounds = response.data.records;
	});
	
	$http.get('/cart.php/' + sessionStorage.sessionID)
	.then(function(response) {
		$ctrl.items = response.data.records;
	});

	var $ctrl = this;

	$scope.quantity = [];

	$scope.availableQuantity = [{
		value: 1
	}, {
		value: 2
	}, {
		value: 3
	}, {
		value: 4
	}, {
		value: 5
	}, {
		value: 6
	}, {
		value: 7
	}, {
		value: 8
	}, {
		value: 9
	}, {
		value: 10
	}];

	$ctrl.open = function(size, parentSelector) {
		var parentElem = parentSelector ? angular.element($document[0].querySelector('.cart-modal' + parentSelector)) : undefined;
		if($ctrl.items == '') {
			alert("Add something to the cart!");
		}
		else {
			$http.get('/cart.php/' + sessionStorage.sessionID)
			.then(function(response) {
				$ctrl.items = response.data.records;
				var modalInstance = $uibModal.open({
					animation: true,
					ariaLabelledBy: 'modal-title',
					ariaDescribedBy: 'modal-body',
					templateUrl: 'cartModal.html',
					controller: 'ModalInstanceCtrl',
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
			});
		}
	};

	$scope.distributor = {
		title: "Distributors"
	};

	$scope.pnpOptions =[{
		value: '10',
		label: '1 mg'
	}];

	$scope.options = [{
		value: '1',
		label: '100 ug'
	}, {
		value: '5',
		label: '500 ug'
	}, {
		value: '10',
		label: '1 mg'
	}];

	$scope.seriesName = [
		'NA',
		'NS',
		'NS-NA',
		'6S',
		'2S',
		'2S-6S',
		'3S'
	];

	$scope.sizeName = [
		'4-Mer',
		'5-Mer',
		'6-Mer',
		'7-Mer',
		'8-Mer',
		'9-Mer'
	];

	$scope.tagName = [
		'pNP',
		'Azido',
		'Biotin'
	];

	$scope.addToCart = function(pid, size, size_name, qty) {

		var promise = $.post("/products/compounds.php", {id: sessionStorage.sessionID, pid: pid, size: size, size_name: size_name, quantity: qty});

		promise.then(function(success) {
			$http.get('/cart.php/' + sessionStorage.sessionID)
			.then(function(response) {
				$ctrl.items = response.data.records;
				$ctrl.open();
			});
		});
	}

	$scope.pnpPricing = function(family, pricing) {
		if(pricing > 40 && family == 'pNP') {
			return true;
		}
		else {
			return false;
		}
	}

	var search = $location.search();
	$scope.seriesFilter = search.series;
	$scope.tagFilter = search.tag;
	$scope.sizeFilter = search.size;
	$scope.selectedIndex = undefined;

	$scope.filterBy = function(x) {
		$scope.nameFilter = x; 
	}
	$scope.filterUrl = function(x, filter) {
		if(x === $scope.seriesFilter) {
			$scope.seriesFilter = '';
		}
		else if(x === $scope.tagFilter) {
			$scope.tagFilter = '';
		}
		else if(x === $scope.sizeFilter) {
			$scope.sizeFilter = '';
		}
		else {
			switch(filter) {
				case 'series':
					$scope.seriesFilter = x;
					break;
				case 'tag':
					$scope.tagFilter = x;
					break;
				case 'size':
					$scope.sizeFilter = x;
			}
		}
		$location.search({series: $scope.seriesFilter, size: $scope.sizeFilter, tag: $scope.tagFilter});
	}
	$scope.hide = function(x) {
		if(x === '')
			return true;
		else 
			return false;
	}
	$scope.availablity = function(x) {
		if(x === '#')
			return false;
		else if(x === '')
			return false;
		else
			return true;
	}
	$scope.noPrice = function(x) {
		if(x === '0') 
			return true;
		else
			return false;
	}
	$scope.totalPrice = function() {
		total = 0;
		console.log($ctrl.items.length);
		for(i = 0; i < $ctrl.items.length; i++) {
			price = $scope.displayPrice($ctrl.items[i].Price, $ctrl.items[i].size, $ctrl.items[i].quantity);
			total += price;  
		}
		console.log(total);
		return total;
	}
	$scope.displayPrice = function(price, multiplier, quantity) {
		price = Number(price);
		multiplier = Number(multiplier);
		if(multiplier === 5) {
			price = price * multiplier * .7;
		}
		else if(multiplier === 10) {
			price = price * multiplier * .6;
		}
		return price * quantity;
	}
	$scope.isPNP = function(family) {
		if(family === "pNP")
			return true;
		else if(family === "Biotin")
			return true;
		else
			return false;
	}
	$scope.changeGlyph = function(index) {
		if($scope.selectedIndex == undefined)
			$scope.selectedIndex = index;
		else
			$scope.selectedIndex = undefined;
	}

	$scope.cartData = {};

	$scope.confirmPurchase = function() {
		alert(generateUUID());
		$scope.name = $scope.cartData.firstName + " " + $scope.cartData.lastName;
		$scope.shipAddress = $scope.cartData.address + ", " + $scope.cartData.city + ", " + $scope.cartData.state + ", " + $scope.cartData.country + " " + $scope.cartData.zip;
		$scope.billAddress = $scope.cartData.billAddress + ", " + $scope.cartData.billCity + ", " + $scope.cartData.billState + ", " + $scope.cartData.billCountry + " " + $scope.cartData.billZip;
		var id = Date.now();
		$.post("/cart.php", {type: 'customer', id: id, name: $scope.name, email: $scope.cartData.email, phone: $scope.cartData.phone, 
							 shipAddress: $scope.cartData.address, shipCity: $scope.cartData.city, shipState: $scope.cartData.state, shipCountry: $scope.cartData.country, shipZip: $scope.cartData.zip,
							 cartID: sessionStorage.sessionID,
							 bid: id, institution: $scope.cartData.Institution, contact: $scope.cartData.contactName, contactEmail: $scope.cartData.contactEmail, contactPhone: $scope.cartData.contactPhone, 
							 billAddress: $scope.cartData.billAddress, billCity: $scope.cartData.billCity, billState: $scope.cartData.billState, billCountry: $scope.cartData.billCountry, billZip: $scope.cartData.billZip, poNo: $scope.cartData.billPO,
							 oid: generateUUID(), cid: id})
		.then( function(results) {
			$state.go('confirm');
		});
	}
});

angular.module('Compounds').controller('ModalInstanceCtrl', function ($uibModalInstance, $http, items, $scope, $state) {
  var $ctrl = this;
  $ctrl.items = items;

  $ctrl.availableQuantity = [{
		value: 1
	}, {
		value: 2
	}, {
		value: 3
	}, {
		value: 4
	}, {
		value: 5
	}, {
		value: 6
	}, {
		value: 7
	}, {
		value: 8
	}, {
		value: 9
	}, {
		value: 10
	}];

  $ctrl.deleteFromCart = function(pid) {
		var url = "/cart.php/" + pid;
	$http.delete(url)
	.then(function(response) {
		$http.get('/cart.php/'+sessionStorage.sessionID)
		.then(function(response) {
			$ctrl.items = response.data.records;
		});
	});
  }

  $ctrl.displayPrice = function(price, multiplier, quantity) {
	price = Number(price);
	multiplier = Number(multiplier);
	if(multiplier === 5) {
		price = price * multiplier * .7;
	}
	else if(multiplier === 10) {
		price = price * multiplier * .6;
	}
	return price * quantity;
	}
	$ctrl.cartPrice = function(basePrice, multiplier, quantity) {
		quantity = Number(quantity);
		price = $ctrl.displayPrice(basePrice, multiplier) * quantity;
		return price;
	}

  $ctrl.ok = function () {
  	if($ctrl.items == "" || $ctrl.items == null) {
  		$uibModalInstance.close();
  		alert("Add something to the cart!");
  	}
  	else {
  		$state.go('order');
    	$uibModalInstance.close();
  	}
  };

  $ctrl.updateQty = function(pid, qty, index) {
		$http.put("/cart.php/" + sessionStorage.sessionID + "/" + pid + "/" + qty.value)
			.then( function(results) {
				items[index].quantity=qty.value;
			});
  }

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}