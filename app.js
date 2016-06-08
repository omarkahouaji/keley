var express = require('express');
var Facebook = require('facebook-node-sdk');
var passport = require('passport-facebook');
var request = require('request');
var http = require('http');
var path = require('path');
var immortality = require('./routes/immortality');
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
var im = require('imagemagick');
var fs = require('fs');
var moment = require('moment');
moment.locale('fr');

var _ = require('lodash');










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
app.use(cookieParser());
app.use(methodOverride());
app.use(multipart());
app.use(session({
  secret: '1234567890QWERTY',
  expires : new Date(Date.now() + (3600000*24))
}))
/*app.use(session({
    store: new RedisStore({
        host: 'immortality.redis.cache.windows.net',
        port: 6379//,
        /*db: 2,
        pass: ''
    }),
    secret: '1234567890QWERTY',
    saveUninitialized:true,
    resave:true,
}));*/
app.use(express.static(path.join(__dirname, 'public')));

//locals
app.locals.path_avatar="http://immortality-lif-api.azurewebsites.net/Immortality-api/application/uploads/avatars";
app.locals.base_url="http://immortality-lif-api.azurewebsites.net/Immortality-api/index.php/";


app.use(Facebook.middleware({ appId: '1601778010137309', secret: 'ff7edb7bc2cf3d93dd21989ebf9db6fb'}));

/*
passport.use(new FacebookStrategy({
    clientID: '1601778010137309',
    clientSecret: 'ff7edb7bc2cf3d93dd21989ebf9db6fb',
    callbackURL: "http://localhost:4300/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));*/


//routes
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
app.get('/deleteChart/:id',immortality.deleteChart);
app.get('/editChart/:id', immortality.editChart);
app.post('/updateChart', immortality.updateChart);
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
app.post('/addImmortal',immortality.addImmortal);
app.post('/deleteImmortal',immortality.deleteImmortal);
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

//f

var base_url = 'http://immortality-lif-api.azurewebsites.net/Immortality-api/index.php/';


