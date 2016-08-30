<script type="text/javascript">


$( document ).ready(function() {

/* *************************
****** index *********
************************* */

  if (navigator.userAgent.toLowerCase().indexOf("chrome") >= 0) {
      $(window).load(function(){
          $('input:-webkit-autofill').each(function(){
              var text = $(this).val();
              var name = $(this).attr('name');
              $(this).after(this.outerHTML).remove();
              $('input[name=' + name + ']').val(text);
          });
      });
  }

  $("#continuer").click(function(event){
     $('#loading').show();
     var validator = $( "#f" ).validate({
       errorClass: "invalid"
     }
     );
     event.preventDefault();
     $.ajax({
     url:'/searchMail',
     type: 'POST',
     data:{
         email:$('#email').val()
     },
         dataType: 'json',
         success:function(data){
         var json = JSON.parse(data);
         console.log(json);
         if(json.msg=='success'){
             $('#loading').hide();
             $('#password').removeClass('hidden');
             $('#connexion').removeClass('hidden');
             $('#continuer').addClass('hidden');
         }else{
       var url = '/registration';
       var form = $('<form action="' + url + '" method="post">' +
         '<input type="text" name="mail" value="'+$('#email').val()+'" />' +
         '</form>');
       if(validator.element( "#email" )){
         form.submit();
       }
}
}
})
});
  $("#connexion").click(function(event){
     $('#loading').show();
     event.preventDefault();
     $.ajax({
     url:'/auth',
     type: 'POST',
     data:{
         email:$('#email').val(),
         password:$('#password').val()
     },
         dataType: 'json',
         success:function(data){
         var json = JSON.parse(data);
         if(json.msg=='success' && $('#password').val() != 'fb'){
             window.location.href = "/home";
         }else{
             $('#error').removeClass('hidden');
             $('#loading').hide();
         }
}
})
})

/* *************************
****** registration *********
************************* */


$( "#registration-form" ).validate({
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

/* *************************
****** profile *********
************************* */









});

</script>
