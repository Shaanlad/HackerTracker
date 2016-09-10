function User(userName) {
    this.userName = userName;
    this.socketId = null;
};

User.prototype.SetSocketId = function(socketId) {
    this.socketId = socketId;
    // TODO: Free previously associated socket
};

User.prototype.GetSocket = function(sockets) {
    for (var i = 0; i < sockets.length; i += 1) {
        if (sockets[i].id === this.socketId) {
            return sockets[i];
        }
    }
};

module.exports = User;