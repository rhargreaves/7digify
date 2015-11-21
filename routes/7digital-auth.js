var util = require('util');

module.exports = function(app, config, sevenDigitalApi) {

	app.get('/7digital-login', function(req, res) {
		var callbackUrl = util.format('http://%s:%d/7digital-handback',
				config.handbackHost,
				config.port);
		var oauth = new sevenDigitalApi.OAuth();
		oauth.getRequestToken(callbackUrl, function(err, requestToken, requestSecret, authoriseUrl) {
			if(err) {
				res.status(500).send({ error: err });
				return;
			}
			var sevenDigitalCreds = {
				requestToken: requestToken,
				requestSecret: requestSecret
			};
			res.cookie("sevenDigitalCreds", sevenDigitalCreds);
			res.redirect(authoriseUrl);
		});
	});

	app.get('/7digital-handback', function(req, res) {
		var status = req.query.status;
		if(status === 'Authorised') {
			var oauth = new sevenDigitalApi.OAuth();
			var sevenDigitalCreds = req.cookies["sevenDigitalCreds"];
			oauth.getAccessToken({
				requesttoken: sevenDigitalCreds.requestToken,
				requestsecret: sevenDigitalCreds.requestSecret
			}, function(err, accessToken, accessSecret) {
				if(err) {
					res.status(500).send({ error: err });
					return;
				}
				res.cookie("sevenDigitalCreds", {
					accessToken: accessToken,
					accessSecret: accessSecret
				});
				res.redirect('/');
			});
		} else {
			res.status(400).send({ error: 'status: ' + status });
		}
	});

	app.get('/7digital-logout', function(req, res) {
		res.clearCookie('sevenDigitalCreds');
		res.redirect('/');
	});

}
