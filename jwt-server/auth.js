/*
    When a client attempts to access a restricted resource, 
    it needs to send the token in the request header. 
    The server then needs to authenticate the token. 
    This express middleware performs this authentication task.
*/
const nJwt = require('njwt');
var config = require('./config');

/*
    The express-bearer-token middleware which extracts the JWT token 
    from the request and places makes it available through req.token? 
    jwt.verify is used to check whether the token is valid or not. 
    This function also extracts the user ID that was stored in the token 
    and allows you to attach it to the request object.
*/
function jwtAuth(req, res, next) {
    if (!req.token) {
        return res.status(403).send({ auth: false, message: 'No token provided' });
    }

    nJwt.verify(req.token, config.secret, function(err, decoded) {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Could not authenticate token' });
        }
        req.userId = decoded.body.id;
        next();
    });
}

module.exports = jwtAuth;