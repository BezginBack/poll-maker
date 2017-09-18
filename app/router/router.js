var savePoll = require('../router/savePoll');
var updatePoll = require('../router/updatePoll');
var backUpPoll = require('../router/backUpPoll');
var restorePoll = require('../router/restorePoll');
var Poll = require('../models/poll');
var Backup = require('../models/backup');
var getIP = require('ipware')().get_ip;

exports.route = function (app, passport){
	//page requests
    app.route('/')
        .get(function (req, res) {
        	if(req.isAuthenticated()){
		    	res.redirect('/intersection');
        	} else {
        		res.render('index');
        	}
	    });
	    
	app.route('/info')
        .get(function (req, res) {
		    res.render('info');
	    });
	
	app.route('/intersection')
        .get(function (req, res) {
	        if(req.isAuthenticated()){
		        res.redirect("/" + req.user.git.username);
	        } else {
		        res.render('index');
	        }
	    });
	    
	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/');
		});
		
	app.route('/newpoll')
		.get(function (req, res) {
	    	if(req.isAuthenticated()){
    			res.render('newpoll', {
    				id : req.user.git.id,
    	        	username : req.user.git.username,
    	        	displayName : req.user.git.displayName
    			});
	        } else {
		        res.render("errorpage", {
					error : 'not found'
				});
	        }
	    });
	 
	app.route('/result')
		.get(function (req, res) {
	    	if(req.isAuthenticated()){
    			res.render('result', {
    				id : req.user.git.id,
    				displayName : req.user.git.displayName,
    				username : req.user.git.username
    			});
	        } else {
		        res.render("errorpage", {
					error : 'not found'
				});
	        }
	    });
	    
	app.route('/auth/github')
		.get(passport.authenticate('github'));
	
	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/intersection',
			failureRedirect: '/'
		}));
		
	//managerial area
	app.route('/managerialarea')
        .get(function (req, res) {
	        if(req.isAuthenticated() && req.user.git.id == process.env.ADMIN_ID){
		        Backup.find({}).exec(function(err, items){
		        	if(err){
		        		res.end(err);
		        	} else {
		        		res.render('manage', {
		        			id : req.user.git.id,
    	        			username : req.user.git.username,
		        			displayName : req.user.git.displayName,
		        			items : items
		        		});
		        	}
		        });
	        } else {
		        res.redirect("/");
	        }
	    });

	 app.route('/clean/:id')
		.get(function(req, res){
			if(req.isAuthenticated() && req.user.git.id == process.env.ADMIN_ID){
		        Backup.findOneAndRemove({ _id : req.params.id }, function(err){
		        	if(err) return;
		        	res.redirect("/managerialarea");
		        });
	        }
		});
		
	app.route('/restore/:id')
		.get(function(req, res){
			if(req.isAuthenticated() && req.user.git.id == process.env.ADMIN_ID){
		        Backup.find({ _id : req.params.id }).exec(function(err, item) {
		        	if(err) return;
		           	restorePoll(JSON.stringify(item[0]), function(err, poll){
		        		if(err) return;
		        		Backup.findOneAndRemove({ _id : req.params.id }, function(err){
		        			if(err) return;
		        			res.redirect("/managerialarea");
		        		});	
		        	});
		        });
	        }
		});
	
	app.route('/backup')
		.post(function(req, res){
			backUpPoll(req, function(err, newbackup){
	        	if(err) return;
	        	res.send(newbackup);
	        });
		});
	//////////////////////////////////

	app.route('/:username')
        .get(function (req, res) {
    	    if(req.isAuthenticated()){
    	    	if(req.user.git.id == process.env.ADMIN_ID){
		        	res.render('profile', {
		        		displayName : req.user.git.displayName,
		        		username : req.user.git.username,
		        		id : req.user.git.id,
		        		admin : true
		        	}); 
    	    	} else {
    	    		res.render('profile', {
		        		displayName : req.user.git.displayName,
		        		username : req.user.git.username,
		        		id : req.user.git.id,
		        	});
    	    	}
			} else {
    			res.render("errorpage", {
					error : 'not found'
				});
    	    }
	    });
	    
	app.route('/:username/:polltitle')
		.get(function (req, res) {
			if(req.isAuthenticated()){
				res.render('displaypoll', {
	        		username : req.user.git.username,
	        		id : req.user.git.id,
	        		displayName : req.user.git.displayName,
	        		user : req.params.username,
					polltitle : req.params.polltitle 
				});
			} else {
				res.render('displaypoll', {
					user : req.params.username,
					polltitle : req.params.polltitle
				});
			}
		});
	////////////////////////

	//information requests
	app.route('/api/get-all-polls')
		.post(function(req, res){
	        Poll.find({}).sort({ created : -1 }).exec(function(err, polls){
	        	if(err) return;
	        	res.send(polls);
        	}); 
		});
		
	app.route('/api/find-by-id')
		.post(function(req, res){
	        Poll.find({ _id : req.body.id }).exec(function(err, polls){
	        	if(err) return;
	        	res.send(polls);
        	}); 
		});
	
	app.route('/api/find-by-title')
		.post(function(req, res){
	        Poll.find({ title : req.body.title }).exec(function(err, polls){
	        	if(err) return;
	        	res.send(polls);
        	}); 
		});
	
	app.route('/api/find-by-user')
		.post(function(req, res){
	        Poll.find({ user : req.body.user }).exec(function(err, polls){
	        	if(err) return;
	        	res.send(polls);
        	}); 
		});
		
	app.route('/api/find-by-title-and-user')
		.post(function(req, res){
	        Poll.find({ title : req.body.title, user : req.body.user }).exec(function(err, polls){
	        	if(err) return;
	        	res.send(polls);
        	}); 
		});
		
	app.route('/api/get-ip')
		.post(function(req, res){
	        res.send({
	        	ip : getIP(req).clientIp
	        });
		});
		
	app.route('/savepoll')
		.post(function(req, res){
	        savePoll(req, function(err, newpoll){
	        	if(err) return;
	        	res.send(newpoll);
	        }); 
		});
	
	app.route('/update')
		.post(function(req, res){
	        updatePoll(req, function(err, result){
	        	if(err) return;
	        	res.send([result, true]);
	        });
		});
	
	app.route('/delete')
		.post(function(req, res){
			Poll.findOneAndRemove({ _id : req.body.id }, function(err){
		        if(err) return;
		        res.send([true]);
			});
		});
		
	//////////////////////////////////
};

exports.error = function(req, res, next){
	res.render("errorpage", {
		error : 'no way out dude'
	});
};

exports.logger = function(req, res, next){
	console.log('Requester:', getIP(req).clientIp, 'Time:', new Date(Date.now()), 'Where:', req.url, 'Data:', req.body);
	next();
};
