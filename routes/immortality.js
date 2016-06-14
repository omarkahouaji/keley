request = require('request');
//var Q = require('q');
var moment = require('moment'); //
var fs = require('fs');
//var base_url = 'http://immortality-lif-api.azurewebsites.net/Immortality-api/index.php/';
//var upload_path = 'http://immortality-lif-api.azurewebsites.net/Immortality-api/application/uploads/avatars';
var base_url = 'http://localhost:85/api.immortality.life/index.php/';
var upload_path = '/Applications/MAMP/htdocs/api.immortality.life/application/uploads/';
moment.locale('fr');
var atob = require('atob');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://omar.kahouaji%40esprit.tn:esprit123@smtp.gmail.com');
var lwip = require('lwip');

//moment().format();

//premiere lettre capitale
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function friendship(id1,id2){
    console.log(id1,id2);
    request({url: base_url+'users/isFriend/'+parseInt(id1)+'/'+parseInt(id2),method: 'GET'},
    function(error, response, body2) {
        var json2 = JSON.parse(body2);
        var isFriend = json2.isFriend;
        //console.log(isFriend);
        //var notif = json2.notif;
    return isFriend;
});
}


function updateUserInfo(req, res, stored) {
    if(req.session.data.id_user==undefined){
        res.redirect('index');
    }
    else{


    request({
        url: base_url+'users/one/'+parseInt(req.session.data.id_user),
        method: 'GET'
    },
    function(error, response, body) {
        var json = JSON.parse(body);
        request({
            url: base_url+'notifications/unread_count/'+parseInt(req.session.data.id_user),
            method: 'GET'
        },
        function(error, response, body2) {

        request({
            url: base_url + '/users/percent/'+parseInt(req.session.data.id_user),
            method: 'GET',
        },
        function(error, response, percent) {
            var json2 = JSON.parse(body2);
            var nb = json2.count;
            var percent = JSON.parse(percent);
            if (json.msg == 'success') {
                if(json.data[0].birthday != null){
                     var birth = new Date(json.data[0].birthday);
                    json.data[0].age = parseInt(moment(birth).fromNow(true));                   
                }
                else{
                    json.data[0].age = '';
                }


                json.data[0].nbNotifs = nb;
                json.data[0].percent = percent.percent;
                req.session.data = json.data[0];
            }

             return stored(json);

        });






            })
    });
     }
}



//fonction recherche
exports.recherche = function(req, res) {
    var stored = function(retour) {
        request({
            url: base_url + 'search/search',
            method: 'POST',
            form: {
                id_user: parseInt(req.session.data.id_user),
                term: req.query.q
            }
        },
        function(error, response, body) {
            request({
                url:base_url+'users/activity/'+ parseInt(req.session.data.id_user),
                method: 'GET'
            },
            function(error,response,activity_body){
                var json = JSON.parse(body);
                var activity = JSON.parse(activity_body);
                res.render('search',{informations:retour.data[0],data:json.data,term:req.query.q,activity:activity.data});
            });   
        });
    }
    updateUserInfo(req, res, stored);
}



exports.informations = function(req, res) {
    var stored = function(retour) {
        request({
            url: base_url+'users/followersNbCharts/'+parseInt(req.session.data.id_user)+'/0',
            method: 'GET'
        },
        function(error, response, friends) {
            request({url:base_url+'users/getImmortals/'+parseInt(req.session.data.id_user)+'/0',method: 'GET'},
            function(error,response,body){
                request({url:base_url+'users/has_notaire/'+parseInt(req.session.data.id_user),method: 'GET'},
                function(error,response,body_notaire){
                    var json_notaire = JSON.parse(body_notaire);
                    var json = JSON.parse(body);
                    res.render('informations', {notaire:json_notaire,informations: retour.data[0],pageTitle: 'Informations',friends:friends,immortals:JSON.stringify(json.data)});
                });
            })

        });

    }
    updateUserInfo(req, res, stored);
}



exports.informationsFriend = function(req, res) {
        var stored = function(retour) {
               request({
                url: base_url+'users/isFriend/'+parseInt(req.session.data.id_user)+'/'+parseInt(req.params.id),
                method: 'GET'
            },
                function(error, response, body2) {
                            var json2 = JSON.parse(body2);
                            var isFriend = json2.isFriend;
                            var notif = json2.notif;
                            
                            
                                request({
                                    url: base_url+'users/one/'+parseInt(req.params.id),
                                    method: 'GET'
                                },
                                function(error, response, body) {
                                    var json = JSON.parse(body);
                                    var birth = new Date(json.data[0].birthday);
                                    json.data[0].age = parseInt(moment(birth).fromNow(true));
                                    if(isFriend==true)
                                    {
                                        res.render('informationsFriend',{informations:retour.data[0],friends_data:json.data[0]})
                                    }
                                    else
                                    {
                                    res.render('notFriend',{informations:retour.data[0],friends_data:json.data[0],notif:notif});
                                    }
                                });
  
                            });
                            }
                            updateUserInfo(req, res, stored);
}



