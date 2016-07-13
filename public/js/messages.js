        <script type="text/javascript">
        $(function() {
          var is_open = 0; // chat nav not opened
          var is_open_chat = 1; // chat nav not opened
          var unreadTab = [];

          //open or close chat nav
          $('.chat__users').click(function(){
            if(is_open == 0){
              $('.chat').css({"bottom":"0px"});
              is_open = 1;
            }else{
              $('.chat').css({"bottom":"-350px"});
              is_open = 0;
            }
          })

          $('.chat_box_name').click(function(){
            if(is_open_chat == 0){
              $('.chat_box').css({"bottom":"0px"});
              $('#form_submit').css({"bottom":"0px"});
              is_open_chat = 1;
            }else{
              $('.chat_box').css({"bottom":"-270px"});
              $('#form_submit').css({"bottom":"-30px"});
              is_open_chat = 0;
            }
          })


          //declaration des variables
          var socket = io();
          var nb = 0; //nombre d'utlisateurs
          var users = []; //les utlisateurs connectés
          var opend_id; // boolean : utilisateur avec id ... sa fenetre ouverte ou non
          socket.emit('join', {id: '<%=informations.id_user%>'}); // lorsque je me connecte j'envoi un emit (join)var current_user;
          var current_user;


          socket.emit('connected', {
            id:'<%=informations.id_user%>',
            first_name:'<%=informations.first_name%>',
            last_name:'<%=informations.last_name%>',
            avatar:'<%=informations.avatar%>'
          }); //lorsque je me connecte j'envoi un emit connected

          
          //ay we7ed yconnecti on fait ...
          socket.on("connected_users", function(data) {
            $('#users').append('<li id="'+data.id+'" style="display:block"></li>');
            $("#"+data.id).append('<img src="<%=path_avatar%>/'+data.id+'/'+data.avatar+'" width="30px">'+'<span>'+data.first_name+' '+data.last_name+'</span');
            users[data.id] = {"first_name" : data.first_name, "last_name" : data.last_name, "id" : data.id };
            nb++; // number of connected users
            $('.chat__users').html('Amis en ligne: '+nb)
          });


          $('body').on('click', 'img', function (event) {
            $('.chat_box').scrollTop(200);
          })

          
          

          $('body').on('click', 'li', function (event) {
            current_user = event.target.id;
            $('#messages').empty();
            $.ajax({
              url:'/messages/'+<%=informations.id_user%>+'/'+event.target.id,
              type: 'GET',
              dataType: 'json',
              success:function(data){
                if(data.data !== undefined){
                for(var k=0;k<data.data.length;k++){
                  if(data.data[k].sender_id == <%=informations.id_user%>){
                    /*$('#messages').append($('<li class="chat_me">'));
                    $('.chat_me').append($('<span>').text(data.data[k].text));*/
                    $('#messages').append('<li class="chat_me"><span>'+data.data[k].text+'</span></li>');
                  }else{
                    //$('#messages').append($('<li style="color:red">').text(data.data[k].text));
                    $('#messages').append('<li class="chat_friend"><span>'+data.data[k].text+'</span></li>');
                  }
                }
                }
                
                $('.chat_box').show();
                $('.chat_box_ul').animate({scrollTop: $('.chat_box_ul').prop("scrollHeight")}, $('.chat_box_ul').height());

                $('.chat_box_name').text(users[event.target.id].first_name+' '+users[event.target.id].last_name);
                $('.chat_box').css({"bottom":"0px"});
                is_open_chat = 1;

              }
            });

              console.log(event.target.id);
                opend_id = event.target.id;



                //$('.chat_box_ul').animate({scrollTop: $('.chat_box_ul').prop("scrollHeight")}, $('.chat_box_ul').height());
                //$('.chat_box_ul').animate({scrollTop: $('.chat_box_ul').prop("scrollHeight")}, $('.chat_box_ul').height());

                  $('form').submit(function(){
                    
                    if($('#m').val() != ''){
                      $.ajax({
                        url:'/addMessage',
                        type: 'POST',
                        data:{
                          recipient_id:current_user,
                          text:$('#m').val()
                        },
                        dataType: 'json',
                        success:function(data){
                            console.log(data);
                            $('#m').val('');
                        }
                      });

                      socket.emit('chat message', {from_id:'<%=informations.id_user%>', to_id : event.target.id, msg:$('#m').val()});

                      //$('#messages').append($('<li style="color:blue">').text($('#m').val()));
                      $('#messages').append('<li class="chat_me"><span>'+$('#m').val()+'</span></li>');
                      $('.chat_box_ul').animate({scrollTop: $('.chat_box_ul').prop("scrollHeight")}, $('.chat_box_ul').height());
                    }

                      

                      return false;
                  });

            socket.on("new_msg", function(data) {
              
              if( opend_id == data.from_id && data.to_id==<%-informations.id_user%>){
                //$('#messages').append($('<li style="color:red">').text(data.msg));
                $('#messages').append('<li class="chat_friend"><span>'+data.msg+'</span></li>');
                $('.chat_box_ul').animate({scrollTop: $('.chat_box_ul').prop("scrollHeight")}, $('.chat_box_ul').height());
              }
            });
        

          });




          //when a user disconnect
          socket.on("dis",function(data){
            $('#'+data.id).remove();
            nb--;
          })


        });







        </script>