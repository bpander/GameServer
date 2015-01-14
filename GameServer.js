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
            var response = { id: request.id };
            switch (request.method) {

                case 'createRoom':
                    response.room = self.createRoom();
                    socket.emit('response', response);
                    break;

                case 'joinRoom':
                    response.room = self.getRoomByCode(request.value);
                    // TODO: Put the socket in the room if we found it
                    socket.emit('response', response);
                    break;
            }
        });
        socket.on('disconnect', function () {
            // TODO: Somehow we'll need to clear out empty rooms
        });
    });
};


GameServer.prototype.createRoom = function () {
    var room = new GameServer.Room(this.generateUniqueCode());
    this.rooms.push(room);
    return room;
};


GameServer.prototype.generateUniqueCode = function () {
    var code;
    while (true) {
        code = Array.prototype.map.call('****', _getRandomCapitalLetter).join('');
        if (this.getRoomByCode(code) === null) {
            break;
        }
    }
    return code;
};


GameServer.prototype.getRoomByCode = function (code) {
    var i = 0;
    var room;
    while ((room = this.rooms[i++]) !== undefined) {
        if (room.code === code) {
            return room;
        }
    }
    return null;
};


GameServer.Room = function (code) {

    this.code = code;

};


module.exports = GameServer;