exports.landingPage=function(req,res){
    res.render('landing_page');
}




exports.postComment=function(req,res){
        request({
            url: base_url + 'comments/create',
            method: 'POST',
            form: {
                event_id: req.body.event_id,
                event_user_id: req.body.event_user_id,
                user_id:parseInt(req.session.data.id_user),
                content:req.body.content
            }
        },
        function(error, response, body) {
                res.json(body);
        });
}

exports.postLike=function(req,res){
        request({
            url: base_url + 'likes/create',
            method: 'POST',
            form: {
                event_id: req.body.event_id,
                event_user_id: req.body.event_user_id,
                user_id:parseInt(req.session.data.id_user),
            }
        },
        function(error, response, body) {
                res.json(body);
        });  
}

exports.notifications = function(req,res){
    var stored = function(retour) {

            request({
                url:base_url+'users/activity/'+ parseInt(req.session.data.id_user),
                method: 'GET'
            },
            function(error,response,activity_body){
                var activity = JSON.parse(activity_body);
                    res.render('notifications',{informations:retour.data[0],notif_badge:false,activity:activity.data});
            });   

        }
    updateUserInfo(req, res, stored);
}


//fonction commentaires
exports.getComments = function(req, res) {
    request({
        url: base_url + 'comments/all/' + parseInt(req.params.id),
        method: 'GET'
    },
    function(error, response, body) {
        var json = JSON.parse(body);
        res.json(json);
    }
    );
}

exports.getCharts = function(req, res) {
    request({
        url: base_url + 'search/search_chart',
        method: 'POST',
            form: {
                id_user: req.body.id_user,
                term: req.body.term,
                limit:req.body.limit,
                offset:req.body.offset
            }
    },
    function(error, response, body) {
        var json = JSON.parse(body);
        res.json(json);
    }
    );
}
//search evenements
exports.getEvents = function(req, res) {
    request({
        url: base_url + 'search/search_event',
        method: 'POST',
            form: {
                id_user: req.body.id_user,
                term: req.body.term,
                limit:req.body.limit,
                offset:req.body.offset
            }
    },
    function(error, response, body) {
        var json = JSON.parse(body);
        res.json(json);
    }
    );
}

//search utilisateurs
exports.searchUsers = function(req, res) {
    request({
        url: base_url + 'search/search_friend',
        method: 'POST',
            form: {
                id: req.body.id_user,
                term: req.body.term,
                limit:req.body.limit,
                offset:req.body.offset
            }
    },
    function(error, response, body) {
        var json = JSON.parse(body);
        res.json(json);
    }
    );
}


//supprimer evenement
exports.deleteEvent=function(req,res){
    request({
        url: base_url + 'events/delete/'+ parseInt(req.params.id),
        method: 'DELETE',
    },
    function(error, response, body) {
        var json = JSON.parse(body);
        res.json(json);
    }
    );
}

//supprimer courbe
exports.deleteChart=function(req,res){
    request({
        url: base_url + 'charts/delete/'+ parseInt(req.params.id),
        method: 'DELETE',
    },
    function(error, response, body) {
        var json = JSON.parse(body);
        res.json(json);
    }
    );
}

//immortals
exports.deleteImmortal=function(req,res){
    request({
        url: base_url + 'users/deleteImmortal/'+ parseInt(req.body.user_id)+'/'+parseInt(req.body.immortal_id),
        method: 'DELETE',
    },
    function(error, response, body) {
        var json = JSON.parse(body);
        res.json(json);
    }
    );
}

exports.deleteImage=function(req,res){
    request({
        url: base_url + 'uploads/delete/'+parseInt(req.body.upload_id)+'/'+parseInt(req.session.data.id_user)+'/'+parseInt(req.body.event_id),
        method: 'DELETE',
    },
    function(error, response, body) {
        var json = JSON.parse(body);
        res.json(json);
    }
    );
}

exports.addImmortal=function(req,res){
    request({
        url: base_url + 'users/immortal',
        method: 'POST',
                form: {
            user_id: req.body.user_id,
            immortal_id: req.body.immortal_id
        }
    },
    function(error, response, body) {
        var json = JSON.parse(body);
        res.json(json);
    }
    );
}

exports.addNotaire=function(req,res){
    request({
        url: base_url + 'users/addNotaire',
        method: 'POST',
        form: {
            user_id: req.body.user_id,
            first_name: req.body.first_name,
            last_name : req.body.last_name,
            email : req.body.email
        }
    },
    function(error, response, body) {
        var mailOptions = {
    from: '"Immortality 👥" <kahouajiomar@gmail.com>', // sender address 
    to: req.body.email, // list of receivers 
    subject: 'Hello ✔', // Subject line 
    text: 'Bonjour '+req.body.first_name+' '+req.body.last_name+', Vous etes invité à contacter l\'équipe de immortality. Cordialement, ', // plaintext body 
    //html: '<b>Hello world </b>' // html body 
};
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });
        var json = JSON.parse(body);
        res.json(json);
    }
    );
}


