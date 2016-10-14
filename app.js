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









app.get('/list_prod', immortality.list_prod);
app.post('/addProd', immortality.addProd);
//app.post('/updateProd', immortality.updateProd);
app.get('/deleteProd/:id', immortality.deleteProd);







if ('development' == app.get('env')) {
    app.use(errorHandler());
}

httpServer = http.createServer(app);



httpServer.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});


