var path = require('path');
var Project = require('../models/projectModel.js');
var User = require('../models/userModel.js')

module.exports.controller = function (app, mongoose) {
    var projectUsers;
    var allUsers;
    app.get('/users/:project_id', function(req, res) {
        // If user isn't already logged in
        if (!req.session['user_id']) {
            // Take him to login page
            res.redirect('/login');
        }
        else{
            Project.find({
                    _id: req.params['project_id']
                },
                null,
                {
                    sort:{name: -1}
                },
                function(err, result) {
                    projectUsers = result[0].users;
                });
            User.find({}, null, {
                    sort:{name: -1}
                }, function(err, result) {
                    allUsers = result;
                    res.json({
                        'projectUsers' : projectUsers, 
                        'allUsers' : allUsers
                    });
                });
        };
    });
};