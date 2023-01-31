const LatestMatchesService = require('../services/LatestMatchesService');

/**
 * @description The Application Class loads express app and its configurations.
 */

class LatestMatchesDataRoutes{
    loadRoutes(app){

        /**
         * @api {get} /api/:summoner_name to get match details of summonerName
         * @apiName Get latest match details
         * @apiDescription It will get match details for the summoner's name from Riot server
         * 
         * @apiSuccessExample {json} SuccessResponse
         * {
                data : [
                    {
                        gameDuration: 2153,
                        win: true,
                        summonerName: 'summonerName',
                        championName: 'championName',
                        kills: 5,
                        deaths: 6,
                        assists: 28,
                        champLevel: 16,
                        totalMinionsKilled: 39,
                        perks: [ 5001, 5007, 5002 ],
                        spells: [ 44, 51, 61, 26 ]
                    },
                    {
                        gameDuration: 2107,
                        win: false,
                        summonerName: 'summonerName',
                        championName: 'championName',
                        kills: 3,
                        deaths: 6,
                        assists: 7,
                        champLevel: 16,
                        totalMinionsKilled: 178,
                        perks: [ 5003, 5007, 5003 ],
                        spells: [ 195, 24, 88, 12 ]
                    },
                    {
                        gameDuration: 203,
                        win: false,
                        summonerName: 'summonerName',
                        championName: 'championName',
                        kills: 0,
                        deaths: 0,
                        assists: 0,
                        champLevel: 3,
                        totalMinionsKilled: 15,
                        perks: [ 5003, 5007, 5003 ],
                        spells: [ 9, 0, 0, 0 ]
                    },
                    {
                        gameDuration: 1344,
                        win: true,
                        summonerName: 'summonerName',
                        championName: 'championName',
                        kills: 2,
                        deaths: 0,
                        assists: 4,
                        champLevel: 12,
                        totalMinionsKilled: 139,
                        perks: [ 5002, 5008, 5008 ],
                        spells: [ 81, 44, 37, 13 ]
                    },
                    {
                        gameDuration: 2438,
                        win: true,
                        summonerName: 'summonerName',
                        championName: 'championName',
                        kills: 3,
                        deaths: 8,
                        assists: 7,
                        champLevel: 18,
                        totalMinionsKilled: 230,
                        perks: [ 5001, 5007, 5008 ],
                        spells: [ 397, 221, 108, 14 ]
                    }
                ],
                status: "success",
                custom_code : "DATA_FETCH_SUCCESSFUL"
            }
         *@apiError Internal Server Error
         *  {
                status: "Error",
                message: "Internal Server Error"
            }
         *@apiError Summoner not found
         *  {
                status: { 
                    message: 'Data not found - summoner not found', 
                    status_code: 404 
                },
                custom_message: 'error'
            }
         */
        app.get('/:summoner_name', (req,res) => {
            let summonerName = req.params.summoner_name.split(':')[1];
            console.log(`-------/:${summonerName}--------`);

            const serviceObj = new LatestMatchesService();
            
            serviceObj.getMatchDetailsBySummonerName(summonerName).then( response =>{
                let custom_response = {
                    data : response,
                    status: {
                        message: "success",
                        status_code: 200,
                    },
                    custom_code : "DATA_FETCH_SUCCESSFUL"
                };
                console.log("Summoner Match Details Fetched Successfully: " + summonerName);
                return res.json(custom_response);
            }).catch( error => {
                console.log(error);
                console.log("Summoner Match Details Fetched Failed: " + summonerName);
                if(error.status.status_code)
                    res.statusCode = error.status.status_code;
                return res.json(error);
            });

            process.on('unhandledRejection', error => {
                console.log('unhandledRejection', error);
                res.statusCode = 500;
                return res.json(
                    {
                        status: "Error",
                        message: "Internal Server Error"
                    }
                );
            });
        });
    }
}

module.exports = LatestMatchesDataRoutes;