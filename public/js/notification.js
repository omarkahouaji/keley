<script type="text/javascript">
    var iApp = angular.module("App", ['infinite-scroll']);
    iApp.controller('DemoController', function($scope, Reddit) {
      $scope.reddit = new Reddit();
      $scope.formatDate=function(date){
        return moment(date).locale('fr').fromNow();
      }
    });

 iApp.factory('Reddit', function($http) {
    var Reddit = function() {
    this.notifications = [];
    this.busy = false;
    this.after = 0;
    };
    Reddit.prototype.nextPage = function() {
    if (this.busy) return;
    this.busy = true;
    var url = "/getNotifications/"+<%-informations.id_user%>+"/" + this.after;
    $http.get(url).success(function(data) {
    var notifications =data.data;

        for (var i = 0; i < notifications.length; i++) {
    this.notifications.push(notifications[i]);
    }
 
    this.after = this.notifications.length - 1+10;
    this.busy = false;
    }.bind(this));
    };
    return Reddit;
    });
</script>