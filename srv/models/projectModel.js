var mongoose	= require('mongoose');
var Schema		= mongoose.Schema;

var ProjectSchema = new Schema({
	name: String,
	description: String,
	users: [],
	cards: [],
	states: []
});

module.exports = mongoose.model('Project', ProjectSchema);