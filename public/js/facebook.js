<script type="text/javascript">
    var current_img = '<%=informations.avatar %>' ;
    if( '<%- facebook %>' == 'new user' && current_img == 'no_avatar'){
      $(window).load(function(){
          $('#myModal').modal('show');
      });
    }

    var fb_img = '<%-fb_image%>';
    var user_status = '<%- facebook %>';
</script>