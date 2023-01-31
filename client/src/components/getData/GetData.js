import React, {useState} from 'react';
import axios from 'axios';
import './GetData.css';
const config = require('../../config.js');

//import static values
const spellStatic = require('../../staticData/spell.json');
const itemStatic = require('../../staticData/item.json');

/**
 * This will render the main component of the client which accepts summoner's name and renders on submit the data or any related error. 
 * @returns The result of all matches that is rendered on the homepage
 */
function GetData() {
  const [Matches, setMatches] = useState([]);
  const [name, setName] = useState([]);
  const [status, setStatus] = useState([]);
  const [summonerName, setSummonerName] = useState([]);

  //On Submit check call middleware with the name provided and gets latest 5 match data of player.
  const handleSubmit = (event) => {
      event.preventDefault();
      
      //set all states to null
      setStatus();
      setSummonerName();
      setMatches([]);
      
      //check if name is empty or not.
      if( name.length === 0)
        setStatus(<div className='status-error'>ERROR: Name cannot be empty</div>);
      else{
        //set status to loading
        setStatus(<div className='status-loading'>Loading...</div>);
        //set summoner's name
        setSummonerName("Summoner's Name: " + name);
        
        //create request URL
        let requestURL = config.SERVER_URL + '/api/:' + name;
        
        console.log(requestURL);
        //send GET request and get data for the summoner's name
        axios.get(requestURL)
        .then( (res) => {
          console.log(res);
          if(res){
            //check if response has no match data
            if(res.data.data.length === 0)
              setStatus(<div className='status-error'>ERROR: No match data found for the Summoner</div>)
            else{        
              //set the response data to be used when rendering     
              setMatches(res.data.data);
              setStatus();
            }
          }
          else{
            //if no response from server
            setStatus(<div className='status-error'>No data from the server</div>)
          }
          
        })
        .catch((err) => {
          console.log(err);
          setMatches([]);
          //if server is down
          if(err.name && err.name === "AxiosError"){
             if(err.code){
              if(err.code === "ERR_NETWORK")
                setStatus(<div className='status-error'>ERROR : "Not able to connect with server"</div>);
              if(err.code === "ERR_BAD_REQUEST")
                setStatus(<div className='status-error'>ERROR : "Bad Request"</div>);
             }
            
          }
          //print the error message from server
          else if(err && err.response && err.response.data && err.response.data.status && err.response.data.status.message){
            setStatus(<div className='status-error'>ERROR : {err.response.data.status.message}</div>);
            console.log(err);
          }
          //in case of any unhandled error
          else{
            setStatus(<div className='status-error'>ERROR : Internal Server Error</div>);
          }
        });
      }
      
  };

  //set and render the data to the browser
  return (
    <div className='div'>
      <form onSubmit={handleSubmit}>
          <input
              type="text"
              id="name"
              name="name"
              value={name}
              placeholder="Name"
              onChange={(event) =>
                setName(event.target.value)
              }
          />
          <button type="submit">Submit</button>
      </form>
      {summonerName}
      {status}
      { ( !Matches ) 
        ? (  <div className='status-error'>ERROR: Data Error</div>) 
        : ( Matches.map(  (match) => (
              <div  className={match.win ? 'div-win' : 'div-loss'} key={match.id}>
                <p className='p'> 
                  {match.win ? 'WON' : 'LOST'} | 
                  Duration: {match.gameDuration} |
                  Champion: {match.championName}
                  <br /> 
                  Kills: {match.kills} | 
                  Deaths: {match.deaths} |
                  Assists: {match.assists} |
                  KDA: { (match.KDA === 'Infinity') ? 'Perfect KDA' : (match.KDA === 'NaN' ? "Not Available" : match.KDA)} 
                  <br />
                  Total Creep Score: {match.totalMinionsKilled} | 
                  Creep Score per Minute: {match.cspm}
                  <br></br><br></br>
                  Items: { match.items.map( (item) => ( (itemStatic.data[item]) ? itemStatic.data[item].name + " | " : "" ) )}
                  <br />
                  Spells: { match.spells.map( (spell) => ( (spellStatic.data[spell]) ? spellStatic.data[spell].name + " | " : "" ) ) }
                  <br />
                  Perks: {  match.perks.map( (perk) => perk + " | " )}
                </p>
              </div>
            ) )
        )
      }
    </div>
  );
}

export default GetData;
