var util = require('util');

module.exports = function(app, config, sevenDigitalApi, credentials) {

	app.get('/7digital-login', function(req, res) {
		var callbackUrl = util.format('http://%s:%d/7digital-handback',
			config.handbackHost,
			config.port);
		var oauth = new sevenDigitalApi.OAuth();
		oauth.getRequestToken(callbackUrl,
			function(err, requestToken, requestSecret, authoriseUrl) {
				if(err) {
					res.status(500).send({ error: err });
					return;
				}
				credentials = {
					requestToken: requestToken,
					requestSecret: requestSecret
				}
				res.redirect(authoriseUrl);
			});
	});

	app.get('/7digital-handback', function(req, res) {
		var status = req.query.status;
		if(status === 'Authorised') {
			var oauth = new sevenDigitalApi.OAuth();
			oauth.getAccessToken({
				requesttoken: credentials.requestToken,
				requestsecret: credentials.requestSecret
			}, function(err, accessToken, accessSecret) {
				if(err) {
					res.status(500).send({ error: err });
					return;
				}
				credentials.accessToken = accessToken;
				credentials.accessSecret = accessSecret;
				console.log(oauthStore);
				res.redirect('/');
			});
		} else {
			res.status(400).send({ error: 'status: ' + status });
		}
	});

	app.get('/7digital-logout', function(req, res) {
		credentials = {};
		res.redirect('/');
	});
}