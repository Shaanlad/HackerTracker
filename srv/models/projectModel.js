var mongoose	= require('mongoose');
var Schema		= mongoose.Schema;

var ProjectSchema = new Schema({
	name: String,
	description: String,
	users: [
		{
			_id: Schema.ObjectId,
			userName: String
		}
	],
	groups: [
		{
			_id: Schema.ObjectId,
			name: String,
			users: [
				{
					_id: Schema.ObjectId,
					userName: String
				}
			]
		}
	],
	cards: [
		{
			_id: Schema.ObjectId,
			state: String,
			name: String,
			description: String,
			creator: String,
			assignees: [],
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