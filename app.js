var express = require('express');
var app = express();
var http = require('http').Server(app);
var fs = require('fs');
var path = require('path');
var headerCookie = require('cookie');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var Users = require('./srv/models/userCollection.js');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var config = require('config');
var mongoose   = require('mongoose');
mongoose.connect(config.mongodbUrl);

var appSession = session({
    secret: 'cookiesalt',
    store: new MongoStore({
        url: config.mongodbUrl,
        autoRemove: "native"
    }),
    resave: false,
    saveUninitialized : true
});
app.use(appSession);
app.use(bodyParser.json());

// dynamically include routes (Controllers)
fs.readdirSync('./srv/controllers').forEach(function(file) {
    if (file.substr(-3) == '.js') {
        var route = require('./srv/controllers/' + file);
        route.controller(app, mongoose);
    }
});

app.Users = new Users();

// Allow serving static files
app.use(express.static(path.join(__dirname, '/node_modules')));
app.use(express.static(path.join(__dirname, '/web')));

http.listen(3000, function() {
    console.log('Harambe hears you, always.');
});
