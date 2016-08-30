var express = require('express');
var Facebook = require('facebook-node-sdk');
var request = require('request');
var http = require('http');
var path = require('path');
var immortality = require('./routes/immortality');
var immortals = require('./routes/immortals');
var app = express();

var connection = require('express-myconnection');
var errorHandler = require('errorhandler');
//var rewrite = require('express-urlrewrite');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var favicon = require('serve-favicon');
var methodOverride = require('method-override');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var multipart = require('connect-multiparty');
//var im = require('imagemagick');
var fs = require('fs');
var moment = require('moment');
moment.locale('fr');
var _ = require('lodash');
var cookieSession = require('cookie-session');
app.set('port', process.env.PORT || 4300);
app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/favicon.png'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser('S3CRE7'));
app.use(methodOverride());
app.use(multipart());
app.use(cookieSession({
  key: 'app.sess',
  secret: 'SUPERsekret'
}));
/*app.use(session({
    store: new RedisStore({
        //host: 'immortality.redis.cache.windows.net',
        host: 'localhost',
        port: 6379,
        db: 2,
        pass: ''
    }),
    secret: '1234567890QWERTY',
    saveUninitialized:true,
    resave:true,
}));*/
app.use(express.static(path.join(__dirname, 'public'), { redirect : false }));

app.use(function(req, res, next) {
  res.locals.last_chart = req.session.last_chart;
  console.log("last_chart is doing well")
  next();
});


if ( app.get('env') === 'development' ) {
  app.locals.path_avatar="http://localhost:85/api.immortality.life/application/uploads/avatars";
  app.locals.base_url="http://localhost:85/api.immortality.life/index.php/";
  app.locals.upload_path="http://localhost:85/api.immortality.life/application/uploads/";
  var base_url = 'http://localhost:85/api.immortality.life/index.php/';
}else{
  app.locals.upload_path="http://immortality-api-life.azurewebsites.net/application/uploads/";
  app.locals.path_avatar="http://immortality-api-life.azurewebsites.net/application/uploads/avatars";
  app.locals.base_url="http://immortality-api-life.azurewebsites.net/index.php/";
  var base_url = 'http://immortality-api-life.azurewebsites.net/index.php/';
}


console.log(app.get('env'));
app.locals.fb_image = '';
app.locals.facebook = '';
//facebook
app.use(Facebook.middleware({ appId: '276751416030414', secret: 'f29bf263de6b0803b63507989f9a8d36'}));
//routes

