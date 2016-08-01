<script type="text/javascript">

function addFriend(){
              //event.preventDefault();
            $.ajax({
              url:'/addFriend',
              type: 'POST',
              data:{
                user_id:<%-informations.id_user%>,
                id:<%=friends_data.id_user%>,
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
                    $('.response').remove();
        $('#friend').show();
}



        //deleteFriend
        function deleteFriend(){
            event.preventDefault();
            $.ajax({
              url:'/deleteFriend',
              type: 'POST',
              data:{
                user_id:<%-informations.id_user%>,
                id:<%=friends_data.id_user%>
              },
              dataType: 'json',
              success:function(data){
                var json = JSON.parse(data);
                console.log(json);
                if(json.msg=='success'){   
                    console.log('yes');
                }else{
                  console.log('no :(')
                }
              }
            });
        $('.response').remove();
        $('#addafter').show();
         }
         //end


        function sendFriendRequest() {
        //event.preventDefault();
        $.ajax({
          url:'/sendFriendRequest',
          type: 'POST',
          data:{
            sender_id:<%-informations.id_user%>,
            recipient_id:<%=friends_data.id_user%>
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
        $('#add').remove();
        $('#request').show();
      }

$('#profile_link').addClass('items_active'); 

</script>