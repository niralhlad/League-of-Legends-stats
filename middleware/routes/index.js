const express = require('express');
const LatestMatchesRoute = require('./LatestMatchesData.rest.js');

/**
 * @description Router class to load all routes of the application
 */

class Router{
    /**
     * load all routes for the application
     * @param {*} app
     */
    load(app){
        let router = express.Router( { mergeParams : true } );

        //get latest matches data routes
        let latestMatchesRoute = new LatestMatchesRoute();
        latestMatchesRoute.loadRoutes(router);

        //url base
        app.use('/api', router);

        //handle all other invalid api calls
        app.all('*', function (req, res) {
            res.statusCode = 404;
            res.json(
                {
                    status: "Error",
                    message : "NOT FOUND"
                }
            );
        });
    }
}

module.exports = Router;