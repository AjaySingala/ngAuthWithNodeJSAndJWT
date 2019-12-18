// Creates an express server.
const express = require('express');
// The cors middleware allows the server to respond to Cross-Origin Requests. 
const cors = require('cors');
// Body-parser is needed to parse the HTTP request body and create an 
// object that is attached to the request data. 
const bodyParser = require('body-parser');
// express-bearer-token extracts a bearer token from the request header 
// and makes it available through the request object.
const bearerToken = require('express-bearer-token');
const profile = require('./profile');

const port = process.env.PORT || 10101;
const app = express()
    .use(cors())
    .use(bodyParser.json())
    .use(bearerToken());

app.use('/', profile);
app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
});