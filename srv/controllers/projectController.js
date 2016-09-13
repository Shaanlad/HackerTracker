var path = require('path');
var Project = require('../models/projectModel.js');
var User = require('../models/userModel.js');

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
                    'users._id': mongoose.Types.ObjectId(req.session['user_id'])
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

    //Create project
    app.post('/project', function(req, res) {
        // If user isn't already logged in
        if (!req.session['user_id']) {
            // Take him to login page
            res.sendFile(path.join(__dirname, '../../web/views', 'login.html'));
        }
        else{
            User.findOne({ _id: [req.session['user_id']] },
                '_id userName' ,
                function (err, user) {
                    if (err)
                        res.json(err);
                    else
                    {
                        var project = new Project();
                        project.name = req.body.name;
                        project.description = req.body.description;
                        project.users = [user];
                        project.save(function(err, result) {
                            if (err)
                                res.json(err);
                            else
                                res.json(result);
                        });
                    }
                }
            )
        };
    });

    //Get project with specified projectId
    app.get('/project/:projectId', function(req, res) {
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

    //Update project's basic info having specified projectId
    app.put('/project/:projectId', function(req, res) {
        // If user isn't already logged in
        if (!req.session['user_id']) {
            // Take him to login page
            res.redirect('/login');
        }
        else{
            Project.findById(
                req.params.projectId,
                function(err, project) {
                    project.name = req.body.name;
                    project.description = req.body.description;
                    res.json(result);
                });
        }
    });

    //Get assignees for project with specified projectId
    app.get('/project/:projectId/assignees', function(req, res) {
        // If user isn't already logged in
        if (!req.session['user_id']) {
            // Take him to login page
            res.redirect('/login');
        }
        else{
            Project.findById(
                req.params.projectId,
                function(err, result) {
                    res.json({users: result.users, groups: result.groups});
                });
        }
    });

    //Get card with specefic cardId of the project having specified projectId
    app.get('/project/:projectId/card/:cardId', function(req, res) {
        // If user isn't already logged in
        if (!req.session['user_id']) {
            // Take him to login page
            res.redirect('/login');
        }
        else{
            Project.findOne(
                {
                    '_id': req.params.projectId,
                    'cards._id': mongoose.Types.ObjectId(req.params.cardId)
                },
                {'cards.$': 1},
                function(err, result) {
                    if (err)
                        res.json(err);
                    else
                        res.json(result.cards[0]);
                    return;
                });
        }
    });


    //Add card to the project having specified projectId
    app.post('/project/:projectId/card', function(req, res) {
        // If user isn't already logged in
        if (!req.session['user_id']) {
            // Take him to login page
            res.redirect('/login');
        }
        else{
            Project.findById(
                req.params.projectId,
                function(err, project) {
                    req.body.card.creator = req.session['user_id'];
                    req.body.card._id = mongoose.Types.ObjectId();
                    project.update(
                        {$push: {"cards": req.body.card}},
                        {safe: true, upsert: true, new : true},
                        function(err) {
                            if (err)
                                res.json(err);
                            else
                                res.json({success: true, message: "Card added to the project"});
                            return;
                        }
                    );
                });
        }
    });

    //Edit card to the project having specified projectId
    app.put('/project/:projectId/card/:cardId', function(req, res) {
        // If user isn't already logged in
        if (!req.session['user_id']) {
            // Take him to login page
            res.redirect('/login');
        }
        else{
            var set = {};
            set['cards.$.state'] = (req.body.card.state || null);
            set['cards.$.name'] = (req.body.card.name || null);
            set['cards.$.description'] = (req.body.card.description || null);
            set['cards.$.creator'] = (req.body.card.creator || null);
            set['cards.$.assignees'] = (req.body.card.assignees || null);
            set['cards.$.startDate'] = (req.body.card.startDate || null);
            set['cards.$.endDate'] = (req.body.card.endDate || null);
            set['cards.$.estimatedTime'] = (req.body.card.estimatedTime || null);
            set['cards.$.actualTime'] = (req.body.card.actualTime || null);

            Project.update(
                {
                    '_id': req.params.projectId,
                    'cards._id': mongoose.Types.ObjectId(req.params.cardId)
                }, 
                { $set: set },
                function(err) {
                    if (err)
                        res.json(err);
                    else
                        res.json({success: true, message: "Changes made to the card"});
                    return;
                }
            );
        }
    });

    //Add state to the project having specified projectId
    app.post('/project/:projectId/state', function(req, res) {
        // If user isn't already logged in
        if (!req.session['user_id']) {
            // Take him to login page
            res.redirect('/login');
        }
        else{
            Project.findById(
                req.params.projectId,
                function(err, project) {
                    req.body.state.creator = req.session['user_id'];
                    project.update(
                        {$push: {"states": req.body.state}},
                        {safe: true, upsert: true, new : true},
                        function(err) {
                            if (err)
                                res.json(err);
                            else
                                res.json({success: true, message: "State added to the project"});
                            return;
                        }
                    );
                });
        }
    });


};