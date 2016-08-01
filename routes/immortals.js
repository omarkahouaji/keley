request = require('request');
var base_url = 'http://localhost:85/api.immortality.life/index.php/';
var upload_path = '/Applications/MAMP/htdocs/api.immortality.life/application/uploads/';

exports.getImmortals = function (req, res) {
    request({
        url: base_url + 'users/getImmortals/' + parseInt(req.params.user_id),
        method: 'GET'
    },
        function (error, response, body) {
            var json = JSON.parse(body);
            res.json(json);
        }
    )
}

exports.addImmortal = function (req, res) {
    request({
        url: base_url + 'users/immortal',
        method: 'POST',
        form: {
            user_id: req.body.user_id,
            immortal_id: req.body.immortal_id
        }
    },
        function (error, response, body) {
            var json = JSON.parse(body);
            res.json(json);
        }
    );
}

exports.deleteImmortal = function (req, res) {
    request({
        url: base_url + 'users/deleteImmortal/' + parseInt(req.body.user_id) + '/' + parseInt(req.body.immortal_id),
        method: 'DELETE',
    },
        function (error, response, body) {
            var json = JSON.parse(body);
            res.json(json);
        }
    );
}