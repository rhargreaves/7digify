var querystring = require('querystring');
var request = require('request');

module.exports = function(app, config) {

	/**
	 * Generates a random string containing numbers and letters
	 * @param  {number} length The length of the string
	 * @return {string} The generated string
	 * */
	var generateRandomString = function(length) {
		var text = '';
		var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmopqrstuvwxyz0123456789';

		for (var i = 0; i < length; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	};

	var stateKey = 'spotify_auth_state';
	var redirectUri = 'http://' + config.handbackHost + ':' + config.port +
		'/spotify-handback';

	app.get('/spotify-login', function(req, res) {

		var state = generateRandomString(16);
		res.cookie(stateKey, state);

		// your application requests authorization
		var scope = 'user-read-private user-read-email';
		res.redirect('https://accounts.spotify.com/authorize?' +
				querystring.stringify({
					response_type: 'code',
					client_id: config.spotifyClientId,
					scope: scope,
					redirect_uri: redirectUri,
					state: state
				}));
	});

	app.get('/spotify-handback', function(req, res) {
		// your application requests refresh and access tokens
		// after checking the state parameter

		var code = req.query.code || null;
		var state = req.query.state || null;
		var storedState = req.cookies ? req.cookies[stateKey] : null;

		if (state === null || state !== storedState) {
			res.redirect('/#' +
					querystring.stringify({
						error: 'state_mismatch'
					}));
		} else {
			res.clearCookie(stateKey);
			var authOptions = {
				url: 'https://accounts.spotify.com/api/token',
				form: {
					code: code,
					redirect_uri: redirectUri,
					grant_type: 'authorization_code'
				},
				headers: {
					'Authorization': 'Basic ' + (new Buffer(config.spotifyClientId +
							':' + config.spotifyClientSecret).toString('base64'))
				},
				json: true
			};
		};

		request.post(authOptions, function(error, response, body) {
			if (!error && response.statusCode === 200) {
				res.cookie('spotifyCreds', {
					accessToken: body.access_token,
					refreshToken: body.refresh_token
				});
				res.redirect('/');
			} else {
				res.send(400).send('invalid_token');
			}
		});
	});
}













