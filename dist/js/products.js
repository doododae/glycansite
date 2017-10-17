document.addEventListener('snipcart.ready', function() {
	Snipcart.DEBUG = false;
});


var app = angular.module('Compounds', ['ui.router', 'ui.bootstrap', 'ngCookies']);

app.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
}]);

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.when('', '/');   
  $urlRouterProvider.rule(function ($injector, $location) {
	var path = $location.path();
	var match = path.match(/(.*)!\/{0,1}$/);

	if(match) {
		return match[1];
    }
  });

  var indexState = {
  	name: 'index',
  	url: '/',
  	templateUrl: '/home.html'
  }

  var newsIndexState = {
  	name: 'news',
  	url: '/news',
  	templateUrl: '/news/news-home.html'
  }

  var newsState = {
  	name: 'news.detailed',
  	parent: newsIndexState,
  	url: '/:newsId',
  	templateUrl: function($stateParams) {
  		return '/news/' + $stateParams.newsId + '.html';
  	}
  }

  var productIndexState = {
  	name: 'products',
  	url: '/products',
 	templateUrl: '/products/products-home.html'
  }

  var productState = {
  	name: 'products.compounds',
  	parent: productIndexState,
  	url: '/compounds?series&tag',
  	templateUrl: '/products/products.html',
  	controller: function($stateParams, $scope) {
	  $scope.seriesFilter = $stateParams.series;
	  $scope.tagFilter = $stateParams.tag;
  	}
  }

  var serviceState = {
  	name: "services",
  	url: '/services',
  	templateUrl: '/services/services.html'
  }

  var researchState = {
  	name: "research",
  	url: '/research',
  	templateUrl: '/research/research.html'
  }

  var supportState = {
  	name: "support",
  	url: '/support',
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

  $stateProvider.state(indexState);
  $stateProvider.state(productIndexState);
  $stateProvider.state(productState);
  $stateProvider.state(serviceState);
  $stateProvider.state(researchState);
  $stateProvider.state(supportState);
  $stateProvider.state(aboutUsState);
  $stateProvider.state(contactState);
  $stateProvider.state(newsIndexState);
  $stateProvider.state(newsState);
});

app.controller('compoundCtrl', function($location, $scope, $sce, $http, $uibModal, $log, $document, $cookies, $state){
	$http.get("/products/compounds.php")
	.then(function (response) {
		$scope.compounds = response.data;
	});

/*******PRICING SECTION********/
	$scope.distributor = {
		title: "Distributors"
	};

	$scope.pnpOptions =[{
		value: '10',
		label: '1 mg'
	}];

	$scope.biotinOptions =[{
		value: '1',
		label: '100 ug'
	}];

	$scope.fluorOptions = [{
		value: '1',
		label: '50 ug'
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

	$scope.baseOptions = [{
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
		'Biotin',
		'Fluorescein'
	];

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
	$scope.pnpPricing = function(family, pricing) {
		if(family === 'pNP') {
			$scope.pricing = $scope.pnpOptions[0];
			return true;
		}
		else if(family === 'Biotin') {
			$scope.options = $scope.biotinOptions;
			$scope.pricing = $scope.options[0];
			return false;
		}
		else if(family === 'Fluorescein') {
			$scope.options = $scope.fluorOptions;
			$scope.pricing = $scope.options[0];
			return false;
		}
		else {
			$scope.options = $scope.baseOptions;
			$scope.pricing = $scope.options[0];			
			return false;
		}
	}

	$scope.displayPrice = function(price, multiplier, tag) {
		price = Number(price);
		multiplier = Number(multiplier);
		if(multiplier === 5) {
			if(price > 40) {
				if(tag == "pNP")
					if(price === 150) {
						price = 500;
					}
					else 
						price = price * multiplier * .65;				
				else 
					price = price * multiplier * .7;
			}
			else
				price = price * multiplier;
		}
		else if(multiplier === 10) {
			if(price > 40) {
				if(tag == "pNP")
					if(price === 150)
						price = 800;
					else
						price = price * multiplier * .52;
				else
					price = price * multiplier * .6;
			}
			else
				price = price * multiplier;
		}
		$scope.price = price;
		return price.toFixed(2);
	}
	$scope.isPNP = function(family) {
		if(family === "pNP")
			return true;
		else if(family === "Biotin" || family === "Fluorescein")
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
/*******PRICING SECTION********/

/*******URL READING SECTION********/
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
/*******URL READING SECTION********/
});