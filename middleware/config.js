module.exports = {
    KEY : 'RGAPI-5dde5613-1d0e-4952-8024-4fcf1fc5f1de',
    BASE_URL : 'https://{region}.api.riotgames.com',
    GET_SUMMONER_DETAILS_BY_NAME_URL : '/lol/summoner/v4/summoners/by-name/{summoner_name}',
    GET_LASTEST_MATCHES_BY_PUUID : '/lol/match/v5/matches/by-puuid/{puuid}/ids?start=0&count=5',
    GET_MATCH_DETAILS_BY_ID : '/lol/match/v5/matches/{match_id}',
    REGION: 'americas',
    ROUTING: 'br1',
    ORIGIN_URL: 'http://localhost',
    ORIGIN_PORT: 3000,
    SERVER_PORT: 3050
}