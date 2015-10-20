var express = require('express');
var exphbs  = require('express-handlebars');

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));

app.get('/', function (req, res) {
    res.render('home');
});

app.listen(3000);
