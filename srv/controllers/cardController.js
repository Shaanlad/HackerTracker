var path = require('path');
var Project = require('../models/projectModel.js');

module.exports.controller = function (app, mongoose) {
    app.get('/card/issueTypes/:project_id', function(req, res) {
        //FIXME - Un-hardcode
        res.json(['Task', 'Bug', 'Feature', 'Service']);
        return;
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
                    res.json(result.states);
                });
        };
    });

    app.get('/card/assignees/:project_id', function(req, res) {
        //FIXME - Un-hardcode
        res.json({
            users: ['Ellery', 'Kartikya', 'Shantanu'],
            groups: ['Dev', 'QA', 'UAT']
        });
        return;
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
                    res.json({users: result.users, groups: result.groups});
                });
        };
    });
};