<script type="text/javascript">
var dat = moment('<%-friends_data.birthday%>').locale('fr').format("D MMMM YYYY");
if(dat != 'Invalid date'){
    $('#date').append(dat);
}
if("<%-friends_data.sex%>"=="homme"){
    $('#sexe').html("Homme");
}
else{
    $('#sexe').html('Femme');
}
<%- include countries.js %>
var text = countries["<%=informations.country%>"];
$('#country').append(text);
$('#profile_link').addClass('items_active');
</script>