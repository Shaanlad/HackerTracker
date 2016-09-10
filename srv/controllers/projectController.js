var path = require('path');
var Project = require('../models/projectModel.js');

module.exports.controller = function (app, mongoose) {
    //Get all projects for specific user
    app.get('/project', function(req, res) {
        // If user isn't already logged in
        if (!req.session['user_id']) {
            // Take him to login page
            res.redirect('/login');
        }
        else{
            Project.find({
                    users: req.session['user_id']
                },
                null,
                {
                    sort:{name: -1}
                },
                function(err, result) {
                    res.json(result);
                });
        };
    });

    //Get project with specified projectId
    app.get('/project/:projectId', function(req, res) {
        console.log(req.params.projectId);
        // If user isn't already logged in
        if (!req.session['user_id']) {
            // Take him to login page
            res.redirect('/login');
        }
        else{
            Project.findById(
                req.params.projectId,
                function(err, result) {
                    res.json(result);
                });
        }
    });

    //Create project
    app.post('/project', function(req, res) {
        // If user isn't already logged in
        if (!req.session['user_id']) {
            // Take him to login page
            res.sendFile(path.join(__dirname, '../../web/views', 'login.html'));
        }
        else{
            var project = new Project();
            project.name = req.body.name;
            project.description = req.body.description;
            project.users = [req.session['user_id']];

            project.save(function(err, result) {
                if (err)
                    res.json(err);
                else
                    res.json(result);
            });
        };
    });
};