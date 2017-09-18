var GitHub = require('passport-github2');
var User = require('../models/user');

module.exports = function (passport){
    
    passport.serializeUser(function (user, done) {
    	done(null, user.id);
    });
    
    passport.deserializeUser(function (id, done) {
    	User.findById(id, function (err, user) {
    		done(err, user);
    	});
    });
    
    passport.use(new GitHub({
    	clientID: process.env.GITHUB_KEY,
    	clientSecret: process.env.GITHUB_SECRET,
    	callbackURL: process.env.APP_URL + '/auth/github/callback'
    }, function (token, refreshToken, profile, done) {
    	process.nextTick(function () {
    		User.findOne({ 'git.id': profile.id }, function (err, user) {
    			if (err) {
    				return done(err);
    			}
    			if (user) {
    				return done(null, user);
    			} else {
    				var newUser = new User();
    
    				newUser.git.id = profile.id;
    				newUser.git.username = profile.username;
    				newUser.git.displayName = profile.displayName;
    				newUser.git.publicRepos = profile._json.public_repos;
    
    				newUser.save(function (err) {
    					if (err) {
    						throw err;
    					}
    					return done(null, newUser);
    				});
    			}
    		});
    	});
    }));
};