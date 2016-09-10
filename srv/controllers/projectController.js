var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var config = require('config');
var Project = require('../models/projectModel.js');

module.exports.controller = function (app) {
    //Get all projects for specific user
    app.get('/project', function(req, res) {
        // If user isn't already logged in
        if (!req.session['user_id']) {
            // Take him to login page
            res.redirect('/login');
        }
        else{
            MongoClient.connect(config.mongodbUrl, function(err, db) {
                db.collection("ProjectCollection").find({
                    users: req.session['user_id']
                }).sort({ name: -1 }).toArray(function(err, result) {
                    res.json(result);
                });
                db.close();
            });
        };
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

            MongoClient.connect(config.mongodbUrl, function(err, db) {
                db.collection("ProjectCollection").insert(project, function(err, result) {
                    if (err)
                        res.json(err);
                    else
                        res.json(result);
                });
            });
        };
    });
};