exports.getImmortals=function(req,res){
    request({
        url:base_url+'users/getImmortals/'+ parseInt(req.params.user_id),
        method: 'GET'
    },
    function(error,response,body){
        var json = JSON.parse(body);
        res.json(json);
    }
    )
}

//fonction pour avoir les notifications 
exports.getNotifications=function(req,res){
    request({
        url:base_url+'notifications/all/'+ parseInt(req.params.id) + '/' + parseInt(req.params.nb),
        method: 'GET'
    },
    function(error,response,body){
        var json = JSON.parse(body);
        res.json(json);
    }
    )
}

//getActivity
exports.getActivity=function(req,res){
    request({
        url:base_url+'users/activity/'+ parseInt(req.params.id),
        method: 'GET'
    },
    function(error,response,body){
        console.log(body);
        res.json(body);
    }
    )
}

exports.logout = function(req, res) {
    req.session.data={};
    res.redirect('index');
}


//fonction upload avatar //empty body !!!!
exports.uploadAvatar = function(req, res) {
            


        var r = "'"+req.body.imagebase64+"'";


          a = new Buffer(r, 'base64');
          var milliseconds = (new Date).getTime();


            var stored = function(retour) {
                require("fs").writeFile(milliseconds+"a.png", a, function(err) {
                  request({
                    url: base_url + 'uploads/add_avatar',
                    method: 'POST',
                    formData: {
                        file: fs.createReadStream(milliseconds+"a.png"),
                        user_id: parseInt(req.session.data.id_user)
                    }
                },
                function(error, response, body) {
                    fs.unlinkSync(milliseconds+"a.png");
                    res.redirect('informations');
                });
        });




            }
            updateUserInfo(req, res, stored);
};


//fonction inscription 
exports.register = function(req, res) {
    request({
        url: base_url+'users/register',
        method: 'POST',
        form: {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: req.body.password
        }
    },
    function(error, response, body) {
            res.redirect('index');//normalement il faut diriger l'utlisateur vers la page d'accueil ( et auto auth)
        }
        );
}


//fonction recherche mail
exports.searchMail = function(req, res) {
    request({
        url: base_url + 'users/search_mail',
        method: 'POST',
        form: {
            email: req.body.email,
        }
    },
    function(error, response, body) {
        res.json(body);
    });
};


//page mes amis
exports.friends = function(req, res) {
    var stored = function(retour) {
        res.render('friends', {
            informations: retour.data[0],friend:false,friends_data:""
        });
    }
    updateUserInfo(req, res, stored);
}


exports.friendsFriend = function(req, res) {
      var stored = function(retour) {
    request({
        url: base_url+'users/one/'+parseInt(req.params.id),
        method: 'GET'
    },
    function(error, response, body) {

        var json = JSON.parse(body);
        if (json.msg == 'success') {
            var birth = new Date(json.data[0].birthday);
            json.data[0].age = parseInt(moment(birth).fromNow(true));
            //json.data[0].nbNotifs=retour.data[0].nbNotifs;
        }
            res.render('friends', {
            informations: retour.data[0],friend:true,friends_data:json.data[0]
        });
    });
    }
updateUserInfo(req, res, stored);
}

exports.sendFriendRequest = function(req,res){
        request({
            url: base_url + 'users/sendFriendRequest',
            method: 'POST',
            form: {
                sender_id: req.body.sender_id,
                recipient_id: req.body.recipient_id
            }
        },
        function(error, response, body) {
                res.json(body);
        });   
}

exports.addFriend=function(req,res){
        request({
            url: base_url + 'users/addFriend',
            method: 'POST',
            form: {
                id: req.body.id,
                user_id: req.body.user_id,
            }
        },
        function(error, response, body) {
                res.json(body);
        });     
}

exports.deleteFriend=function(req,res){
        request({
            url: base_url + 'users/deleteFriend',
            method: 'POST',
            form: {
                id: req.body.id,
                user_id: req.body.user_id,
            }
        },
        function(error, response, body) {
                res.json(body);
        });     
}





//fonction amis
exports.getFriends=function(req,res){
    request({
        url: base_url+'users/followersNbCharts/' + parseInt(req.params.id) + '/' + parseInt(req.params.nb),
        method: 'GET'
    },
    function(error, response, body) {
        var json = JSON.parse(body);
        res.json(json);
    });
}



//fonction modifier informations  
exports.editProfile = function(req, res) {
    var country = req.body.country;
    if(typeof(req.body.country)==='object'){

    var countries = req.body.country;
    country = countries[1];
        }
    var stored = function(retour) {
    request({
        url: base_url+'users/update',
        method: 'POST',
        form: {
            first_name: capitalizeFirstLetter(req.body.first_name),
            last_name: capitalizeFirstLetter(req.body.last_name),
            user_id: req.session.data.id_user,
            email: req.body.email,
            password: req.session.data.password,
            phone: req.body.phone,
            address: req.body.address,
            birthday: req.body.date,
            sex: req.body.sexe,
            country: country
        }
    },
    function(error, response, body) {
        var json = JSON.parse(body);
            json.data.age = parseInt(moment(req.body.date).fromNow(true));//ajouter age au json
            req.session.data = json.data;//remplir la session avec le fichier json
            //res.render('informations', {informations: json.data});
            res.redirect('informations');
        });
    }
    updateUserInfo(req, res, stored);
}

