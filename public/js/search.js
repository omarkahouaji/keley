       <script>
        var iApp = angular.module("App", ['infinite-scroll']);
        iApp.controller('DemoController', function ($scope, Reddit,RedditEvents,RedditUsers) {
        $scope.reddit = new Reddit();
        $scope.redditEvents = new RedditEvents();
        $scope.RedditUsers = new RedditUsers();
        $scope.formatDate = function (date) {
            return moment(date).fromNow();
        }

        $scope.toggleMe = function(){
            console.log($scope.toggle);
            $scope.toggle = !$scope.toggle;
        }
            $scope.toggleMee = function(){
     $scope.toggle1 = !$scope.toggle1;
    }

            //followchart
                $scope.followChart = function (event,chart) {
                    console.log("f m");
                    $.ajax({
                      url:'/followChart',
                      type: 'POST',
                      data:{
                        id_user:<%-informations.id_user%>,
                        id_chart: chart.id_chart
                      },
                      dataType: 'json',
                      success:function(data){
                        var json = JSON.parse(data);
                        if(json.msg=='success'){  
                        }else{
                          console.log('no :(')
                        }
                      }
                    });
                }
                //

                $scope.unfollow_effect = function(){
                    $('.search-right .followed').addClass('unfollow');
                    $('.search-right .followed').removeClass('followed');
                    $('.search-right .unfollow').html('Se désabonner')
                }
                $scope.follow_effect = function(){
                    $('.search-right .unfollow').addClass('followed');
                    $('.search-right .unfollow').removeClass('unfollow');
                    $('.search-right .followed').html('<i class="icon-public"></i>Abonné')
                }

                $scope.unfollow_chart = function (chart) {
                    console.log("u m");
                    $.ajax({
                      url:'/unfollow_chart',
                      type: 'POST',
                      data:{
                        user_id:<%-informations.id_user%>,
                        chart_id: chart.id_chart
                      },
                      dataType: 'json',
                      success:function(data){
                        console.log(data);
                      }
                    });
                }
                

        //send Friend Request
        $scope.sendFriendRequest = function (event,user) {
            event.preventDefault();
            $.ajax({
              url:'/sendFriendRequest',
              type: 'POST',
              data:{
                sender_id:<%-informations.id_user%>,
                recipient_id:user.id_user
              },
              dataType: 'json',
              success:function(data){
                var json = JSON.parse(data);
                if(json.msg=='success'){   
                        console.log('yes');
                }else{
                  console.log('no :(')
                }
              }
            });
        }
      //end

      //addFriend
        $scope.addFriend = function (event,user) {
            event.preventDefault();
            $.ajax({
              url:'/addFriend',
              type: 'POST',
              data:{
                user_id:<%-informations.id_user%>,
                id:user.id_user,
              },
              dataType: 'json',
              success:function(data){
                var json = JSON.parse(data);
                if(json.msg=='success'){   
                    console.log('yes');
                }else{
                    console.log('no :(')
                }
              }
            });
      }
      //end

        //deleteFriend
        $scope.deleteFriend = function (event,user) {
            event.preventDefault();
            $.ajax({
              url:'/deleteFriend',
              type: 'POST',
              data:{
                user_id:<%-informations.id_user%>,
                id:user.id_user,
              },
              dataType: 'json',
              success:function(data){
                var json = JSON.parse(data);
                if(json.msg=='success'){   
                    console.log('yes');
                }else{
                  console.log('no :(')
                }
              }
            });
         }
         //end
        });


        iApp.factory('RedditEvents', function ($http) {
        var RedditEvents = function () {
        this.events = [];
        this.busy = false;
        this.after = 0;
        };

        RedditEvents.prototype.nextPage = function () {
        if (this.busy) return;
        this.busy = true;
        var req = {
        method: 'POST',
        url: '/getEvents/',
        data: {
        id_user: <%-informations.id_user%>,
        offset: this.after,
        limit: 10,
        term: '<%-term%>'
        }
        }
        $http(req).success(function (data) {
        var events = data.data;
        for (var i = 0; i < events.length; i++) {
        this.events.push(events[i]);
        }
        this.after = this.events.length;
        this.busy = false;
        }.bind(this));
        };
        return RedditEvents;
        });

        iApp.factory('RedditUsers', function ($http) {
        var RedditUsers = function () {
        this.users = [];
        this.busy = false;
        this.after = 0;
        };



        RedditUsers.prototype.nextPage = function () {
        if (this.busy) return;
        this.busy = true;
        var req = {
        method: 'POST',
        url: '/searchUsers/',
        data: {
        id_user: <%-informations.id_user%>,
        offset: this.after,
        limit: 10,
        term: '<%-term%>'
        }
        }
        $http(req).success(function (data) {
        var users = data.data;
        for (var i = 0; i < users.length; i++) {
        this.users.push(users[i]);
        }
        this.after = this.users.length - 1 + 10;
        this.busy = false;
        }.bind(this));
        };
        return RedditUsers;
        });


        iApp.factory('Reddit', function ($http) {
        var Reddit = function () {
        this.charts = [];
        this.busy = false;
        this.after = 0;
        };
        Reddit.prototype.nextPage = function () {
        if (this.busy) return;
        this.busy = true;
        var req = {
        method: 'POST',
        url: '/getCharts/',
        data: {
        id_user: <%-informations.id_user%>,
        offset: this.after,
        limit: 10,
        term: '<%-term%>'
        }
        }
        $http(req).success(function (data) {
        var charts = data.data;
        for (var i = 0; i < charts.length; i++) {
        this.charts.push(charts[i]);
        }
        this.after = this.charts.length - 1 + 10;
        this.busy = false;
        }.bind(this));
        };
        return Reddit;
        });
        </script>