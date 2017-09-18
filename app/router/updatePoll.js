var Poll = require('../models/poll');

module.exports = function(req, callback){
    Poll.findOneAndUpdate({ _id : req.body.id }, { 
        options : JSON.parse(req.body.optionsArray), 
        votes : JSON.parse(req.body.votesArray),
        sumvotes : req.body.sumVotes,
        lastvoted : Date.now() 
    }, function (err, doc){
        if(err) return;
        callback(null, doc);
    });
};