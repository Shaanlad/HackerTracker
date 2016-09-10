var HashMap = require('hashmap');
var User = require('./userModel.js');

function Users() {
    var userMap = new HashMap();

    this.Add = function(userId, user) {
        userMap.set(userId, user);
    };

    this.Signup = function(userName, password) {
        var user = new User();
        user.userName = userName;
        user.password = password;
        user.save(function(err,result) {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
                this.Add(result._id.toString(), result);
            }
        })
    };

    this.IsUnique = function(userName, callback) {
        return User.count({userName: userName}, function (err, result) {
            var isUsernameUnique = (result == 0);
            if (typeof callback === "function")
                callback(err, isUsernameUnique);
        })
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