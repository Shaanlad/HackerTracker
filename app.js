var express = require('express');
var app = express();
var http = require('http').Server(app);
var fs = require('fs');
var path = require('path');

// dynamically include routes (Controllers)
fs.readdirSync('./srv/controllers').forEach(function(file) {
    if (file.substr(-3) == '.js') {
        var route = require('./srv/controllers/' + file);
        route.controller(app);
    }
});

app.use(express.static(path.join(__dirname, '/node_modules')));
app.use(express.static(path.join(__dirname, '/web')));

http.listen(3000, function() {
    console.log('Harambe hears you, always.');
});
