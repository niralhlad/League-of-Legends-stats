const express = require('express');
const cors = require('cors');
const config = require('./config');

//Custom imports.
const Routes = require('./routes');

//set cors origin
const corsOptions = {
    origin: config.ORIGIN_URL + ":" + config.ORIGIN_PORT
}

//create instance of Route
const routes = new Routes();

//create an express app
const app = express();

//set cors and load routes into app
app.use(cors(corsOptions));
routes.load(app);

//start the server
let server = app.listen(config.SERVER_PORT, () => {
    let host = server.address().address;
    let port = server.address().port;
    console.log('app listening at http://%s%s', host, port);
});