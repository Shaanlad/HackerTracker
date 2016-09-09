var path = require('path');

module.exports.controller = function(app) {
    app.get('/', function(req, res) {
        res.redirect('/login');
    });
}