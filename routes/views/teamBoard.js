var keystone = require('keystone');
var Request = keystone.list('Request');
var User = keystone.list('User');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'team-board';
	locals.hasRequests = false;
	//locals.assignees = [{'value':'00012', 'label':'isacar'},{'value':'00012', 'label':'isacar'}]
	//console.log(locals.assignees);

	view.on('init', function (next) {
		//query db with requests from logged in user team
		Request.model.find()
		.where({ 'status':'open'})
		//.({ 'team': req.user.team, 'status':'open'})
		.sort('-createdAt')
		.exec(function(err, requests){
			//TODO handle when user has no team
			if (requests) {
				locals.hasRequests = true;
				locals.requests = requests;
			}

			//console.log(requests);
			//	next();

		}).then(
			//search assignees

			User.model.find()
			.exec(function(err, users){
				//TODO handle when Team has no team members
					console.log('search assignees');
				if (users) {

					locals.requests.assignees = users;
				}
				//console.log('req');
				//console.log(locals);
				next(err);

			})
		);

	});

	view.render('teamBoard');
};