//page accueil
exports.home = function(req, res) {
    var stored = function(retour) {
        request({
            url:base_url+'users/activity/'+ parseInt(req.session.data.id_user),
            method: 'GET'
        },
        function(error,response,body){
            console.log("aaaa");
            var json = JSON.parse(body);
            res.render('home', {informations: retour.data[0],activity:json.data});
        });
    }
    updateUserInfo(req, res, stored);
}

//page mes evenements
exports.events = function(req, res) { 
    var stored = function(retour) {
        res.render('events', { informations: retour.data[0]});
    }
    updateUserInfo(req, res, stored);
}


exports.eventsFriend = function(req, res) {
    var stored = function(retour) {

   // if(friendship(parseInt(req.session.data.id_user),parseInt(req.params.id))==true)
//{

    request({
        url: base_url+'users/one/'+parseInt(req.params.id),
        method: 'GET'
    },
    function(error, response, body) {

        var json = JSON.parse(body);
        if (json.msg == 'success') {
            var birth = new Date(json.data[0].birthday);
            json.data[0].age = parseInt(moment(birth).fromNow(true));
        }
            res.render('eventsFriend', {
            friends_data: json.data[0],
            informations:retour.data[0],
            me:req.session.data
        });
    });
    /*}
        else{
        res.redirect('home');
    }*/
    }

updateUserInfo(req, res, stored);
}

//page evenement
exports.event=function(req,res){
 var stored = function (retour) {
        request({
                url: base_url + 'events/one/' + parseInt(req.params.id),
                method: 'GET'
            },
            function (error, response, body) {
                var json = JSON.parse(body);
                var uploadsFinal = [];


                for (var j = 0; j < json.data[0].uploads.length; j++) {
                    var path = upload_path + parseInt(json.data[0].uploads[j].event_user_id) + '/' + parseInt(json.data[0].uploads[j].event_id) + '/' + json.data[0].uploads[j].file;

                    if (fs.existsSync(path)) {
                        uploadsFinal.push(json.data[0].uploads[j]);
                    }
                }

                json.data[0].uploads = [];
                json.data[0].uploads = uploadsFinal;
                uploadsFinal = [];


                res.render('event.ejs', {
                    event: JSON.stringify(json.data[0]),
                    informations: retour.data[0]
                })
            });
    }
    updateUserInfo(req, res, stored);
}


exports.editChart = function(req,res){
    var stored = function (retour) {
        request({url: base_url+'charts/has_chart/' + parseInt(req.session.data.id_user)+'/'+parseInt(req.params.id),method: 'GET'},
        function(err,response,msg){
            var has_chart = JSON.parse(msg);
            console.log(has_chart);
            if(has_chart == false){
                res.redirect('/charts');
            }else{
                request({url: base_url + 'charts/one/' + parseInt(req.params.id),method: 'GET'},
                function (error, response, body) {
                    var json = JSON.parse(body);
                    res.render('edit-chart', {chart: json.data[0],informations: retour.data[0]})
                });
            }
        });
    }
    updateUserInfo(req, res, stored); 
}





exports.editEvent=function(req,res){
    var stored = function (retour) {
        request({url: base_url+'events/hasEvent/' + parseInt(req.session.data.id_user)+'/'+parseInt(req.params.id),method: 'GET'},
        function (error, response, hasEvent_body) {
            var test = JSON.parse(hasEvent_body);
            var hasEvent = test.hasEvent;
            if(hasEvent==false){
                res.redirect('/events');
            }
            else{       
                request({url: base_url + 'events/one/' + parseInt(req.params.id),method: 'GET'},
                function (error, response, body) {
                    var json = JSON.parse(body);
                    var uploadsFinal = [];
                    request({url: base_url+'charts/all/' + parseInt(req.session.data.id_user),method: 'GET'},
                    function(error, response, charts_body) {
                        var charts_json = JSON.parse(charts_body);
                        var tab = [];
                        var iconTab = [];
                        for (var i = 0; i < charts_json.data.length; i++) {
                            if (charts_json.data[i].chart_privacy_types_id_privacy == 0) {
                                iconTab.push("icon-private")
                            } else if (charts_json.data[i].chart_privacy_types_id_privacy == 1) {
                                iconTab.push("icon-friends")
                            } else {
                                iconTab.push("icon-public")
                            }
                            tab.push(charts_json.data[i]);
                        }
                        for (var j = 0; j < json.data[0].uploads.length; j++) {
                            var path = upload_path + parseInt(json.data[0].uploads[j].event_user_id) + '/' + parseInt(json.data[0].uploads[j].event_id) + '/' + json.data[0].uploads[j].file;
                            if (fs.existsSync(path)) {
                                uploadsFinal.push(json.data[0].uploads[j]);
                            }
                        }
                        json.data[0].uploads = [];
                        json.data[0].uploads = uploadsFinal;
                        uploadsFinal = [];
                        res.render('edit-event', {event: json.data[0],informations: retour.data[0],type: "1", charts: tab,iconTab: iconTab})
                    });
                });
            }
        });
    }
    updateUserInfo(req, res, stored);
}


