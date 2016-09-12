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
            users: [{
                _id: '57d44f03dea64d2b1d000001',
                name: 'Ellery'
            },
            {
                _id: '57d41103dea64d2b1d000001',
                name: 'Kartikya'
            },
            {
                _id: '57d44f03de224d2b1d000001',
                name: 'Shantanu'
            }],
            groups: [{
                _id: '57d44f03dea64d2b1d000001',
                name: 'DEV'
            },
            {
                _id: '57d41103dea64d2b1d000001',
                name: 'QA'
            },
            {
                _id: '57d44f03de224d2b1d000001',
                name: 'UAT'
            }]
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

    app.get('/card/:card_id', function(req, res){
        Project.findOne({ 'cards': { $elemMatch: { _id: req.params.card_id }}},
        function(err, result){
            var cards = JSON.parse(JSON.stringify(result)).cards;
            var card = cards.filter(function(x){
                return x._id.toString() == req.params.card_id;
            });
            if (card)
                res.json(card);
        });
    });
};