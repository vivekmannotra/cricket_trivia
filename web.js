var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var router = express.Router();
var app = express();
app.use(express.static(__dirname + '/dist'));
app.use(bodyParser.json());
app.get('/*', function(req, res){
    res.sendFile(__dirname + '/dist/index.html');
});
app.listen(process.env.PORT || 5000);