//fonction evenements
exports.eventsAngular = function(req, res) {
    request({
        url: base_url+'events/all_final/' + parseInt(req.params.id) +'/' + parseInt(req.session.data.id_user)+ '/' + parseInt(req.params.nb),
        method: 'GET'
    },
    function(error, response, body) {
       
        var json = JSON.parse(body);
        var uploadsFinal = [];
        for (var i = 0; i < json.data.length; i++) {
            for (var j = 0; j < json.data[i].uploads.length; j++) {
                var path = upload_path + parseInt(json.data[i].uploads[j].event_user_id) + '/' + parseInt(json.data[i].uploads[j].event_id) + '/' + json.data[i].uploads[j].file;
                if (fs.existsSync(path)) {
                    uploadsFinal.push(json.data[i].uploads[j]);
                }

            }
                json.data[i].uploads = [];
                json.data[i].uploads = uploadsFinal;
                uploadsFinal = [];
            }
            res.json(json);
        });
}



exports.events_timeline = function(req, res) {
    request({
        url: base_url+'users/get_timeline',
        method: 'POST',
        form:{ 
            id:parseInt(req.params.id),
            limit:10,
            offset:parseInt(req.params.nb),
            id_connected:parseInt(req.session.data.id_user)
        }
    },
    function(error, response, body) {
        var json = JSON.parse(body);
        var uploadsFinal = [];

            var courbes = {},data = [];
            var y = [],x = [],title = [],id_event=[];
            courbes.data = [];
            for (var i = 0; i < json.data.length; i++) {
                data.push = {};
            }
            yData = [], xData = [], name = [],id=[];


        for (var i = 0; i < json.data.length; i++) {
            //console.log(json.data[i].type);
            if(json.data[i].type=="1"){
            for (var j = 0; j < json.data[i].uploads.length; j++) {
                var path = upload_path + parseInt(json.data[i].uploads[j].event_user_id) + '/' + parseInt(json.data[i].uploads[j].event_id) + '/' + json.data[i].uploads[j].file;
                if (fs.existsSync(path)) {
                    uploadsFinal.push(json.data[i].uploads[j]);
                }

            }
                json.data[i].uploads = [];
                json.data[i].uploads = uploadsFinal;
                uploadsFinal = [];
            }


            else {


                
                if(json.data[i].events!=null){
                var t = [];
                for (var k = 0; k < json.data[i].events.length; k++) {

                    t.push(json.data[i].events[k]);
                }
                t.sort(function(x, y) {
                    return Date.parse(x.creation_date) - Date.parse(y.creation_date);
                })
                for (var j = 0; j < json.data[i].events.length; j++) {
                    y.push(parseInt(t[j].note));
                    x.push((moment(t[j].creation_date).format("D MMMM")));
                    title.push(t[j].title);
                    id_event.push(t[j].id_event);
                }
                var ress = {};
                ress.yData = y, ress.xData = x,
                ress.creation_date=moment(json.data[i].creation_date).format("D MMMM YYYY"),
                ress.name = title,
                ress.id=id_event;
                ress.chartName = json.data[i].title,
                ress.id_chart=json.data[i].id_chart;
                    //console.log(json.data[i].id_chart);
                    courbes.data.push(ress);
                    y = [];
                    x = [];
                    title = [];
                    id_event=[];
                }

            }

            












            }
            console.log(courbes);
            json.charts = JSON.stringify(courbes);
             //console.log(json);
             //JSON.stringify(courbes)
            res.json(json);
        });
}




//fonction authentification
exports.auth = function(req, res) {
    request({
        url: base_url+'users/auth_user',
        method: 'POST',
        form: {
            email: req.body.email,
            password: req.body.password
        }
    },
    function(error, response, body) {

        var json = JSON.parse(body);
        if (json.msg == 'success') {
            var birth = new Date(json.data.birthday);
            json.data.age = parseInt(moment(birth).fromNow(true));
            req.session.data = json.data
        }
        res.json(body);

            //idUser:json.data.id_user
        });
}

//page connexion
exports.index = function(req, res) {
    res.render('index', {
        pageTitle: 'Connexion'
    });
};

