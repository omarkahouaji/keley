<script>

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
                //$('#continuer').html('connexion');
            }else{   
          var url = '/registration';
          var form = $('<form action="' + url + '" method="post">' +
            '<input type="text" name="mail" value="'+$('#email').val()+'" />' +
            '</form>');
          //$('body').append(form);
          
          if(validator.element( "#email" )){
            form.submit();    
          }
}
}
})  
  });
//connexion
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
     //end connexion



</script>