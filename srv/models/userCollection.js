var HashMap = require('hashmap');
var MongoClient = require('mongodb').MongoClient;
var User = require('./userModel.js');

function Users() {
    var userMap = new HashMap();

    this.Add = function(userId, userName) {
        userMap.set(userId, new User(userName));
    };

    this.Signup = function(userName, password) {
        MongoClient.connect(config.mongodbUrl, function(err, db) {
            db.collection("UserCollection").insert({
                userName: userName,
                password: password
            }, function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(result);
                    addUser(result.insertedIds[0].toString(), userName);
                }
                db.close();
            });

        });
    };

    this.IsUnique = function(userName, callback) {
        return MongoClient.connect(config.mongodbUrl, function(err, db) {
            db.collection('UserCollection').count({
                userName: userName
            }, function(err, result) {
                db.close();
                var isUsernameUnique = (result == 0);
                if (typeof callback === "function")
                    callback(err, isUsernameUnique);
            });
        });
    };

    this.GetAll = function() {
        var users = [];
        userMap.forEach(function(value, key) {
            users.push({
                userId: key,
                userName: value.userName
            });
        });
        return users;
    };

    this.GetByCookie = function(cookie) {
        cookie = headerCookie.parse(cookie);
        return getByUserId(cookie.user_id);
    };

    this.GetByUserId = function(userId) {
        var user = userMap.get(userId);
        if (user)
            user.userId = userId;
        return user;
    };
};

module.exports = Users;