//page mes courbes
exports.charts = function(req, res) {
    var stored = function(retour) {
    request({
        url: base_url + 'charts/all/' + parseInt(req.session.data.id_user),
        method: 'GET'
    },
    function(error, response, body) {
        var json = JSON.parse(body);
        console.log(json);
        if (!error && response.statusCode == 200) {
            var courbes = {},data = [];
            var y = [],x = [],title = [],id_event=[];
            courbes.data = [];
            for (var i = 0; i < json.data.length; i++) {
                data.push = {};
            }
            yData = [], xData = [], name = [],id=[];
            for (var i = 0; i < json.data.length; i++) {
                
                if(json.data[i].events!=null){
                    var t = [];
                for (var k = 0; k < json.data[i].events.length; k++) {

                    t.push(json.data[i].events[k]);
                }
                t.sort(function(x, y) {
                    return Date.parse(x.creation_date) - Date.parse(y.creation_date);
                })
                for (var j = 0; j < json.data[i].events.length; j++) {
                    y.push(parseInt(t[j].note));
                    x.push((moment(t[j].creation_date).format("D MMMM")));
                    title.push(t[j].title);
                    id_event.push(t[j].id_event);
                }
                var ress = {};
                ress.yData = y, ress.xData = x,
                ress.creation_date=moment(json.data[i].creation_date).format("D MMMM YYYY"),
                ress.name = title,
                ress.id=id_event;
                ress.chartName = json.data[i].title,
                ress.id_chart=json.data[i].id_chart;
                    //console.log(json.data[i].id_chart);
                    courbes.data.push(ress);
                    y = [];
                    x = [];
                    title = [];
                    id_event=[];
                }
                }
                res.render('charts', {charts: JSON.stringify(courbes),informations: retour.data[0],pageTitle: 'Mes courbes'});
            }
        });
    }
    updateUserInfo(req, res, stored);
};

//charts friend
exports.chartsFriend = function(req, res) {
    var stored = function(retour) {
        //request utilisateur
        request({url: base_url+'users/one/'+parseInt(req.params.id),method: 'GET'},
        function(error, response, fdatab) {
            var fdata = JSON.parse(fdatab);
            //console.log(fdata);
            if (fdata.msg == 'success') {
                var birth = new Date(fdata.data[0].birthday);
                fdata.data[0].age = parseInt(moment(birth).fromNow(true));
            }
            //request courbe
            request({url: base_url + 'charts/all/' + parseInt(req.params.id),method: 'GET'},
            function(error, response, body) {
                var json = JSON.parse(body);
                //console.log(json);
                var courbes = {};
                var data = [];
                var y = [];
                var x = [];
                var title = [];
                var id_event=[];
                courbes.data = [];
                for (var i = 0; i < json.data.length; i++) {
                    data.push = {};
                }
                yData = [];
                xData = [];
                name = [];
                id=[];
                for (var i = 0; i < json.data.length; i++) {
                    if(json.data[i].events!=null){
                        var t = [];
                        for (var k = 0; k < json.data[i].events.length; k++) {
                            t.push(json.data[i].events[k]);
                        }
                        t.sort(function(x, y) {
                            return Date.parse(x.creation_date) - Date.parse(y.creation_date);
                        })
                        for (var j = 0; j < json.data[i].events.length; j++) {
                            y.push(parseInt(t[j].note));
                            x.push((moment(t[j].creation_date).format("D MMMM")));
                            title.push(t[j].title);
                            id_event.push(t[j].id_event);
                        }
                        var ress = {};
                        ress.yData = y,
                        ress.xData = x,
                        ress.creation_date=moment(json.data[i].creation_date).format("D MMMM YYYY"),
                        ress.name = title,
                        ress.id=id_event;
                        ress.chartName = json.data[i].title,
                        ress.id_chart=json.data[i].id_chart;
                        ress.privacy=json.data[i].chart_privacy_types_id_privacy;
                        //console.log(json.data[i].id_chart);
                        courbes.data.push(ress);
                        y = [];
                        x = [];
                        title = [];
                        id_event=[];
                    }
                }
                res.render('chartsFriend', {charts: JSON.stringify(courbes),informations: retour.data[0],
                    friends_data: fdata.data[0]
                    //,me:req.session.data
                });
        });
        });
    }
    updateUserInfo(req, res, stored);
};

/*
    app.get('/auth/facebook', passport.authenticate('facebook'));

    app.get('/auth/facebook/callback', 
      passport.authenticate('facebook', { successRedirect: '/informations',
                                          failureRedirect: '/index' }));
*/


//page recherche
exports.search = function(req, res) {
    var stored = function(retour) {
        request({
            url:base_url+'users/activity/'+ parseInt(req.session.data.id_user),
            method: 'GET'
        },
        function(error,response,body){
            var json = JSON.parse(body);
            res.render('search', {informations: retour.data[0],pageTitle: 'Recherche',activity:json.data});
        });

        
    }
    updateUserInfo(req, res, stored);
};

//page courbe
exports.chart = function(req, res) {
    var stored = function(retour) {
        request({
            url: base_url + 'charts/one/' + req.params.id,
            method: 'GET'
        },
        function(error, response, body) {
            var json = JSON.parse(body);
            if (!error && response.statusCode == 200) {
                var tab = [];
                var xItems = [];
                for (var i = 0; i < json.data[0].events.length; i++) {
                    tab.push(json.data[0].events[i]);
                }
                tab.sort(function(x, y) {
                    return Date.parse(x.creation_date) - Date.parse(y.creation_date);
                })
                for (var i = 0; i < tab.length; i++) {
                    xItems.push((moment(tab[i].creation_date).format("D MMMM")));
                }
                res.render('chart', {
                    informations: retour.data[0],
                    data:json.data[0],
                    json: JSON.stringify(tab),
                    xItems: JSON.stringify(xItems),
                    pageTitle: 'Courbe'
                });
            }
        });
    }
    updateUserInfo(req, res, stored);
};


