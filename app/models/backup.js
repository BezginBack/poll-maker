var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Backup = new Schema({
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
		type : Date 
	},
	lastvoted : { 
		type : Date
	},
	votes : [],
	sumvotes : { 
		type : Number
	}
});

module.exports = mongoose.model('Backup', Backup);