var express = require('express');
var app = express();
var http = require('http').Server(app);
var fs = require('fs');

// dynamically include routes (Controllers)
fs.readdirSync('./srv/controllers').forEach(function(file) {
    if (file.substr(-3) == '.js') {
        var route = require('./srv/controllers/' + file);
        route.controller(app);
    }
});

http.listen(3000, function() {
    console.log('Harambe hears you, always.');
});
