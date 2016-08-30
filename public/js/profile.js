<script type="text/javascript">

$('.flagstrap').flagStrap({
  onSelect: function (value, element) {
    value = $(element).children("option[selected=selected]").val(); //This is the correct value
  }
});


if ( document.location.href.indexOf('informations') > -1 ) {
  console.log("omar");
  $('#notaire').click(function(event) {
    event.preventDefault();
    $.ajax({
      url:'/addNotaire',
      type: 'POST',
      data:{
        user_id:<%= typeof informations!='undefined' ? informations.id_user : '' %>,
        first_name:$('#first_name').val(),
        last_name:$('#last_name').val(),
        email:$('#email').val()
      },
      dataType: 'json',
      success:function(data){
        console.log("added !");
        window.location.href = "/informations";
      }
    })
  });
};


//start pick a date
var $input = $('.datepicker').pickadate({
  monthsFull: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
  format: 'd mmmm yyyy',
  formatSubmit:'yyyy/mm/dd',
    selectMonths: true,
    max: new Date(),
    hiddenName: true,
    selectYears: 100,
    onSet:function(){
      document.getElementById('date').value=this.get();
    }
});
//end pick a date


//tagsinput
var data = <%-friends%>;
var immortals = JSON.parse('<%-immortals%>');
var amis = data;

for (var i = 0; i < immortals.length; i++) {
  var a = JSON.stringify(immortals[i]);
}

$('#tag').tagsinput({
  itemValue: 'id_friend',
  itemText: function(item) {return item.first_name+'  '+item.last_name},
  typeahead: {
    displayText: function(item) {return item},
    afterSelect: function(val) { this.$element.val("")},
    source: amis.data
  },
  freeInput: false
});

for (var i = 0; i < immortals.length; i++) {
  $('#tag').tagsinput('add', immortals[i]);
}

$('#tag').on('itemAdded', function(event) {
  $.ajax({
    url:'/addImmortal',
    type: 'POST',
    data:{
      user_id:<%-informations.id_user%>,
      immortal_id:event.item.id_friend
    },
    dataType: 'json',
    success:function(data){
      console.log("Added !");
    }
  })
});

$('#tag').on('itemRemoved', function(event) {
  $.ajax({
    url:'/deleteImmortal',
    type: 'POST',
    data:{
      user_id:<%-informations.id_user%>,
      immortal_id:event.item.id_friend
    },
    dataType: 'json',
    success:function(data){
    console.log("Removed !");
    }
  })
});
//end tagsinput

//notaire

//end notaire

//gender
if(<%-informations.sex%>==male){
  $('#male').prop("checked", true);
}
else{
  $('#female').prop("checked", true);
}
//end gender

$('#profile_link').addClass('items_active');

</script>
