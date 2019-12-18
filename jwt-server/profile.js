const nJwt = require('njwt');
const config = require('./config');
const express = require('express');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
//const db = new sqlite3.Database(':memory:');
const db = new sqlite3.Database('./db/users.db');

// Create the table.
db.serialize(() => {
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, email TEXT, password TEXT)");
});

const router = express.Router();

// Route for "register".
/*
    When a user registers, their password is hashed using the bcryptjs library. 
    Only the hashed password is stored in the database. 
    On success, the server responds with an ok status.
*/
router.post('/register', function(req, res) {
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    db.run("INSERT INTO users (name, email, password) " +
        "VALUES (?, ?, ?)", req.body.name, req.body.email, hashedPassword,
        function(err) {
            if (err) return res.status(500).send("An error occurred during registration");
            res.status(200).send({ status: 'ok' });
        });
});

// Route for "login".
/*
    Once a user is registered they need to be able to log on.
    This can be done in a separate route /login. 
    This is where we start using JSON Web Tokens.
*/
/*
    This route expects two parameters, email and password. 
    The first step is to search in the database for the user’s email and 
    obtain the user’s record.
    Then, bcrypt is used to compare the user’s password to the hashed password. 
    If successful, a jwt is used to create a token that stores the user’s ID. 
    The token is then sent back to the client in the response.
*/
router.post('/login', function(req, res) {
    db.get("SELECT id, name, email, password FROM users " +
        "WHERE email=?", req.body.email,
        function(err, user) {
            if (err) return res.status(500).send({ status: 'Server error', err: err });
            if (!user) return res.status(404).send('User not found');
            if (!bcrypt.compareSync(req.body.password, user.password)) {
                return res.status(401).send({ auth: false, token: null });
            }

            var jwt = nJwt.create({ id: user.id }, config.secret);
            jwt.setExpiration(new Date().getTime() + (24 * 60 * 60 * 1000));
            res.status(200).send({ auth: true, token: jwt.compact() });
        });

});

// Route for "profile".
/*
    The /profile route simply returns the user’s profile information. 
    See how the jwtAuth function is added to the /profile route as middleware. 
    This protects the route. 
    It also allows the handler callback to use the req.userId property 
    to look up the user from the database.
*/
const jwtAuth = require('./auth');
router.get('/profile', jwtAuth, function(req, res, next) {
    db.get("SELECT id, name, email FROM users WHERE id=?", req.userId, function(err, user) {
        if (err) {
            return res.status(500).send("There was a problem finding the user.");
        }
        if (!user) {
            return res.status(404).send("No user found.");
        }
        res.status(200).send(user);
    });
});

module.exports = router;