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
            $('#f').submit();    
          }

  });