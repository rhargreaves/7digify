var express = require('express');
var exphbs  = require('express-handlebars');
var config  = require('./config');

var sevenDigitalApi = require('7digital-api').configure({
	consumerKey: config.sevenDigitalConsumerKey,
	consumerSecret: config.sevenDigitalConsumerSecret,
	defaultParams: {
		country: 'gb'
	}
});

var app = express();
var routes = require('./routes')(app, config, sevenDigitalApi);

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use('/public', express.static('public'));
app.use('/public/bootstrap', express.static('node_modules/bootstrap/dist'));

app.listen(3000);
