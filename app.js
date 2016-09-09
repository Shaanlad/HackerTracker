/**
 * Created by Ellery on 9/9/16.
 */
var express = require('express');
var app = express();
var http = require('http').Server(app);

http.listen(3000, function() {
    console.log('Harambe hears you, always.');
});
