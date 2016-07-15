<script type="text/javascript">
  function get () {
    $.ajax({
      url: '/getActivity/<%-informations.id_user%>',
      type: 'GET',
      dataType: 'json',
      success: function (data) {
        var json = JSON.parse(data);
        $('.activity_content').empty();

        for (i = 0; i < json.data.length; i++) {
          var src;

          if (json.data[i].avatar == 'no_avatar') {
            src = "/images/default.svg";
          }
          else {
            src = "<%=path_avatar%>/" + json.data[i].id_user + "/" + json.data[i].avatar;
            srcR = "<%=path_avatar%>/" + json.data[i].sender_id + "/" + json.data[i].avatar;
          }

          if (json.data[i].type == '2') {
            $('.activity_content').append(
              '<div>' +
              '<a class="white_link" href="/' + json.data[i].id_user + '/events"><img src=' + src + ' alt="..."></a>' +
              '<a class="white_link" href="/' + json.data[i].id_friend + '/events"><span>' + json.data[i].first_name + ' ' + json.data[i].last_name + ' et ' + json.data[i].friend_first_name + ' ' + json.data[i].friend_last_name + ' sont devenus amis</span></a>' +
              '<i class=" icon-friends"></i>' +
              '</div>'
            )
          }

          if (json.data[i].type == '0') {
            $('.activity_content').append(
              '<div>' +
              '<a class="white_link" href="/' + json.data[i].sender_id + '/events"><img src=' + srcR + ' alt="..."></a>' +
              '<a class="white_link" href="/event/' + json.data[i].event_id + '"><span>' + json.data[i].first_name + ' ' + json.data[i].last_name + ' a aimé l\'événement de ' + json.data[i].recipient_first_name + ' ' + json.data[i].recipient_last_name + '</span></a>' +
              '<i class=" icon-heart "></i>' +
              '</div>'
            )
          }

          if (json.data[i].type == '1') {
            $('.activity_content').append(
              '<div>' +
              '<a class="white_link" href="/' + json.data[i].sender_id + '/events"><img src=' + srcR + ' alt="..."></a>' +
              '<a class="white_link" href="/event/' + json.data[i].event_id + '"><span>' + json.data[i].first_name + ' ' + json.data[i].last_name + ' a commenté l\'événement de  ' + json.data[i].recipient_first_name + ' ' + json.data[i].recipient_last_name + '</span></a>' +
              '<i class=" icon-comment "></i>' +
              '</div>'
            )
          }

          if (json.data[i].type == '4') {
            $('.activity_content').append(
              '<div>' +
              '<a class="white_link" href="/' + json.data[i].id_user + '/events"><img src=' + src + ' alt="..."></a>' +
              '<a class="white_link" href="/event/' + json.data[i].id_event + '"><span>' + json.data[i].first_name + ' ' + json.data[i].last_name + ' a ajouté un nouveau événement</span></a>' +
              '<i class=" icon-event "></i>' +
              '</div>'
            )
          }

          if (json.data[i].type == '3') {
            $('.activity_content').append(
              '<div>' +
              '<img src=' + src + ' alt="...">' +
              '<a class="white_link" href="/chart/' + json.data[i].id_chart + '"><span>' + json.data[i].first_name + ' ' + json.data[i].last_name + ' a ajouté une nouvelle courbe</span></a>' +
              '<i class=" icon-chart "></i>' +
              '</div>'
            )
          }

        }
      }
    })
  }
  // where X is your every X minutes
  get ();
  setInterval(function() {
    get()
  }, 3000);
</script>