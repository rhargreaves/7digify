var util = require('util');

module.exports = function(app, config, sevenDigitalApi, credentials) {

	app.get('/', function (req, res) {
		var data = { signedIn: false };
		var sevenDigitalCreds = req.cookies['sevenDigitalCreds'];
		if(sevenDigitalCreds) {
			sevenDigitalApi = sevenDigitalApi.reconfigure({
				defaultParams: {
					accesstoken: sevenDigitalCreds.accessToken,
					accesssecret: sevenDigitalCreds.accessSecret
				}
			});
			var user = sevenDigitalApi.User();
			user.getDetails(function(err, userDetails) {
				if(err) {
					res.status(500).send({ error: err });
					return;
				}
				data.signedIn = true;
				data.emailAddress = userDetails.user.emailAddress;
				res.render('home', data);
			});
		} else {
			res.render('home', data);
		}
	});
}