app.locals.fb_image = '';
var countries = {
        'AF': 'Afghanistan',
        "AL": "Albania",
        "DZ": "Algeria",
        "AS": "American Samoa",
        "AD": "Andorra",
        "AO": "Angola",
        "AI": "Anguilla",
        "AG": "Antigua and Barbuda",
        "AR": "Argentina",
        "AM": "Armenia",
        "AW": "Aruba",
        "AU": "Australia",
        "AT": "Austria",
        "AZ": "Azerbaijan",
        "BS": "Bahamas",
        "BH": "Bahrain",
        "BD": "Bangladesh",
        "BB": "Barbados",
        "BY": "Belarus",
        "BE": "Belgium",
        "BZ": "Belize",
        "BJ": "Benin",
        "BM": "Bermuda",
        "BT": "Bhutan",
        "BO": "Bolivia, Plurinational State of",
        "BA": "Bosnia and Herzegovina",
        "BW": "Botswana",
        "BV": "Bouvet Island",
        "BR": "Brazil",
        "IO": "British Indian Ocean Territory",
        "BN": "Brunei Darussalam",
        "BG": "Bulgaria",
        "BF": "Burkina Faso",
        "BI": "Burundi",
        "KH": "Cambodia",
        "CM": "Cameroon",
        "CA": "Canada",
        "CV": "Cape Verde",
        "KY": "Cayman Islands",
        "CF": "Central African Republic",
        "TD": "Chad",
        "CL": "Chile",
        "CN": "China",
        "CO": "Colombia",
        "KM": "Comoros",
        "CG": "Congo",
        "CD": "Congo, the Democratic Republic of the",
        "CK": "Cook Islands",
        "CR": "Costa Rica",
        "CI": "C" + "&ocirc;" + "te d'Ivoire",
        "HR": "Croatia",
        "CU": "Cuba",
        "CW": "Cura" + "&ccedil;" + "ao",
        "CY": "Cyprus",
        "CZ": "Czech Republic",
        "DK": "Denmark",
        "DJ": "Djibouti",
        "DM": "Dominica",
        "DO": "Dominican Republic",
        "EC": "Ecuador",
        "EG": "Egypt",
        "SV": "El Salvador",
        "GQ": "Equatorial Guinea",
        "ER": "Eritrea",
        "EE": "Estonia",
        "ET": "Ethiopia",
        "FK": "Falkland Islands (Malvinas)",
        "FO": "Faroe Islands",
        "FJ": "Fiji",
        "FI": "Finland",
        "FR": "France",
        "GF": "French Guiana",
        "PF": "French Polynesia",
        "TF": "French Southern Territories",
        "GA": "Gabon",
        "GM": "Gambia",
        "GE": "Georgia",
        "DE": "Germany",
        "GH": "Ghana",
        "GI": "Gibraltar",
        "GR": "Greece",
        "GL": "Greenland",
        "GD": "Grenada",
        "GP": "Guadeloupe",
        "GU": "Guam",
        "GT": "Guatemala",
        "GG": "Guernsey",
        "GN": "Guinea",
        "GW": "Guinea-Bissau",
        "GY": "Guyana",
        "HT": "Haiti",
        "HM": "Heard Island and McDonald Islands",
        "VA": "Holy See (Vatican City State)",
        "HN": "Honduras",
        "HK": "Hong Kong",
        "HU": "Hungary",
        "IS": "Iceland",
        "IN": "India",
        "ID": "Indonesia",
        "IR": "Iran, Islamic Republic of",
        "IQ": "Iraq",
        "IE": "Ireland",
        "IM": "Isle of Man",
        "IL": "Israel",
        "IT": "Italy",
        "JM": "Jamaica",
        "JP": "Japan",
        "JE": "Jersey",
        "JO": "Jordan",
        "KZ": "Kazakhstan",
        "KE": "Kenya",
        "KI": "Kiribati",
        "KP": "Korea, Democratic People's Republic of",
        "KR": "Korea, Republic of",
        "KW": "Kuwait",
        "KG": "Kyrgyzstan",
        "LA": "Lao People's Democratic Republic",
        "LV": "Latvia",
        "LB": "Lebanon",
        "LS": "Lesotho",
        "LR": "Liberia",
        "LY": "Libya",
        "LI": "Liechtenstein",
        "LT": "Lithuania",
        "LU": "Luxembourg",
        "MO": "Macao",
        "MK": "Macedonia, the former Yugoslav Republic of",
        "MG": "Madagascar",
        "MW": "Malawi",
        "MY": "Malaysia",
        "MV": "Maldives",
        "ML": "Mali",
        "MT": "Malta",
        "MH": "Marshall Islands",
        "MQ": "Martinique",
        "MR": "Mauritania",
        "MU": "Mauritius",
        "YT": "Mayotte",
        "MX": "Mexico",
        "FM": "Micronesia, Federated States of",
        "MD": "Moldova, Republic of",
        "MC": "Monaco",
        "MN": "Mongolia",
        "ME": "Montenegro",
        "MS": "Montserrat",
        "MA": "Morocco",
        "MZ": "Mozambique",
        "MM": "Myanmar",
        "NA": "Namibia",
        "NR": "Nauru",
        "NP": "Nepal",
        "NL": "Netherlands",
        "NC": "New Caledonia",
        "NZ": "New Zealand",
        "NI": "Nicaragua",
        "NE": "Niger",
        "NG": "Nigeria",
        "NU": "Niue",
        "NF": "Norfolk Island",
        "MP": "Northern Mariana Islands",
        "NO": "Norway",
        "OM": "Oman",
        "PK": "Pakistan",
        "PW": "Palau",
        "PS": "Palestinian Territory, Occupied",
        "PA": "Panama",
        "PG": "Papua New Guinea",
        "PY": "Paraguay",
        "PE": "Peru",
        "PH": "Philippines",
        "PN": "Pitcairn",
        "PL": "Poland",
        "PT": "Portugal",
        "PR": "Puerto Rico",
        "QA": "Qatar",
        "RE": "R" + "&eacute;" + "union",
        "RO": "Romania",
        "RU": "Russian Federation",
        "RW": "Rwanda",
        "SH": "Saint Helena, Ascension and Tristan da Cunha",
        "KN": "Saint Kitts and Nevis",
        "LC": "Saint Lucia",
        "MF": "Saint Martin (French part)",
        "PM": "Saint Pierre and Miquelon",
        "VC": "Saint Vincent and the Grenadines",
        "WS": "Samoa",
        "SM": "San Marino",
        "ST": "Sao Tome and Principe",
        "SA": "Saudi Arabia",
        "SN": "Senegal",
        "RS": "Serbia",
        "SC": "Seychelles",
        "SL": "Sierra Leone",
        "SG": "Singapore",
        "SX": "Sint Maarten (Dutch part)",
        "SK": "Slovakia",
        "SI": "Slovenia",
        "SB": "Solomon Islands",
        "SO": "Somalia",
        "ZA": "South Africa",
        "GS": "South Georgia and the South Sandwich Islands",
        "SS": "South Sudan",
        "ES": "Spain",
        "LK": "Sri Lanka",
        "SD": "Sudan",
        "SR": "Suriname",
        "SZ": "Swaziland",
        "SE": "Sweden",
        "CH": "Switzerland",
        "SY": "Syrian Arab Republic",
        "TW": "Taiwan, Province of China",
        "TJ": "Tajikistan",
        "TZ": "Tanzania, United Republic of",
        "TH": "Thailand",
        "TL": "Timor-Leste",
        "TG": "Togo",
        "TK": "Tokelau",
        "TO": "Tonga",
        "TT": "Trinidad and Tobago",
        "TN": "Tunisia",
        "TR": "Turkey",
        "TM": "Turkmenistan",
        "TC": "Turks and Caicos Islands",
        "TV": "Tuvalu",
        "UG": "Uganda",
        "UA": "Ukraine",
        "AE": "United Arab Emirates",
        "GB": "United Kingdom",
        "US": "United States",
        "UM": "United States Minor Outlying Islands",
        "UY": "Uruguay",
        "UZ": "Uzbekistan",
        "VU": "Vanuatu",
        "VE": "Venezuela, Bolivarian Republic of",
        "VN": "Viet Nam",
        "VG": "Virgin Islands, British",
        "VI": "Virgin Islands, U.S.",
        "WF": "Wallis and Futuna",
        "EH": "Western Sahara",
        "YE": "Yemen",
        "ZM": "Zambia",
        "ZW": "Zimbabwe"
    };
var obj = _.invert(countries);
var configFacebook = {scope:['email','user_location','user_birthday']};
app.locals.facebook = '';
app.get('/facebook', Facebook.loginRequired(configFacebook), function (req, res, next) {
    req.facebook.api('/me',{fields: 'id,first_name,last_name,gender,picture.width(800).height(800),email,location{location},birthday'}, function(err, user) {
        app.locals.fb_image = user.picture.data.url;
        //console.log(req.facebook);
        request({
            url: base_url+'users/register',
            method: 'POST',
                form: {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    password: ''
                }
            },
            function(error, response, body) {
                if(JSON.parse(body).msg == 'user exists'){
                    app.locals.facebook = JSON.parse(body).msg;
                }
                else{
                    app.locals.facebook = 'new user';
                }
                request({
                    url: base_url+'users/auth_user',
                    method: 'POST',
                    form: {
                        email: user.email,
                        password: ''
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

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});