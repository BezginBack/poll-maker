var Poll = require('../models/poll');

module.exports = function (item, done){
	var resPoll = new Poll();
	item = JSON.parse(item);
	resPoll.user = item.user;
	resPoll.title = item.title;
	resPoll.question = item.question;
	resPoll.options = item.options;
	resPoll.votes = item.votes;
	resPoll.created = item.created;
	resPoll.lastvoted = item.lastvoted;
	resPoll.sumvotes = item.sumvotes;
	resPoll.save(function (err) {
		if (err) {
			done(err, null);
		} else {
		    done(null, resPoll);
		}
	});
};
