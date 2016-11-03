// (function() {
  var app = angular.module('reviewer', ['firebase']);

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

  app.controller('ReviewsController', function($scope, $firebaseArray){
    $scope.restaurants = [];
    var ref = firebase.database().ref("/restaurants");
    var restaurantsList = $firebaseArray(ref);

    restaurantsList.$loaded().then(function(restaurants) {
      restaurants.forEach(function(restaurant) {
        restaurant.isVisible = true;
        if (typeof restaurant.reviews !== 'undefined' && restaurant.reviews.length > 0) {
          restaurant.reviewCount = restaurant.reviews.length;
          restaurant.averageRating = Math.round(getAverage(restaurant.reviews));
        } else {
          restaurant.reviewCount = 0;
        }
      });
      $scope.restaurants = restaurants;
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

  app.controller('ReviewController', function($scope, $http, $location, $firebaseObject){
    var id = $location.search().id;
    $scope.newReview = {};

    var ref = firebase.database().ref("/restaurants").child(id);
    $scope.restaurant = $firebaseObject(ref);

    $scope.restaurant.$loaded().then(function(restaurant) {
      if (typeof restaurant.reviews !== "undefined") {
        $scope.restaurant.reviewCount = restaurant.reviews.length;
        $scope.restaurant.reviewRating = getAverage(restaurant.reviews);
        $scope.restaurant.averageRating = Math.round(getAverage(restaurant.reviews));
      } else {
        $scope.restaurant.reviewCount = 0;
      }
    });

    $scope.save = function(newReview){
      $scope.newReview.date = new Date().toISOString();
      $scope.newReview.avatar = "https://robohash.org/" + newReview.email + ".png"
      console.log(newReview);
      if (typeof $scope.restaurant.reviews == "undefined") {
        $scope.restaurant.reviews = [newReview];
      } else {
        $scope.restaurant.reviews.push(newReview);
      }
      $scope.restaurant.reviewCount = $scope.restaurant.reviews.length;
      $scope.restaurant.reviewRating = getAverage($scope.restaurant.reviews);
      $scope.restaurant.averageRating = Math.round(getAverage($scope.restaurant.reviews));

      $scope.restaurant.$save($scope.restaurant).then(function(newRef){
        $('#newReviewModal').modal('hide');
        $.notify({
        	message: 'Review added correctly'
        },{
        	type: 'success',
          placement: {align: 'center'}
        });
      }).catch(function(error){
        $.notify({message: "We couldn't add the review: " + error},{
          type: 'danger',
          placement: {align: 'center'}
        });
      });
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
//
// })();
