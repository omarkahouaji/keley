
    $( "#f" ).validate({
        rules : {password : {minlength : 5},password_confirm : {minlength : 5,equalTo : "#password"},email : {minlength : 4}},
        submitHandler : function () {

            $.ajax({
                url:'/register',
                type: 'POST',
                data:{email:$("#email").val(),last_name:$("#last_name").val(),first_name:$("#first_name").val(),password:$("#password").val()},
                dataType: 'json',
                success:function(d){
                    var data = JSON.parse(d);
                    if(data.msg == "user exists"){
                        sweetAlert(
                            'Oops...',
                            'Utilisateur existe!',
                            'error'
                        )
                    }
                    else if(data.msg == "failure"){
                        alert("failure");
                    }
                    else if(data.msg == "success"){
                        swal({
                            title: 'Youpi !',
                            text: "Vous etes inscri",
                            type: 'success',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'Se connecter'
                            }).then(function() {
                                window.location.href = "/index";
                            })
                        //window.location.href = "/index";
                    }else{
                        alert("failure");
                    }
                }
            });   

        }
    });


