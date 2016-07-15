<script type="text/javascript">
        function mdelete (id) {
        //e.preventDefault();
        $.ajax({
          url:'/deleteEvent/'+id,
          type: 'GET',
          dataType: 'json',
          success:function(data){
            var json = JSON.parse(data);
            if(json.msg=='success'){   
                console.log('deleted yesssss !!!');
            }
          }
        });
        $('#'+id).remove();
      }

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
            if(json.msg=='success'){   
              console.log("tawwa");
              var html = $(
                '<div class="comments-item"'+
                '<div class="comments-container">'+
                '<img class="comments-img " src="<%=path_avatar%>/<%-informations.id_user%>/<%-informations.avatar%>" >'+
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

//end delete like

        $scope.delete = function (e,id) {
        e.preventDefault();
        $.ajax({
          url:'/deleteEvent/'+id,
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
    var url = "/eventsAngular/"+<%-informations.id_user%>+"/" + this.after;

    $http.get(url).success(function(data) {
    var events =data.data;
    var images = [];
    var ress={};
    var thumb='';
    var img='';

    for (var i = 0; i < events.length; i++) {
    for (var j=0;j<events[i].uploads.length;j++){
    
    ress.thumb='<%-upload_path%>'+events[i].user_id+'/'+events[i].id_event+'/small_'+events[i].uploads[j].file;
    ress.img='<%-upload_path%>'+events[i].user_id+'/'+events[i].id_event+'/'+events[i].uploads[j].file;
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
    this.events.push(events[i]);
    }
    this.after = this.events.length;
    this.busy = false;
    }.bind(this));
    };
    return Reddit;
    });
    
    //filter public privée amis
    iApp.filter('myfilter', function() {
    return function( items, types) {
    var filtered = [];
    angular.forEach(items, function(item) {
    if(types.private == false && types.public == false && types.friends ==false) {
    filtered.push(item);
    }
    if(types.private == true && item.chart_privacy == '0'){
    filtered.push(item);
    }
    if(types.friends == true && item.chart_privacy == '1'){
    filtered.push(item);
    }
    if(types.public == true && item.chart_privacy == '2'){
    filtered.push(item);
    }
    });
    return filtered;
    };
    });
    //end filter 
  </script>