var app=angular.module("reviewer",["firebase"]);app.config(["$locationProvider",function(e){e.html5Mode(!0)}]);var getAverage=function(e){var t=e.length,r=0;e.forEach(function(e){r+=e.rating});var a=r/t;return a.toFixed(1)};app.controller("ReviewsController",["$scope","$firebaseArray",function(e,t){e.restaurants=[];var r=firebase.database().ref("/restaurants"),a=t(r);a.$loaded().then(function(t){t.forEach(function(e){e.isVisible=!0,"undefined"!=typeof e.reviews&&e.reviews.length>0?(e.reviewCount=e.reviews.length,e.averageRating=Math.round(getAverage(e.reviews))):e.reviewCount=0}),e.restaurants=t}),e.clearFilter=function(){e.search={}},e.filterByType=function(t){e.restaurants.forEach(function(e){e.type==t||"All"==t?e.isVisible=!0:e.isVisible=!1})},e.range=function(e){return new Array(e)}}]),app.controller("ReviewController",["$scope","$http","$location","$firebaseObject",function(e,t,r,a){var n=r.search().id;e.newReview={};var i=firebase.database().ref("/restaurants").child(n);e.restaurant=a(i),e.restaurant.$loaded().then(function(t){"undefined"!=typeof t.reviews?(e.restaurant.reviewCount=t.reviews.length,e.restaurant.reviewRating=getAverage(t.reviews),e.restaurant.averageRating=Math.round(getAverage(t.reviews))):e.restaurant.reviewCount=0}),e.save=function(t){e.newReview.date=(new Date).toISOString(),e.newReview.avatar="https://robohash.org/"+t.email+".png",console.log(t),"undefined"==typeof e.restaurant.reviews?e.restaurant.reviews=[t]:e.restaurant.reviews.push(t),e.restaurant.reviewCount=e.restaurant.reviews.length,e.restaurant.reviewRating=getAverage(e.restaurant.reviews),e.restaurant.averageRating=Math.round(getAverage(e.restaurant.reviews)),e.restaurant.$save(e.restaurant).then(function(e){$("#newReviewModal").modal("hide"),$.notify({message:"Review added correctly"},{type:"success",placement:{align:"center"}})}).catch(function(e){$.notify({message:"We couldn't add the review: "+e},{type:"danger",placement:{align:"center"}})})},e.setRating=function(t){e.newReview.rating=t},e.reset=function(){$(".rating .selected").removeClass("selected"),e.newReview={}},e.range=function(e){return new Array(e)}}]),$(".rating input").change(function(){var e=$(this);$(".rating .selected").removeClass("selected"),e.closest("label").addClass("selected")});