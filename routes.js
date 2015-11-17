var util = require('util');

module.exports = function(app, config, sevenDigitalApi) {

	// ARGH!
	var oauthStore = null;

	app.get('/', function (req, res) {
		var data = { signedIn: false };
		if(oauthStore) {
			var sevenDigitalApiUser = sevenDigitalApi.reconfigure({
				defaultParams: {
					accesstoken: oauthStore.accessToken,
					accesssecret: oauthStore.accessSecret
				}
			});
			var user = sevenDigitalApiUser.User();
			user.getDetails(function(err, userDetails) {
				data.signedIn = true;
				data.emailAddress = userDetails.user.emailAddress;
				res.render('home', data);
			});
		} else {
			res.render('home', data);
		}
	});

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
				oauthStore = {
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
				requesttoken: oauthStore.requestToken,
				requestsecret: oauthStore.requestSecret
			}, function(err, accessToken, accessSecret) {
				if(err) {
					res.status(500).send({ error: err });
					return;
				}
				oauthStore.accessToken = accessToken;
				oauthStore.accessSecret = accessSecret;
				console.log(oauthStore);
				res.redirect('/');
			});

		} else {
			res.status(400).send({ error: 'status: ' + status });
		}

	});


}
