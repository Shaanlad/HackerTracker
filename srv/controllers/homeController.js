var path = require('path');

module.exports.controller = function(app) {
    app.get('/', function(req, res) {
        res.sendFile(path.join(__dirname, '../../web/views', 'index.html'));
    });
}