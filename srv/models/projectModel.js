var mongoose	= require('mongoose');
var Schema		= mongoose.Schema;

var ProjectSchema = new Schema({
	name: String,
	description: String,
	users: [],
	groups: [],
	cards: [],
	states: [],
	issueTypes: []
});

module.exports = mongoose.model('Project', ProjectSchema);