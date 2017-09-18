var Poll = require('../models/poll');

module.exports = function (req, done){
	var newPoll = new Poll();
	newPoll.user = req.user.git.username;
	newPoll.title = req.body.title;
	newPoll.question = req.body.question;
	newPoll.options = JSON.parse(req.body.options);
	newPoll.created = Date.now();
	newPoll.save(function (err) {
		if (err) {
			done(err, null);
		} else {
		    done(null, newPoll);
		}
	});
};
