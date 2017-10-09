var keystone = require('keystone');
var Request = keystone.list('Request');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

	view.on('init', function (next) {
		//query db with requests from logged in user team
		Request.model.find()
		//.where({'team':req.user.team})
		.where({'status': 'open', 'team':req.user.team}) //ands treated as sets
		.sort('-createdAt')
		.exec(function(err, requests){
			//TODO handle when user has no team
			if (requests) {
				locals.hasRequests = true;
				locals.requests = requests;
			}

			console.log(requests);
				next();

		});
	});

	// Render the view
	view.render('teamBoard');
};
