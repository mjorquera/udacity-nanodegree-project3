(function() {
  var app = angular.module('reviewer', []);

  app.config(['$locationProvider', function($locationProvider){
    $locationProvider.html5Mode(true);
  }]);

  var getAverage = function(reviews){
    var length = reviews.length;
    var sum = 0;
    reviews.forEach(function(review){
      sum += review.rating;
    });
    var average = sum / length;
    return average.toFixed(1);
  };

  app.controller('ReviewsController', function($scope, $http){
    $http.get('data/restaurants.json').then(function(response) {
        $scope.restaurants = response.data.restaurants;
        $scope.restaurants.forEach(function(restaurant) {
          restaurant.isVisible = true;
          $http.get('data/reviews/' + restaurant.id + '.json').then(function(response) {
            restaurant.reviewCount = response.data.reviews.length;
            restaurant.averageRating = parseInt(getAverage(response.data.reviews));
          }, function(response){
            restaurant.reviewCount = 0;
          });
        });
    });

    $scope.clearFilter = function() {
      $scope.search = {};
    };

    $scope.filterByType = function(cousineType){
      $scope.restaurants.forEach(function(restaurant){
        if (restaurant.type == cousineType || cousineType == "All") {
          restaurant.isVisible = true;
        } else {
          restaurant.isVisible = false;
        }
      });
    };

    $scope.range = function(n){
      return new Array(n);
    };
  });

  app.controller('ReviewController', function($scope, $http, $location){
    var id = $location.search().id;
    $http.get('data/restaurants.json').then(function(response) {
        var result = $.grep(response.data.restaurants, function(e) {return e.id ==id; });
        $scope.restaurant = result[0];
        //get the review for the restaurant
        $http.get('data/reviews/' + id + '.json').then(function(response) {
          $scope.restaurant.reviewCount = response.data.reviews.length;
          $scope.restaurant.reviews = response.data.reviews;
          $scope.restaurant.reviewRating = getAverage(response.data.reviews);
        }, function(response){
          $scope.restaurant.reviewCount = 0;
        });
    });

  });

})();
