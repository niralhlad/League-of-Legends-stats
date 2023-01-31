const axios = require('axios');
const config = require('../config');
const Promise = require('bluebird');
/**
 * @description This Class will contain all functions that fetches the match data.
 */

class LatestMatchesService{

    constructor(){
        this.baseURL = config.BASE_URL;
        this.getSummonerDetailsByNameURL = config.GET_SUMMONER_DETAILS_BY_NAME_URL;
        this.getLatestMatchesURL = config.GET_LASTEST_MATCHES_BY_PUUID;
        this.getMatchDetailsbyIDURL = config.GET_MATCH_DETAILS_BY_ID;
        this.KEY = config.KEY;
    }

    /**
     * 
     * @returns headers required for the requests
     */
    header(){
        return {
            headers: {
                "X-Riot-Token": this.KEY
            }  
        }
    }

    /**
     * @description Helper generic function to get data from Riot Developer APIs
     * @param {String} param : summonerName, puuid or matchID
     * @param {String} requestName : getSummonerDetailsByName, getLatestFiveMatchIDs, getMatchDataID
     * @param {String} region : region required for the API request
     * @returns {JSON} data as per requests
     */
    async customRequest(param,requestName,region){  
        try{

            let requestURL = this.baseURL.replace('{region}',region)

            if(requestName === 'getSummonerDetailsByName')
                requestURL += this.getSummonerDetailsByNameURL.replace('{summoner_name}',param);

            if(requestName === 'getLatestFiveMatchIDs')
                requestURL += this.getLatestMatchesURL.replace('{puuid}',param);
            
            if(requestName === 'getMatchDataID')
                requestURL += this.getMatchDetailsbyIDURL.replace('{match_id}',param);

            return axios.get( requestURL, this.header() )
                                .then( (res) => {
                                    console.log("Request Success : " + requestName);
                                    return res.data;
                                })
                                .catch( (err) => {
                                    console.log("Request Failed : " + requestName);
                                    err.response.data.custom_message = "error";
                                    return err.response.data;
                                });
        }
        catch(error){
            console.log(error);
            return "ERROR";
        }
    }

    /**
     * @description This function will collect, process and send data by summonerName from server and send it to client. This also raises error.
     * @param {String} summonerName Name of the summoner
     * @returns  
     */
    async getMatchDetailsBySummonerName(summonerName){
        
        console.log("Fetching summoner puuid...");
        let playerData = await this.customRequest(summonerName,'getSummonerDetailsByName',config.ROUTING);
        
        if(playerData.custom_message === 'error'){
            console.log(playerData);
            delete playerData.custom_message;
            return Promise.reject(playerData);
        }
        let puuid = playerData.puuid;
        console.log("Fetched PUUID");
        
        console.log("Fetching summoner's lastest 5 match array...")
        let matchIDs = await this.customRequest(playerData.puuid,'getLatestFiveMatchIDs',config.REGION);
        
        if(matchIDs.custom_message === 'error'){
            delete playerData.matchIDs;
            return Promise.reject(matchIDs);
        }
        console.log("Fetched Matches Array Length: "+ matchIDs.length);
        
        let responseData = [];
        
        for(let i=0; i<matchIDs.length;i++){
            console.log("Fetching match data for match: ", (i+1));
            let matchData = await this.customRequest(matchIDs[i],'getMatchDataID',config.REGION);
            let date = new Date(null);
            date.setSeconds(matchData.info.gameDuration);
            matchData.info.participants.filter( async (participant) => { 
                let user = {};
                if(participant.puuid === puuid){
                    user.id = i;
                    user.gameDuration = date.toISOString().slice(11, 19);
                    user.win = participant.win;
                    user.summonerName = participant.summonerName;
                    user.championName = participant.championName;
                    user.kills = participant.kills;
                    user.deaths = participant.deaths;
                    user.assists = participant.assists;
                    user.champLevel = participant.champLevel;
                    user.totalMinionsKilled = participant.totalMinionsKilled;
                    user.perks = [
                        participant.perks.statPerks.defense,
                        participant.perks.statPerks.offense,
                        participant.perks.statPerks.flex
                    ];
                    user.spells = [
                        participant.spell1Casts,
                        participant.spell2Casts,
                        participant.spell3Casts,
                        participant.spell4Casts
                    ]
                    user.items = [
                        participant.item0,
                        participant.item1,
                        participant.item2,
                        participant.item3,
                        participant.item4,
                        participant.item5,
                        participant.item6
                    ]
                    user.KDA = parseFloat( (participant.kills + participant.assists)/participant.deaths).toFixed(2);
                    user.cspm = parseFloat( user.totalMinionsKilled/date.getMinutes()  ).toFixed(0);
                    responseData.push(user);
                } 
            } );
            console.log("Added match data successfully for match: ", (i+1) );
        }
        return Promise.resolve(responseData);
    }
}


module.exports = LatestMatchesService;