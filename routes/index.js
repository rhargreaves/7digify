var util = require('util');

module.exports = function(app, config, sevenDigitalApi, credentials) {

	app.get('/', function (req, res) {
		var data = { signedIn: false };
		if(Object.keys(credentials.sevenDigital).length !== 0) {
			sevenDigitalApi = sevenDigitalApi.reconfigure({
				defaultParams: {
					accesstoken: credentials.sevenDigital.accessToken,
					accesssecret: credentials.sevenDigital.accessSecret
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
