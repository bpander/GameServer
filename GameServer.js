var socketIO = require('socket.io');


function GameServer (server) {

    this.server = server;

    this.io = socketIO(server);

    this.rooms = [];

    this.init();
}


var _getRandomCapitalLetter = function () {
    return String.fromCharCode(65 + Math.floor(Math.random() * 26)); // 65 = 'A', 26 letters in the alphabet
};


GameServer.prototype.init = function () {
    var self = this;
    this.io.on('connection', function (socket) {
        socket.on('request', function (request) {
            var response = new GameServer.Response(request.id);
            var room;
            var code;
            switch (request.method) {

                case 'createRoom':
                    code = self.generateUniqueCode();
                    response.success = true;
                    response.code = code;
                    socket.join(code);
                    socket.emit('response', response);
                    break;

                case 'joinRoom':
                    code = request.value;
                    room = self.io.sockets.adapter.rooms[code];
                    if (room !== undefined) {
                        response.success = true;
                        response.code = code;
                        socket.join(code);
                        socket.broadcast.to(code).emit('join');
                    }
                    socket.emit('response', response);
                    break;
            }
        });
    });
};


GameServer.prototype.generateUniqueCode = function () {
    var rooms = this.io.sockets.adapter.rooms;
    var code;
    while (true) {
        code = Array.prototype.map.call('****', _getRandomCapitalLetter).join('');
        if (rooms[code] === undefined) {
            break;
        }
    }
    return code;
};



GameServer.Response = function (id) {

    this.id = id;

    this.success = false;

    this.code = null;

};


module.exports = GameServer;
