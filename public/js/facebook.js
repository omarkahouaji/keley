<script type="text/javascript">
    var current_img = '<%=informations.avatar %>' ;
if('<%-informations.image_facebook%>' != 'empty' && '<%-informations.image_facebook%>' != 'undefined' && current_img == 'no_avatar'){
	      $(window).load(function(){
          $('#myModal').modal('show');
      });
}
</script>

