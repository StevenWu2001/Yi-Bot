# Yi Bot for LOL
A Discord Bot that fetches League of Legend player data from Riot API, hosted on [Heroku](https://dashboard.heroku.com/apps). It can be used as a quick way for players to check their game/rank status. This bot is programmed using node.js along with the powerfull module discord.js. <br/>
 - [Discord Developer Portal](https://discord.com/developers/docs/intro) <br/>
 - [Riot's API](https://developer.riotgames.com) <br/>
 - [Discord.js](https://discord.js.org/#/) <br/>

## A Quick Guide
A **.env** file is required in order to run the bot locally. It needs to look like the following:
```
BOTTOKEN = #YOUR DISCORD BOT TOKEN
RIOTKEY = #YOUR RIOT API KEY
OPENAI_API_KEY = #YOUR OPENAI API KEY
```
After adding the bot to the server, it can be launched with:
```
node index.js
```

## Overview
### The bot supports the following commands: Type ```!guide``` for more details<br/>
``` !show lol rank #playerName ``` <br/>
Displays the current ranked status of the given summoner. <br/><br/>
<img src="https://github.com/StevenWu2001/Discord-Bot-for-LOL/blob/main/img/demo/showRank1.png" width = "300">
<img src="https://github.com/StevenWu2001/Discord-Bot-for-LOL/blob/main/img/demo/showRank2.png" width = "306"> <br/><br/>
``` !lol match SUMMONER_NAME NUMBER_OF_MATCHES (optional, default 5, max 20) ``` <br/>
Displays the recent match history (up to 20) <br/><br/>
<img src="https://github.com/StevenWu2001/Yi-Bot/blob/main/img/demo/match1.png" width = "300"> <br/><br/>
``` !show lol mastery #playerName ``` <br/>
Displays the top 10 highest mastery points champions of the given summoner (In descending order). <br/><br/>
<img src="https://github.com/StevenWu2001/Discord-Bot-for-LOL/blob/main/img/demo/mastery1.png" width = "300"> <br/><br/>
``` !show lol freerotation ``` <br/>
Displays the current week's free rotation champions, including free rotations for players under level 10 <br/><br/>
<img src="https://github.com/StevenWu2001/Discord-Bot-for-LOL/blob/main/img/demo/freerotation1.png" width = "300">

``` !show lol freerotation ``` <br/>
Displays the current week's free rotation champions, including free rotations for players under level 10 <br/><br/>
<img src="https://github.com/StevenWu2001/Discord-Bot-for-LOL/blob/main/img/demo/freerotation1.png" width = "300">
