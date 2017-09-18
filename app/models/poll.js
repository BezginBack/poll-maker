var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema({
	user : {
		type : String,
	},
	title : {
		type : String,
		required : true,
	},
	question : 
	{
		type : String,
		required : true
	},
	options : [],
	created : { 
		type : Date, 
		default : Date.now
	},
	lastvoted : { 
		type : Date,
		default : Date.now 
	},
	votes : [],
	sumvotes : { 
		type : Number,
		default : 0 
	}
});

module.exports = mongoose.model('Poll', Poll);