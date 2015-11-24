var express = require('express');
var exphbs  = require('express-handlebars');
var config  = require('./config');
var cookieParser = require('cookie-parser');

var sevenDigitalApi = require('7digital-api').configure({
	consumerkey: config.sevenDigitalConsumerKey,
	consumersecret: config.sevenDigitalConsumerSecret,
	defaultParams: {
		country: 'gb'
	}
});

var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi({
	clientId: config.spotifyClientId,
	clientSecret: config.spotifyClientSecret,
	redirectUri: 'http://' + config.handbackHost + ':' + config.port + '/spotify-handback'
});

var app = express();
app.use(cookieParser());

require('./routes/index')(app, config, sevenDigitalApi, spotifyApi);
require('./routes/7digital-auth')(app, config, sevenDigitalApi);
require('./routes/spotify-auth')(app, config);

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use('/assets', express.static('assets'));
app.use('/assets/bootstrap', express.static('node_modules/bootstrap/dist'));


app.listen(config.port);
