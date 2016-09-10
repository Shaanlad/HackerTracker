var path = require('path');
var User = require('../models/userModel.js');

module.exports.controller = function(app, mongoose) {
    app.get('/login', function(req, res) {
        // If user isn't already logged in
        if (!req.session['user_id']) {
            // Take him to login page
            res.sendFile(path.join(__dirname, '../../web/views', 'login.html'));
        }
        else{
            // Take him to home
            res.redirect('/');
        }
    });

    app.post('/login', function(req, res) {
        // If user is already logged in
        if (req.session['user_id']) {
            res.json({
                'success': false,
                'message': 'You\'re already logged in'
            });
            return;
        }
        // if userName and password are provided
        if (req.body.userName && req.body.password) {
            // if user credentials match our records
            User.findOne({
                    userName: req.body.userName,
                    password: req.body.password
                }, function(err, result) {
                    if (!err) {
                        console.log(result);
                        // if credential match returns a matching record
                        if (result) {
                            // login the user
                            app.Users.Add(result._id.toString(), result.userName);
                            // send him a cookie
                            //var cookieValidityAge = 60 * 60 * 1000;
                            // res.session('user_id', result._id.toString(), {
                            //     maxAge: cookieValidityAge
                            // });
                            req.session["user_id"] = result._id.toString();
                            res.json({
                                success: true,
                                route: "/"
                            });
                        }
                        else{
                            // tell him credentials do not match
                            res.json({
                                success: false,
                                message: "Invalid user name or password"
                            });
                        }
                    } else {
                        console.log(err);
                        res.json({
                            success: false,
                            message: err.err
                        });
                    }
                });
        } else {
            // tell him userName and password are required
            res.json({
                success: false,
                message: "Both user name and password are required for login"
            });
        }
    });

    app.get('/signup', function(req, res) {
        res.sendFile(path.join(__dirname, '../../web/views', 'signup.html'));
    });

    app.post('/signup', function(req, res) {
        delete req.session['user'];
        if (req.body.userName && req.body.password) {
            // Check for uniqueness of userName
            app.Users.IsUnique(req.body.userName, function(err, result){
                if (!err) {
                    // If userName is not in use
                    if(result){
                        // Signup the user
                        app.Users.Signup(req.body.userName, req.body.password);
                        res.json({
                            success: true,
                            route: "/"
                        });
                    }
                    else{
                        res.json({
                            success: false,
                            message: "Username is already in use. Please try again with a different username"
                        });
                    }
                }
                else{
                    // TODO: Handle and log db errors in a better way
                    res.json({
                            success: false,
                            message: err
                    })
                }
            });
        } else {
            res.json({
                success: false,
                message: "You must provide Username and Password in order to register"
            });
        }
    });

    app.get('/logout', function(req, res) {
        req.session.destroy();
        // Take him to login
        res.redirect('/login');
    });
}