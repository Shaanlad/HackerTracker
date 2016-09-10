var mongoose	= require('mongoose');
var Schema 		= mongoose.Schema;

var UserSchema = new Schema({
	userName: String,
	password: String,
	socketId: String
});

UserSchema.methods.SetSocketId = function(socketId) {
    this.socketId = socketId;
    // TODO: Free previously associated socket
};

UserSchema.methods.GetSocket = function(sockets) {
    for (var i = 0; i < sockets.length; i += 1) {
        if (sockets[i].id === this.socketId) {
            return sockets[i];
        }
    }
};

module.exports = mongoose.model('User', UserSchema);