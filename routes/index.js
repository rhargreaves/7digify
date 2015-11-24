var util = require('util');

module.exports = function(app, config, sevenDigitalApi, spotifyApi) {

	function getSevenDigitalUserDetails(data, sevenDigitalCreds, callback) {
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
					return callback(err, data);
				}
				data.sevenDigital.signedIn = true;
				data.sevenDigital.emailAddress = userDetails.user.emailAddress;
				return callback(null, data);
			});
		} else {
			callback(null, data);
		}
	}

	function getSpotifyUserDetails(data, spotifyCreds, callback) {
		if(spotifyCreds) {
			spotifyApi.setAccessToken(spotifyCreds.accessToken);
			spotifyApi.getMe().then(function(d) {
				data.spotify.id = d.body.id;
				data.spotify.displayName = d.body.display_name;
				data.spotify.imageUrl = d.body.images[0].url;
				data.spotify.url = d.body.external_urls.spotify;
				callback(null, data);
			}, function(err) {
				callback(err, data);
			});
		} else {
			callback(null, data);
		}
	}

	app.get('/', function (req, res) {
		var data = {
			sevenDigital: { signedIn: false },
			spotify: { }
		};
		var sevenDigitalCreds = req.cookies['sevenDigitalCreds'];
		var spotifyCreds = req.cookies['spotifyCreds'];

		getSevenDigitalUserDetails(data, sevenDigitalCreds, function(err, data) {
			if(err) {
				return res.status(500).send({ error: err });
			}
			getSpotifyUserDetails(data, spotifyCreds, function(err, data) {
				if(err) {
					return res.status(500).send({ error: err });
				}
				console.log(data);
				res.render('home', data);
			});
		});
	});
}
