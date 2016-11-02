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
    var restaurantsRef = firebase.database().ref("/restaurants").limitToFirst(2);
    restaurantsRef.on('value', function(snapshot) {
      $scope.restaurants = snapshot.val();
      $scope.restaurants.forEach(function(restaurant) {
        restaurant.isVisible = true;
        if (typeof restaurant.reviews !== 'undefined' && restaurant.reviews.length > 0) {
          restaurant.reviewCount = restaurant.reviews.length;
          restaurant.averageRating = Math.round(getAverage(restaurant.reviews));
        } else {
          restaurant.reviewCount = 0;
        }
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
    $scope.newReview = {};

    $http.get('data/restaurants.json').then(function(response) {
        var result = $.grep(response.data.restaurants, function(e) {return e.id ==id; });
        $scope.restaurant = result[0];
        //get the review for the restaurant
        $http.get('data/reviews/' + id + '.json').then(function(response) {
          $scope.restaurant.reviewCount = response.data.reviews.length;
          $scope.restaurant.reviews = response.data.reviews;
          $scope.restaurant.reviewRating = getAverage(response.data.reviews);
          $scope.restaurant.averageRating = Math.round(getAverage(response.data.reviews));
        }, function(response){
          $scope.restaurant.reviewCount = 0;
        });
    });

    $scope.save = function(newReview){
      $scope.newReview.date = new Date();
      $scope.newReview.avatar = "https://robohash.org/" + newReview.email + ".png"
      console.log(newReview);
    };

    $scope.setRating = function(selectedRating){
      $scope.newReview.rating = selectedRating;
    };

    $scope.reset = function(){
      $('.rating .selected').removeClass('selected');
      $scope.newReview = {};
    };

    $scope.range = function(n){
      return new Array(n);
    };
  });

  $('.rating input').change(function () {
    var $radio = $(this);
    $('.rating .selected').removeClass('selected');
    $radio.closest('label').addClass('selected');
  });

})();
