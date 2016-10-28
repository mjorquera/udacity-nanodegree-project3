(function() {
  var app = angular.module('reviewer', []);

  app.controller('ReviewsController', function($scope, $http){
    $http.get('data/restaurants.json').then(function(response) {
        $scope.restaurants = response.data.restaurants;
        $scope.restaurants.forEach(function(restaurant) {
          $http.get('data/reviews/' + restaurant.id + '.json').then(function(response) {
            restaurant.reviewCount = response.data.reviews.length;
          }, function(response){
            restaurant.reviewCount = 0;
          });
        });
        debugger;
    });

    $scope.getAverage = function(idRestaurant){
      $http.get('data/reviews/'+idRestaurant+'.json').then(function(response) {
          return response.data.reviews.length;
      });
    };

    var countReviews = function(idRestaurant){

    };
  });

})();
