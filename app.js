var express = require('express');
var exphbs  = require('express-handlebars');
var config  = require('./config');

var sevenDigitalApi = require('7digital-api').configure({
	consumerkey: config.sevenDigitalConsumerKey,
	consumersecret: config.sevenDigitalConsumerSecret,
	defaultParams: {
		country: 'gb'
	}
});

var app = express();
var credentials = {
	sevenDigital: {},
	spotify: {}
};

require('./routes/index')(app, config, sevenDigitalApi, credentials);
require('./routes/7digital-auth')(app, config, sevenDigitalApi, credentials);

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use('/assets', express.static('assets'));
app.use('/assets/bootstrap', express.static('node_modules/bootstrap/dist'));

app.listen(config.port);
