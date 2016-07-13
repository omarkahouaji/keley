 $("#register").click(function(event){
        /*var validator = $( "#f" ).validate({
          errorClass: "invalid"
        }
        );*/
        
        event.preventDefault();
        //validator.element( "#last_name" )
          if($('#f').validate({
              rules : {
                password : {
                    minlength : 5
                },
                password_confirm : {
                    minlength : 5,
                    equalTo : "#password"
                }
              }

          })){
               event.preventDefault();               
             $.ajax({
                        url:'/register',
                        type: 'POST',
                        data:{
                          email:$("#email").val(),
                          last_name:$("#last_name").val(),
                          first_name:$("#first_name").val(),
                          password:$("#password").val()
                        },
                        dataType: 'json',
                        success:function(d){
                          var data = JSON.parse(d);
                          console.log(data);
                            if(data.msg == "user exists"){
                              alert("user exists");
                            }else if(data.msg == "failure"){
                              alert("failure");
                            }else if(data.msg == "success"){
                             window.location.href = "/index";
                            
                        }else{
                          alert("failure");
                        }
                      }
                      });





          }

  });