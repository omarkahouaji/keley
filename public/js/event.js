 <script type="text/javascript">
    
    var iApp = angular.module("App", ['ngAnimate','ui.bootstrap','jkuri.gallery']);
    iApp.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
    return $sce.trustAsResourceUrl(url);
    };
    }]);
    iApp.controller('DemoController', function($scope) {
    $scope.formatDate=function(date){
    return moment(date).locale('fr').fromNow();
    }
    $scope.dateEvent = function(date){
    return moment(date).locale('fr').format('D MMMM YYYY')
    }

      $scope.increment=function(event){
        if(event.isLiked){
          event.likes.length -= 1;
          event.isLiked = false;
        }
        else{
          event.likes.length +=1;
          event.isLiked=true;       
        }
      }

    //ajouter commentaire
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
    console.log("omar"+json);
    if(json.msg=='success'){
    console.log("tawwa");
    var html = $(
    '<div class="comments-item"'+
      '<div class="comments-container">'+
        '<img class="comments-img " src="<%= path_avatar %>/<%-informations.id_user%>/<%-informations.avatar%>" >'+
        '<h5 class="comments-user-name"><%-informations.first_name%></h5>'+
        '<span class="comments-date">'+moment(json.data.creation_date).locale('fr').fromNow()+'</span>'+
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
      //ajouter like
      $scope.addLike = function (event,e) {
        event.preventDefault();
        if(e.isLiked == false){
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
                console.log('Error posting like')
              }
            }
          });
        }else{
        $.ajax({
          url:'/deleteLike',
          type: 'POST',
          data:{
            event_id:e.id_event
          },
          dataType: 'json',
          success:function(data){
            console.log(data);
            var json = JSON.parse(data);
            console.log(json);
            if(json.msg=='success'){   
              console.log('removed !')
            }else{
              console.log('Error removing like')
            }
          }
        });
        }
    }
      //end ajouter like
      
      var event =<%-event%>;
      
      var images = [];
      var ress={};
      var thumb='';
      var img='';
      for (var j=0;j<event.uploads.length;j++){
      
      ress.thumb='<%= upload_path %>'+event.user_id+'/'+event.id_event+'/small_'+event.uploads[j].file;
      ress.img='<%= upload_path %>'+event.user_id+'/'+event.id_event+'/'+event.uploads[j].file;
      images.push(ress);
      
      ress={};
      thumb='';
      img='';
      }
      event.images =images;
      images=[];
      //console.log(events[i].images);
      


      $scope.event=event;

      });
      
      
      </script>