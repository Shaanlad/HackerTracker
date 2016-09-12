var mongoose	= require('mongoose');
var Schema		= mongoose.Schema;

var ProjectSchema = new Schema({
	name: String,
	description: String,
	users: [],
	groups: [],
	cards: [
		{
			_id: Schema.ObjectId,
			state: String,
			name: String,
			description: String,
			creator: String,
			assignedUsers: [{
				_id: Schema.ObjectId,
				name: String
			}],
			assignedGroups: [{
				_id: Schema.ObjectId,
				name: String
			}],
			startDate: Date,
			endDate: Date,
			estimatedTime: Number,
			actualTime: Number
		}
	],
	states: [],
	issueTypes: []
});

module.exports = mongoose.model('Project', ProjectSchema);