request = require('request');
var express = require('express');
var app = express();
var base_url = 'http://localhost:85/api.immortality.life/index.php/';



var moment = require('moment'); //
var fs = require('fs');
var util = require('util');


moment.locale('fr');
var atob = require('atob');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://omar.kahouaji%40esprit.tn:espritomar@smtp.gmail.com');
var Jimp = require("jimp");
var fileExists = require('file-exists');
//var socket = io.connect('http://localhost:4300');




exports.list_prod = function(req,res){
    console.log("omar");
        request({
            url: base_url + 'users/list_prod',
            method: 'GET'
        },
        function (error, response, body) {
                var prods = JSON.parse(body);
                res.render('prods', { prods : prods.data });
        });
}

exports.deleteProd = function (req, res) {
    request({
        url: base_url + 'users/deleteProd/' + parseInt(req.params.id),
        method: 'DELETE',
    },
        function (error, response, body) {
            var json = JSON.parse(body);
            res.json(json);
        }
    );
}

exports.addProd = function(req,res){
    request({
        url: base_url + 'users/addProd',
        method: 'POST',
        form: {
            nom: req.body.nom,
            desc: req.body.desc,
            code: req.body.code,
            tarif: req.body.desc,
            poids: req.body.desc,
        }
    },
    function (error, response, body) {
            res.redirect('list_prod');
    });
}