app.all('/charts',function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

app.all('/chart/:id',function(req, res, next) {
    console.log("processing...")
    request({
        url: base_url + 'charts/is_it_my_chart/'+ req.session.data.id_user + '/' + req.params.id,
        method: 'GET'
    },
    function (error, response, body) {
        if(body == 'true') next();
            else res.send('courbe privée');
    });
});

app.get('/landingPage',immortality.landingPage);
app.get('/', immortality.index);
app.get('/index', immortality.index);
app.post('/registration', immortality.registration);
app.post('/auth', immortality.auth);
app.post('/register', immortality.register);
app.post('/searchMail', immortality.searchMail);
//charts
app.post('/getCharts',immortality.getCharts);
app.post('/addChart', immortality.addChart);
app.get('/create-chart', immortality.createChart);
app.get('/chart/:id', immortality.chart);
app.get('/charts', immortality.charts);
app.get('/followed-charts', immortality.followedCharts);
app.post('/followChart', immortality.followChart);
app.get('/deleteChart/:id',immortality.deleteChart);
app.get('/editChart/:id', immortality.editChart);
app.post('/updateChart', immortality.updateChart);
app.post('/updateLastChart', immortality.updateLastChart);
app.post('/unfollow_chart',immortality.unfollow_chart);
//events
app.get('/event/:id', immortality.event);
app.get('/editEvent/:id', immortality.editEvent);
app.get('/deleteEvent/:id',immortality.deleteEvent);
app.post('/getEvents',immortality.getEvents);
app.post('/postComment',immortality.postComment);
app.get('/getComments/:id', immortality.getComments);
app.get('/eventsAngular/:id/:nb', immortality.eventsAngular);
app.get('/events', immortality.events);
app.get('/:id/events', immortality.eventsFriend);
app.get('/:id/charts', immortality.chartsFriend);
app.get('/create-event', immortality.createEvent);
app.post('/save', immortality.save);
app.post('/updateEvent', immortality.updateEvent);
app.post('/postLike',immortality.postLike);
app.post('/deleteLike',immortality.deleteLike);
app.post('/deleteImage',immortality.deleteImage);
//notifs
app.get('/notifications',immortality.notifications);
app.get('/getNotifications/:id/:nb', immortality.getNotifications);
//profil
app.get('/informations', immortality.informations);
app.get('/:id/informations', immortality.informationsFriend);
app.post('/editProfile', immortality.editProfile);
app.post('/uploadAvatar', immortality.uploadAvatar);
app.get('/logout',immortality.logout);
app.post('/addImmortal',immortals.addImmortal);
app.post('/deleteImmortal',immortals.deleteImmortal);
app.post('/addNotaire',immortality.addNotaire);
//friends
app.get('/friends', immortality.friends);
app.get('/:id/friends', immortality.friendsFriend);
app.post('/addFriend',immortality.addFriend);
app.post('/deleteFriend',immortality.deleteFriend);
app.post('/sendFriendRequest',immortality.sendFriendRequest);
//search
app.get('/search', immortality.search);
app.get('/recherche', immortality.recherche);
app.get('/getFriends/:id/:nb', immortality.getFriends);
app.post('/searchUsers',immortality.searchUsers);
//home
app.get('/home', immortality.home);
app.get('/events_timeline/:id/:nb',immortality.events_timeline)
app.get('/getActivity/:id', immortality.getActivity);

app.post('/addMessage', immortality.addMessage);
app.get('/messages/:id/:id2', immortality.messages);


app.post('/upload_image', immortality.upload_image);
app.post('/delete_image', immortality.delete_image);





var configFacebook = {scope:['email','user_birthday']};

app.get('/facebook', Facebook.loginRequired(configFacebook), function (req, res, next) {

    req.facebook.api('/me',{fields: 'id,first_name,last_name,gender,picture.width(800).height(800),email,location{location},birthday'}, function(err, user) {

        //if (err) throw err;
        app.locals.fb_image = user.picture.data.url;
        //console.log(req.facebook);
        request({
            url: base_url+'users/register',
            method: 'POST',
                form: {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    password: 'fb'
                }
            },
            function(err, response, body) {


                if (err) throw err;

                if(JSON.parse(body).msg == 'user exists'){
                    app.locals.facebook = JSON.parse(body).msg;
                }
                else{
                    app.locals.facebook = 'new user';
                    req.session.image_facebook = user.picture.data.url;
                }

                request({
                    url: base_url+'users/auth_user',
                    method: 'POST',
                    form: {
                        email: user.email,
                        password: 'fb'
                    }
                },
                function(error, response, sess) {
                    var json_sess = JSON.parse(sess);
                    if (json_sess.msg == 'success') {
                        var birth = new Date(json_sess.data.birthday);
                        json_sess.data.age = parseInt(moment(birth).fromNow(true));
                        req.session.data = json_sess.data
                    }
                    if(JSON.parse(body).msg != 'user exists'){
                        request({
                            url: base_url+'users/update',
                            method: 'POST',
                            form: {
                                first_name: user.first_name,
                                last_name: user.last_name,
                                user_id: req.session.data.id_user,
                                email: user.email,
                                password: '',
                                phone: '',
                                address: '',
                                birthday: '',
                                sex: user.gender,
                                country: ''
                            }
                        },
                        function(error, response, body) {
                            var json = JSON.parse(body);
                            json.data.age = parseInt(moment(req.body.date).fromNow(true));//ajouter age au json
                            req.session.data = json.data;//remplir la session avec le fichier json


                            res.redirect('informations');
                        });
                    }else{
                        res.redirect('home');
                    }
                });
            });
        });
});




app.get('/charts/*', function(req, res) {
    res.redirect('/charts');
});

app.get('*', function(req, res) {
    res.redirect('/home');
});

if ('development' == app.get('env')) {
    app.use(errorHandler());
}

httpServer = http.createServer(app);



httpServer.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});


var io = require('socket.io').listen(httpServer);
io.sockets.on('connection', function (socket) {
  socket.on('join', function (data) {
    socket.join(data.id); // We are using room of socket io
  });
});

var users = {};

io.on('connection', function(socket){
    var me = false;
    socket.on('chat message', function(data){
        //io.emit('chat message', msg);
        io.sockets.in(data.to_id).emit('new_msg', {msg: data.msg, from_id : data.from_id, to_id : data.to_id});
    });

    for (var k in users){
        socket.emit('connected_users',users[k]);
    }

    socket.on('connected', function(data){
        me = data;
        //io.emit('chat message', msg);
        users[data.id]=me;
        //console.log(users);
        socket.broadcast.emit('connected_users', data);
    });

    socket.on('disconnect', function(){
        if(!me){
            return false;
        }
        console.log('user disconnected');
        delete users[me.id];
        socket.broadcast.emit('dis', me);

    });
});
