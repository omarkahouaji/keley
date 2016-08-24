<script type="text/javascript">

var $uploadCrop;
if ('<%-informations.image_facebook%>' != 'empty' && '<%=informations.avatar %>' == 'no_avatar') {
    //create the croppie instance
    $uploadCrop = $('#crop-box').croppie({
        viewport: {
            width: 150,
            height: 150,
            type: 'circle'
        },
        boundary: {
            width: 400,
            height: 400
        },
        enableOrientation: true,
        url: '<%-informations.image_facebook%>'
    });
} else {
    $uploadCrop = $('#crop-box').croppie({
        viewport: {
            width: 150,
            height: 150,
            type: 'circle'
        },
        boundary: {
            width: 400,
            height: 400
        },
        enableOrientation: true,
        enforceBoundary:false
    });
}



function readFile(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var image = new Image();
            image.src = e.target.result;
            $uploadCrop.croppie('bind', {
                url: e.target.result
            });
            image.onload = function() {
                console.log(this.width);
            };
            $('.crop-box').addClass('ready');
        }
        reader.readAsDataURL(input.files[0]);
    }
}


$('.edit-upload-btn').on('change', function() {
    readFile(this);
    $('#myModal').modal('show');
});



    //on show
    $('#myModal').on('shown.bs.modal', function(e) {
        is_opend = false;
        //var yourparameter = e.relatedTarget.dataset.yourparameter;



        // the button which uplaod a file from the computer
        /*
        $('#upload').on('change', function() {
            readFile(this);
            file_exists = true;
        });*/

        //the button which does the upload
        $('.submit_upload').on('click', function(ev) {
            $uploadCrop.croppie('result', {
                type: 'canvas',
                size: 'original'
            }).then(function(resp) {
                var a = resp.slice(resp.indexOf(',') + 1);
                $('#imagebase64').val(a);
                $('#form').submit();
            });
        });

        $('#rotate').on('click', function(ev) {
            $uploadCrop.croppie('rotate', 90);
        })

    })

    //when we close the modal, the coppie instance will be deleted from the DOM
    
    $('#myModal').on('hidden.bs.modal', function(e) {
        //$('#crop-box').croppie('destroy');
        $('.edit-upload-btn').val('');
    })
</script>