Snipcart.execute('bind', 'cart.opened', function() {
	Snipcart.execute('unbind', 'cart.opened');

	var html = $("#cart-content-text").html();
	$(html).insertBefore($("#snipcart-footer"));
});

Snipcart.api.configure('credit_cards', [
{'type':'visa', 'display':'Visa'},
{'type':'mastercard', 'display':'Mastercard'},
{'type':'discover', 'display':'Discover'}
]);

var app = angular.module('Compounds', ['ui.router', 'ui.bootstrap']);

app.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
  //$locationProvider.html5Mode(true);
}]);

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.when('', '/');   
  $urlRouterProvider.rule(function ($injector, $location) {
	var path = $location.url();
	var match = path.match(/(.*)!\/{0,1}$/); 
	var queryMatch = path.match(/(.*)\?(.*)\!%2F(.*)$/);
	outp = null;
	if(match) {	
		if(typeof search === "undefined" || search === null) {
			outp = match[1];
		}
		else {
			outp = match[1] + '?' + search;	
			search = null;
		}
	}
	if(queryMatch) {
		search = queryMatch[2]; //query parameters
		option = queryMatch[3]; //option between cart and option
		outp = queryMatch[1] + '!/'+ option;
	}
	return outp;
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
  	url: '/compounds?series&size&tag',
  	templateUrl: '/products/products.html',
  	controller: function($stateParams, $scope) {
  		$scope.seriesFilter = $stateParams.series;
  		$scope.sizeFilter = $stateParams.size;
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

  var privacyState = {
  	name: 'privacy',
  	url: '/support/privacy-policy',
  	templateUrl: '/support/privacy-policy.html'
  }

  var termsState = {
  	name: 'terms',
  	url: '/support/terms-conditions',
  	templateUrl: '/support/terms-conditions.html'
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
  $stateProvider.state(privacyState);
  $stateProvider.state(termsState);
});

app.controller('compoundCtrl', function($location, $rootScope, $scope, $sce, $http, $uibModal, $log, $document, $state){
	$rootScope.$on('$stateChangeSuccess', function() {
		document.body.scrollTop = document.documentElement.scrollTop = 0;
		for(x in $scope.compounds) {
			$scope.compounds[x]['isCollapsed'] = true;
		}
	});

	$http.get("/products/compounds.php")
	.then(function (response) {
		$scope.compounds = response.data;
		for(x in $scope.compounds) {
			$scope.compounds[x]['isCollapsed'] = true;
		}
	});

/*******PRICING SECTION********/
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

	$scope.displayPrice = function(price, price2, price3, multiplier) {
		display = 0;
		switch(multiplier) {
			case '1': display = price;
			break;
			case '5': display = price2;
			break;
			case '10': display = price3;
			break;
			default: display = 0;
		}
		display = Number(display);
		return display.toFixed(2);
	}

/*******END OF PRICING SECTION********/

/*******URL READING SECTION********/

	$scope.filterBy = function(x) {
		$scope.nameFilter = x; 
	}
	$scope.filterUrl = function(x, filter) {
		var search = $location.search();
		$scope.seriesFilter = search.series;
		$scope.tagFilter = search.tag;
		$scope.sizeFilter = search.size;
		if(x === $scope.seriesFilter) {
			$scope.seriesFilter = '';
			$location.search({size: $scope.sizeFilter, tag: $scope.tagFilter});
		}
		else if(x === $scope.tagFilter) {
			$scope.tagFilter = '';
			$location.search({series: $scope.seriesFilter, size: $scope.sizeFilter});
		}
		else if(x === $scope.sizeFilter) {
			$scope.sizeFilter = '';
			$location.search({series: $scope.seriesFilter, tag: $scope.tagFilter});
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
					break;
			}
			$location.search({series: $scope.seriesFilter, size: $scope.sizeFilter, tag: $scope.tagFilter});
		}
	}
/*******END OF URL READING SECTION********/
});