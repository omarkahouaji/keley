
//on show
$('#myModal').on('shown.bs.modal', function (e) {

        var yourparameter = e.relatedTarget.dataset.yourparameter;
        console.log("omar");
        console.log(yourparameter);


    var $uploadCrop;
    function readFile(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();          
            reader.onload = function (e) {
                $uploadCrop.croppie('bind', {
                    url: e.target.result                
                });
                $('.crop-box').addClass('ready');
            }           
            reader.readAsDataURL(input.files[0]);
        }
    }

    //console.log(user_status);

    if (user_status == 'new user'){
        //create the croppie instance
        $uploadCrop = $('#crop-box').croppie({
            viewport: {
                width: 80,
                height: 80,
                type: 'circle'
            },
            boundary: {
                width: 150,
                height: 150
            },
            enableOrientation: true,
            url:fb_img
        });
    }else{
        $uploadCrop = $('#crop-box').croppie({
            viewport: {
                width: 80,
                height: 80,
                type: 'circle'
            },
            boundary: {
                width: 150,
                height: 150
            },
            enableOrientation: true
        });
    }


    // the button which uplaod a file from the computer
    $('#upload').on('change', function () { readFile(this); });  

    //the button which does the upload
    $('.submit_upload').on('click', function (ev) {  
        $uploadCrop.croppie('result', {
            type: 'canvas',
            size: 'original'
        }).then(function (resp) {
            var a = resp.slice(resp.indexOf(',')+1);
            $('#imagebase64').val(a);
            $('#form').submit();
        });
    });

    $('#rotate').on('click',function(ev){
        $uploadCrop.croppie('rotate', 90);
    })

})

//when we close the modal, the coppie instance will be deleted from the DOM
$('#myModal').on('hidden.bs.modal', function (e) {
   $('#crop-box').croppie('destroy');
})





  






