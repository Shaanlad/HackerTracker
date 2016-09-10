var path = require('path');

module.exports.controller = function(app) {
    app.get('/', function(req, res) {
    	console.log(req.session['user_id']);
        if (!req.session['user_id'])
            res.redirect('/login');
        else
            res.sendFile(path.join(__dirname, '../../web/views', 'index.html'));
    });
}