var Backup = require('../models/backup');

module.exports = function (req, done){
	var newBackup = new Backup();
	newBackup.title = req.body.title;
	newBackup.user = req.body.user;
	newBackup.question = req.body.question;
	newBackup.options = JSON.parse(req.body.options);
	newBackup.votes = JSON.parse(req.body.votes);
	newBackup.created = req.body.created;
	newBackup.lastvoted = req.body.lastvoted;
	newBackup.sumvotes = req.body.sumvotes;
	newBackup.save(function (err) {
		if (err) {
			done(err, null);
		} else {
		    done(null, newBackup);
		}
	});
};