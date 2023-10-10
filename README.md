# Yi Bot for LOL / Music / and more!
A discord bot for League of Legends lookup, music playing, and more!

Usefull links:
 - [Discord.js](https://discord.js.org/#/) <br/>
 - [Discord Developer Portal](https://discord.com/developers/docs/intro) <br/>
 - [Riot's API](https://developer.riotgames.com) <br/>
 - [discord-player](https://discord-player.js.org/) <br/>

## A Quick Guide
A **.env** file is required in order to run the bot locally. It needs to look like the following:
```
BOT_TOKEN = #YOUR DISCORD BOT TOKEN
RIOT_KEY = #YOUR RIOT API KEY
```
After adding the bot to the server, it can be launched with:
```
node index.js
```

## Overview
### The bot supports the following commands: Type ```!guide``` for details<br/>
## League of Legends Commands
``` !lol rank #playerName ``` <br/>
Displays the current ranked status of the given summoner (ranked solo/duo, and flex). <br/><br/>
<img src="https://github.com/StevenWu2001/Discord-Bot-for-LOL/blob/main/img/demo/showRank1.png" width = "300">
<img src="https://github.com/StevenWu2001/Discord-Bot-for-LOL/blob/main/img/demo/showRank2.png" width = "306"> <br/><br/>
``` !lol match SUMMONER_NAME NUMBER_OF_MATCHES (optional, default 5, max 20) ``` <br/>
Displays the recent match history (up to 20) <br/><br/>
<img src="https://github.com/StevenWu2001/Yi-Bot/blob/main/img/demo/match1.png" width = "300"> <br/><br/>
Afterwards, you can select a particular match from the dropdown menu to show the match details <br/><br/>
``` !lol mastery #playerName ``` <br/>
Displays the top 10 highest mastery points champions of the given summoner (In descending order). <br/><br/>
<img src="https://github.com/StevenWu2001/Discord-Bot-for-LOL/blob/main/img/demo/mastery1.png" width = "300"> <br/><br/>
``` !lol freerotation ``` <br/>
Displays the current week's free rotation champions, including free rotations for players under level 10 <br/><br/>
<img src="https://github.com/StevenWu2001/Discord-Bot-for-LOL/blob/main/img/demo/freerotation1.png" width = "300">

``` !lol freerotation ``` <br/>
Displays the current week's free rotation champions, including free rotations for players under level 10 <br/><br/>
<img src="https://github.com/StevenWu2001/Discord-Bot-for-LOL/blob/main/img/demo/freerotation1.png" width = "300">

## Music Commands

