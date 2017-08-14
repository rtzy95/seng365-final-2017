const mysql = require('mysql');

const state = {
    pool: null
};

exports.connect = function(done) {
    state.pool = mysql.createPool({
        // host: process.env.SENG365_MYSQL_HOST || 'localhost',
        // port: process.env.SENG365_MYSQL_PORT || 6033,
        // user: 'root',
        // database: "mysql",
        host: 'localhost',
        port: '6033',
        user: 'root',
        password: "secret",
        multipleStatements: true
    });
    done();
};

exports.get = function() {
    return state.pool;
};

// exports.changeDb = function (db) {
//     state.pool.changeUser({database: db}, function (err) {
//         if (err) console.log(err)
//     });
// };