//page créer une courbe
exports.createChart = function(req, res) {
    var stored = function(retour) {
        res.render('create-chart', {
            informations: retour.data[0],
            msgWarning:false,
            pageTitle: 'Créer une courbe'
        });
    }
    updateUserInfo(req, res, stored);
}

//fonction ajouter courbe
exports.addChart = function(req, res) {
   var stored = function(retour) {
    console.log(retour);
    request({
        url: base_url + 'charts/create',
        method: 'POST',
        form: {
            title: capitalizeFirstLetter(req.body.title),
            description: req.body.description,
            user_id: parseInt(req.session.data.id_user),
                category_id: 0, //???
                chart_privacy_types_id_privacy: req.body.chart_privacy
            }
        },
        function(error, response, body) {
            var json = JSON.parse(body);


            if (json.data[0].chart_privacy_types_id_privacy == '0') {
                json.data[0].iconTab = "icon-private";
            } else if (json.data[0].chart_privacy_types_id_privacy == '1') {
                json.data[0].iconTab = "icon-friends";
            } else {
                json.data[0].iconTab = "icon-public";
            }
            console.log(json.data[0]);
            res.render('create-event', {
                type: "0",
                chart: json.data[0],
                informations: retour.data[0],
                pageTitle: 'Créer un événement'
            });
        }
        );
    }
    updateUserInfo(req, res, stored);
}

//page créer evenement
exports.createEvent = function(req, res) {
    var stored = function(retour) {
        console.log(retour);
        request({
            url: base_url+'charts/all/' + parseInt(req.session.data.id_user),
            method: 'GET'
        },
        function(error, response, body) {
            var json = JSON.parse(body);
            if(json.msg=='failure'){
                res.render('create-chart',{pageTitle: 'Créer une courbe',informations:retour.data[0],msgWarning:true});
            }else{
                var tab = [];
                var iconTab = [];
                for (var i = 0; i < json.data.length; i++) {
                    if (json.data[i].chart_privacy_types_id_privacy == 0) {
                        iconTab.push("icon-private")
                    } else if (json.data[i].chart_privacy_types_id_privacy == 1) {
                        iconTab.push("icon-friends")
                    } else {
                        iconTab.push("icon-public")
                    }
                    tab.push(json.data[i]);
                }
                var dataSession = req.session.data;
                res.render('create-event', {
                    informations: retour.data[0],
                    data: dataSession,
                    charts: tab,
                    iconTab: iconTab,
                    pageTitle: 'Créer un événement',
                    type: "1"
                });
            }
        });
    }
    updateUserInfo(req, res, stored);
}

//page inscription
exports.registration = function(req, res) {
    res.render('registration', {
        mail: req.body.mail,
        pageTitle: 'Inscription'
    });
}



exports.updateChart = function(req,res){
    console.log(req.body.id_chart);
    request({
        url: base_url+'charts/update/'+parseInt(req.body.id_chart),
        method: 'POST',
        form: {
            title: req.body.title,
            description: req.body.description,
            category_id:'0',
            chart_privacy_types_id_privacy:req.body.privacy
        }
    },
    function(error, response, body) {
        console.log(body);
        res.redirect('/charts');
    }); 
}




