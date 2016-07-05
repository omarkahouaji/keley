<script type="text/javascript">
    
    var iApp = angular.module("App", ['infinite-scroll','ngAnimate','ui.bootstrap','jkuri.gallery']);
    iApp.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
    return $sce.trustAsResourceUrl(url);
    };
    }]);
    iApp.controller('DemoController', function($scope, Reddit) {
      
      $scope.reddit = new Reddit();
      $scope.types = {private: false, public:false,friends:false};

      $scope.formatDate=function(date){
           return moment(date).fromNow();
      }
      $scope.dateEvent = function(date){
        return moment(date).locale('fr').format('D MMMM YYYY')
      }

//increment  likes length
      $scope.increment=function(event){
        event.likes.length +=1;
        console.log(event.likes.length);
        event.isLiked=true;
      }
//end increment  likes length

//ajout commentaire
      $scope.addComment = function (event,e,content) {
        event.preventDefault();
        console.log(e);  
        $.ajax({
          url:'/postComment',
          type: 'POST',
          data:{
            event_id:e.id_event,
            event_user_id:e.user_id,
            content:content
          },
          dataType: 'json',
          success:function(data){
            var json = JSON.parse(data);
            console.log(json);
            if(json.msg=='success'){   
              var html = $(
                '<div class="comments-item"'+
                '<div class="comments-container">'+
                '<img class="comments-img " src="http://localhost:85/api.immortality.life/application/uploads/avatars/<%-me.id_user%>/<%-me.avatar%>" >'+
                '<h5 class="comments-user-name"><%-me.first_name%></h5>'+
                '<span class="comments-date">'+json.data.creation_date+'</span>'+
                '<p>'+content+'</p>'+
                '</div></div>'
                );
              $('.added').append(html);

            }else{
              console.log('no :(')
            }
          }
        });
      }
      //end ajouter commentaire
      //ajouter like
      $scope.addLike = function (event,e) {
        event.preventDefault();
        console.log(e);  
        $.ajax({
          url:'/postLike',
          type: 'POST',
          data:{
            event_id:e.id_event,
            event_user_id:e.user_id
          },
          dataType: 'json',
          success:function(data){
            var json = JSON.parse(data);
            console.log(json);
            if(json.msg=='success'){   
              console.log('Liked !')

            }else{
              console.log('Erreur posting like')
            }
          }
        });
      }
//end ajouter like

    });
    
      

    
    
    iApp.factory('Reddit', function($http) {
    var Reddit = function() {
    this.events = [];
    this.busy = false;
    this.after = 0;
    };
    Reddit.prototype.nextPage = function() {
    if (this.busy) return;
    this.busy = true;
    var url = "/eventsAngular/"+<%-friends_data.id_user%>+"/" + this.after;
    $http.get(url).success(function(data) {
      
    var events =data.data;
    var images = [];
    var ress={};
    var thumb='';
    var img='';
    var nb = 0;

    for (var i = 0; i < events.length; i++) {
    for (var j=0;j<events[i].uploads.length;j++){
    
    ress.thumb='<%-upload_path%>'+events[i].user_id+'/'+events[i].id_event+'/small_'+events[i].uploads[j].file;
    ress.img='<%-upload_path%>'+events[i].user_id+'/'+events[i].id_event+'/'+events[i].uploads[j].file;
    images.push(ress);
    
    ress={};
    thumb='';
    img='';
    }
    events[i].images =images;
    images=[];
    //console.log(events[i].images);
    if( events[i].chart_privacy != "0" || events[i].chart_privacy != "1" )
    this.events.push(events[i]);
    }
    if(this.events.length==0){
      $('<span>Pas d\'événements publics</span>').appendTo('#container');
    }
    this.after = this.events.length;
    this.busy = false;
    }.bind(this));
    };
    return Reddit;
    });
    

    </script>
  </head>