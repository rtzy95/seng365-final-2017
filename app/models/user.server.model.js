const db = require('../../config/db.js');
const crypto = require('crypto');

exports.getAll = function (done) {
    db.get().query('SELECT * FROM cf_users', function (err, rows) {
        if (err) return done({"ERROR": "Error selecting"});

        return done(rows);
    });
};

// done
exports.getOne = function (userId, done) {
    db.get().query('SELECT user_id as id, username, location, email FROM cf_users WHERE user_id=?', userId, function (err, rows) {
        if (err) { console.log(err); return done("error") }
        done(rows);
    });
};

// done
exports.insertUser = function (user, password, done) {
    let id = user['id'];  // auto-generate
    let username = user['username'].toString();
    let location = user['location'].toString();
    let email = user['email'].toString();

    let values = [username, location, email, password];

    db.get().query('SELECT username FROM cf_users WHERE username=?', username, function (err, find_unique_username_result) {
        if (err) return done("error");
        if (find_unique_username_result.length > 0) {
            return done("error");
        } else {
            db.get().query('INSERT INTO cf_users (username, location, email, password) VALUES (?, ?, ?, ?)', values, function (err, result) {
                if (err) return done("error");
                if (result.affectedRows === 1) {
                    return done(result.insertId);
                } else {
                    return done("error");
                }
            });
        }
    });
};

// done
exports.login = function (user_details, done) {
    let username = user_details['username'].toString();
    let password = user_details['password'].toString();

    let values = [username, password];
    db.get().query('SELECT COUNT(*) AS count, user_id as id FROM cf_users WHERE username=? and password=?', values, function (err, result) {
        if (err || result[0].count !== 1) {
            return done("error")
        }
        else {
            let user_id = Number(result[0].id);

            let token = crypto.randomBytes(64).toString('hex');
            let update_token_query = "INSERT INTO cf_tokens (user_id, token, expiry) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR)) ON DUPLICATE KEY UPDATE expiry=DATE_ADD(NOW(), INTERVAL 24 HOUR)";
            let token_values = [user_id, token];
            db.get().query(update_token_query, token_values, function (err, token_insert) {
                if (err) return done("error");
                else {
                    db.get().query('SELECT token FROM cf_tokens WHERE user_id=?', user_id, function (err, token_result) {
                        if (err) return done("error");
                        return done({"id": user_id, "token": token_result[0].token})
                    })
                }
            });
        }
    });
};

// done
exports.updateUser = function (update_data, done) {
    let id = update_data['user']['id'];
    let username = update_data['user']['username'].toString();
    let location = update_data['user']['location'].toString();
    let email = update_data['user']['email'].toString();
    let password = update_data['password'].toString();


    db.get().query('SELECT COUNT(*) AS count FROM cf_users WHERE user_id=?', id, function (err, check_user_result) {
        if (err) { console.log(err); return done("error"); }
        if (check_user_result[0].count < 1) return done("not found");
        else {
            let values = [username, location, email, password, id];
            db.get().query('UPDATE cf_users SET username=?, location=?, email=?, password=? WHERE user_id=?', values, function (err, update_result) {
                if (err) { console.log(err); return done("error"); }
                if (update_result.affectedRows === 1) {
                    return done("ok")
                } else {
                    return done("error");
                }
            });
        }
    });
};

// assume
exports.deleteUser = function (user_id, done) {
    db.get().query('SELECT user_id FROM cf_users WHERE user_id=?', user_id, function (err, check_user_result) {
        if (err) return done("result");
        if (check_user_result.length < 1) {
            return done("User not found")
        }
    });

    db.get().query('DELETE FROM cf_users WHERE user_id=?', user_id, function (err, delete_result) {
        if (err) return done("error");
        if (delete_result.affectedRows === 1) {
            return done("ok")
        } else {
            return done("error")
        }
    })
};