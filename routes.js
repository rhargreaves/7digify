
module.exports = function(app, config, sevenDigitalApi) {

	// ARGH!
	var oauthStore = {};
	var sevenDigitalApiForUser = null;

	app.get('/', function (req, res) {
		res.render('home');
	});

	app.get('/7digital-login', function(req, res) {
		var callbackUrl = 'http://localhost:3000/7digital-handback';
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
				sevenDigitalApiForUser = sevenDigitalApi.reconfigure({
					defaultParams: {
						accesstoken: accessToken,
						accesssecret: accessSecret
					}
				});
				res.redirect('/logged-in');
			});

		} else {
			res.status(400).send({ error: 'status: ' + status });
		}

	});


}
