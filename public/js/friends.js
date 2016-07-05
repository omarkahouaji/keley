<script type="text/javascript">

     var iApp = angular.module("App", ['infinite-scroll']);


     iApp.controller('DemoController', function($scope, Reddit) {
      $scope.reddit = new Reddit();
      //$scope.types = {private: false, public:false};
  });

// Reddit constructor function to encapsulate HTTP and pagination logic
iApp.factory('Reddit', function($http) {
  var Reddit = function() {
    this.friends = [];
    this.busy = false;
    this.after = 0;
};

Reddit.prototype.nextPage = function() {

    if (this.busy) return;
    this.busy = true;
    if(<%-friend%>==false){
      var url = "/getFriends/"+<%-informations.id_user%>+"/" + this.after;
    }
    else{
      var url = "/getFriends/"+<%-friends_data.id_user%>+"/" + this.after;
    }
    
    $http.get(url).success(function(data) {
        console.log(data);
        var friends =data.data;
        for (var i = 0; i < friends.length; i++) {
            this.friends.push(friends[i]);
        }
        this.after = this.friends.length ;
        this.busy = false;
    }.bind(this));
};

return Reddit;
});
</script>