exports.updateEvent = function(req,res){
    request({
        url: base_url+'events/update/'+parseInt(req.body.id_event),
        method: 'POST',
        form: {
            title: req.body.title,
            user_id: parseInt(req.session.data.id_user),
            description: req.body.description,
            chart_id:req.body.courbe,
            //creation_date: req.body.date,
            start_date: req.body.date,
            end_date: req.body.date,
            note: req.body.note,
            chart_category_id: 0
        }
    },
    function(error, response, body) {
        var json = JSON.parse(body);
        var type = typeof(req.files.file.originalFilename);
        var size = req.files.file.size;

        if (type != 'undefined' && size !=0 ) {
            var src = req.files.file.path;

            lwip.open(src, function(err, image){
                    image.cover(150, 150, function(err,image){
                        image.writeFile('small_'+req.files.file.originalFilename,function(err){
                            console.log("resized");
                        })
                    })
            })

            lwip.open(src, function(err, image){
                image.contain(1024, 768, {r: 0, g: 0, b: 0, a: 0}, "linear", function(err,image){
                    image.writeFile(req.files.file.originalFilename,function(err){
                        console.log("done");
                        request({
                            url: base_url+'uploads/postImages',
                            method: 'POST',
                            formData: {
                                //file_big: fs.createReadStream(req.files.file.originalFilename),
                                file_big: fs.createReadStream(req.files.file.originalFilename),
                                file_small: fs.createReadStream('small_'+req.files.file.originalFilename),
                                event_id: parseInt(req.body.id_event),
                                event_user_id: parseInt(req.session.data.id_user),
                            }
                        },
                        function(error, response, body) {
                                    console.log('ok');
                                    fs.unlinkSync(req.files.file.originalFilename);
                                    fs.unlinkSync('small_'+req.files.file.originalFilename);
                        });
                    })
                })
            });
    }
//end single
else {


//multiple
        var srcPath=[];
        for(var i=0;i<req.files.file.length;i++){
         srcPath[i] = req.files.file[i].path;
    }
        function upload(i){
            if( i < srcPath.length ) {


    lwip.open(srcPath[i], function(err, image){
            image.cover(150, 150, function(err,image){
                image.writeFile('small_'+req.files.file[i].originalFilename,function(err){
                    console.log("resized");
                })
            })
    })

        lwip.open(srcPath[i], function(err, image){
        image.contain(1024, 768, {r: 0, g: 0, b: 0, a: 0}, "linear", function(err,image){
            image.writeFile(req.files.file[i].originalFilename,function(err){
                console.log("done");
                request({
                    url: base_url+'uploads/postImages',
                    method: 'POST',
                    formData: {
                        //file_big: fs.createReadStream(req.files.file.originalFilename),
                        file_big: fs.createReadStream(req.files.file[i].originalFilename),
                        file_small: fs.createReadStream('small_'+req.files.file[i].originalFilename),
                        event_id: parseInt(req.body.id_event),
                        event_user_id: parseInt(req.session.data.id_user),
                    }
                },
                function(error, response, body) {
                            console.log('ok');
                            upload(i+1);    
                            fs.unlinkSync(req.files.file[i].originalFilename);
                            fs.unlinkSync('small_'+req.files.file[i].originalFilename);
                });
            })
        })
    });

           };
           }
           upload(0);
      
}




            res.redirect('events');
    });
}

//fonction créer evenement
exports.save = function(req, res) {
    console.log(req.body.date);
    request({
        url: base_url+'events/create',
        method: 'POST',
        form: {
            title: capitalizeFirstLetter(req.body.title),
            user_id: parseInt(req.session.data.id_user),
            chart_id: req.body.courbe,
            description: req.body.description,
            //creation_date: req.body.date,
            start_date: req.body.date,
            end_date: req.body.date,
            note: req.body.note,
            chart_category_id: 0
        }
    },
    function(error, response, body) {
        var json = JSON.parse(body);
        var type = typeof(req.files.file.originalFilename);
        var size = req.files.file.size;

console.log(type);
//console.log(typeof(req.files.files));
    if (type != 'undefined' && size !=0 ) {
    var src = req.files.file.path;


    lwip.open(src, function(err, image){
            image.cover(150, 150, function(err,image){
                image.writeFile('small_'+req.files.file.originalFilename,function(err){
                    console.log("resized");
                })
            })
    })

    
    
    lwip.open(src, function(err, image){
        image.contain(1024, 768, "linear", function(err,image){
            image.writeFile(req.files.file.originalFilename,function(err){
                console.log("done");
                request({
                    url: base_url+'uploads/postImages',
                    method: 'POST',
                    formData: {
                        //file_big: fs.createReadStream(req.files.file.originalFilename),
                        file_big: fs.createReadStream(req.files.file.originalFilename),
                        file_small: fs.createReadStream('small_'+req.files.file.originalFilename),
                        event_id: parseInt(json.data[0].id_event),
                        event_user_id: parseInt(req.session.data.id_user),
                    }
                },
                function(error, response, body) {
                            console.log('ok');
                            fs.unlinkSync(req.files.file.originalFilename);
                            fs.unlinkSync('small_'+req.files.file.originalFilename);
                });
            })
        })
    });

}
//end single
else {


//multiple
        var srcPath=[];
        for(var i=0;i<req.files.file.length;i++){
         srcPath[i] = req.files.file[i].path;
    }
        function upload(i){
            if( i < srcPath.length ) {


    lwip.open(srcPath[i], function(err, image){
            image.cover(150, 150, function(err,image){
                image.writeFile('small_'+req.files.file[i].originalFilename,function(err){
                    console.log("resized");
                })
            })
    })

        lwip.open(srcPath[i], function(err, image){
        image.contain(1024, 768, "linear", function(err,image){
            image.writeFile(req.files.file[i].originalFilename,function(err){
                console.log("done");
                request({
                    url: base_url+'uploads/postImages',
                    method: 'POST',
                    formData: {
                        //file_big: fs.createReadStream(req.files.file.originalFilename),
                        file_big: fs.createReadStream(req.files.file[i].originalFilename),
                        file_small: fs.createReadStream('small_'+req.files.file[i].originalFilename),
                        event_id: parseInt(json.data[0].id_event),
                        event_user_id: parseInt(req.session.data.id_user),
                    }
                },
                function(error, response, body) {
                            console.log('ok');
                            upload(i+1);    
                            fs.unlinkSync(req.files.file[i].originalFilename);
                            fs.unlinkSync('small_'+req.files.file[i].originalFilename);
                });
            })
        })
    });



           };
           }
           upload(0);
      
}
 res.redirect('events');
        });
}