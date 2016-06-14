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
           return moment(date).locale('fr').fromNow();
      }
      $scope.dateEvent = function(date){
        return moment(date).locale('fr').format('D MMMM YYYY')
      }


//increment  likes length
      $scope.increment=function(event){
        event.likes.length +=1;
        event.isLiked=true;
      }
//end increment  likes length

      //ajouter commentaire
      $scope.addComment = function (event,e,content) {
        event.preventDefault();
        console.log(e);  
        $.ajax({
          url:'/postComment',
          type: 'POST',
          data:{
            event_id:e.id_event,
            event_user_id:e.id_user,
            content:content
          },
          dataType: 'json',
          success:function(data){
            var json = JSON.parse(data);
            console.log("omar"+json);
            if(json.msg=='success'){   
              console.log("tawwa");
              var html = $(
                '<div class="comments-item"'+
                '<div class="comments-container">'+
                '<img class="comments-img " src="http://localhost:85/api.immortality.life/application/uploads/avatars/<%-informations.id_user%>/<%-informations.avatar%>" >'+
                '<h5 class="comments-user-name"><%-informations.first_name%></h5>'+
                '<span class="comments-date">'+json.data.creation_date+'</span>'+
                '<p>'+content+'</p>'+
                '</div></div>'
                );
              $('.added').append(html);

            }else{
              console.log('Erreur posting comment')
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
            event_user_id:e.id_user
          },
          dataType: 'json',
          success:function(data){
            var json = JSON.parse(data);
            console.log(json);
            if(json.msg=='success'){   
              console.log('Liked !')

            }else{
              console.log('Error posting like')
            }
          }
        });
      }
//end ajouter like

        $scope.delete = function (e,event) {
        e.preventDefault();
        $.ajax({
          url:'/deleteEvent/'+event.id_event,
          type: 'GET',
          dataType: 'json',
          success:function(data){
            var json = JSON.parse(data);
            console.log(json);
            if(json.msg=='success'){   
                console.log('deleted yesssss !!!');

            }
          }
        });
      }





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
    var url = "/events_timeline/"+<%-informations.id_user%>+"/" + this.after;
    $http.get(url).success(function(data) {
    var events =data.data;
    var images = [];
    var ress={};
    var thumb='';
    var img='';
    for (var i = 0; i < events.length; i++) {
      console.log(events[i].type);
      if(events[i].type =="1"){
          for (var j=0;j<events[i].uploads.length;j++){
          
          ress.thumb='http://localhost:85/api.immortality.life/application/uploads/'+events[i].id_user+'/'+events[i].id_event+'/small_'+events[i].uploads[j].file;
          ress.img='http://localhost:85/api.immortality.life/application/uploads/'+events[i].id_user+'/'+events[i].id_event+'/'+events[i].uploads[j].file;
          ress.id=events[i].uploads[j].id_upload;
          ress.event_id=events[i].id_event;
          images.push(ress);
          
          ress={};
          thumb='';
          img='';
          }
          events[i].images =images;
          images=[];
          //console.log(events[i].images);
          
     }
     this.events.push(events[i]);
    }
    this.after = this.events.length;
    this.busy = false;
    }.bind(this));
    };
    return Reddit;
    });
    
    
  </script>