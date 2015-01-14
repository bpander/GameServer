// Dependencies
var express = require('express');
var http = require('http');
var GameServer = require('./GameServer.js');


// Properties
var app = express();
var server = http.Server(app);
var gameServer = new GameServer(server);
var port = (process.env.PORT || 3000);


// Routes
app.use(express.static(__dirname)); // Makes everything publicly available because yolo

app.get('/', function (request, response) {
    response.sendFile(__dirname + '/example.html');
});


// Start listening
server.listen(port, function () {
    console.log('Listening on ' + port);
});
