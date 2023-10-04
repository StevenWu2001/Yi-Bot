const summonerSearchLink = 'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/';
const masterySearchLink = 'https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/';
const accountInfoLink = 'https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/';
const freeRotationLink = 'https://na1.api.riotgames.com/lol/platform/v3/champion-rotations'
const matchHistoryLink = 'https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/'
const matchLookupLink = 'https://americas.api.riotgames.com/lol/match/v5/matches/'

const utf8 = require('utf8');
const riotKey = 'api_key=' + process.env.RIOT_KEY;
const { DiscordAPIError } = require("discord.js");
const fetch = require("node-fetch");
const Discord = require('discord.js');
const { AttachmentBuilder, EmbedBuilder, Client } = require('discord.js');

// Initialize Client
const client = new Discord.Client();
var emojiList = []
client
.on('ready', () =>{
    emojiList = client.emojis
    client.user.setActivity("Master Yi", {type: "PLAYING"})
}
)
.login(process.env.BOT_TOKEN);

// Ranked Emblem Conversion
const rankedEmblem = {
    0: 'https://github.com/StevenWu2001/Yi-Bot/blob/main/img/rankEmblems/emblem-iron.png?raw=true',
    1: 'https://github.com/StevenWu2001/Yi-Bot/blob/main/img/rankEmblems/emblem-bronze.png?raw=true',
    2: 'https://github.com/StevenWu2001/Yi-Bot/blob/main/img/rankEmblems/emblem-silver.png?raw=true',
    3: 'https://github.com/StevenWu2001/Yi-Bot/blob/main/img/rankEmblems/emblem-gold.png?raw=true',
    4: 'https://github.com/StevenWu2001/Yi-Bot/blob/main/img/rankEmblems/emblem-platinum.png?raw=true',
    5: 'https://github.com/StevenWu2001/Yi-Bot/blob/main/img/rankEmblems/Emblem_Emerald.png?raw=true',
    6: 'https://github.com/StevenWu2001/Yi-Bot/blob/main/img/rankEmblems/emblem-diamond.png?raw=true',
    7: 'https://github.com/StevenWu2001/Yi-Bot/blob/main/img/rankEmblems/emblem-master.png?raw=true',
    8: 'https://github.com/StevenWu2001/Yi-Bot/blob/main/img/rankEmblems/emblem-grandmaster.png?raw=true',
    9: 'https://github.com/StevenWu2001/Yi-Bot/blob/main/img/rankEmblems/emblem-challenger.png?raw=true'
};

const rankedConvert = {
    "IRON": 0,
    "BRONZE": 1,
    "SILVER": 2,
    "GOLD": 3,
    "PLATINUM": 4,
    "EMERALD": 5,
    "DIAMOND": 6,
    "MASTER": 7,
    "GRANDMASTER": 8,
    "CHALLENGER": 9
}

const numsToRank = {
    0: "IRON",
    1: "BRONZE",
    2: "SILVER",
    3: "GOLD",
    4: "PLATINUM",
    5: "EMERALD",
    6: "DIAMOND",
    7: "MASTER",
    8: "GRANDMASTER",
    9: "CHALLENGER"
}

// Convert from queue ID to match type
const queueIDConvert = {
    400: "Draft Pick",
    420: "Ranked Solo/Duo",
    430: "Blind Pick",
    440: "Ranked Flex",
    450: "ARAM",
    830: "Intro Bot",
    840: "Beginner Bot",
    850: "Intermediate Bot",
    900: "URF",
    1010: "URF",
    1900: "URF"
}

const positionConvert = {
    'TOP': 'Top',
    'MIDDLE': 'Mid',
    'JUNGLE': 'Jungle',
    'BOTTOM': 'Bot',
    'SUPPORT': 'Sup'
}

inUse = false;

// Command Process
module.exports = {
    // show lol rank #name
    // show lol mastery #name
    // show lol freerotation
    // show lol match #name
    name: 'lol',
    description: 'A show command',
    async execute(message, args) {

        if (inUse) {
            return message.channel.send(`${message.author} A command is currently running...`)
        };
        inUse = true;

        var split = message.content.split(' ')
        var summonerName = '';
        var encryptedID = '';          // Summoner ID
        var accountID = '';
        var summonerLevel = '';
        var puuid = '';
        var iconID = '';
        var numOfMatch = 5;
        
        if (!isNaN(split[split.length - 1])) {
            numOfMatch = Math.min(parseInt(split[split.length - 1]), 20);
            split.pop();
        }

        // Champion ID lookup table
        const IDResponse = await fetch('http://ddragon.leagueoflegends.com/cdn/11.11.1/data/en_US/champion.json')
        const IDTable = await IDResponse.json();
        

        for (var i = 2; i < split.length; i++) {
            summonerName += split[i] + '%20';
        }
        summonerName = utf8.encode(summonerName);
        const link = summonerSearchLink + summonerName + '?' + riotKey;
        const response = await fetch(link);
        let summonerData = await response.json();
        if (summonerData.hasOwnProperty('status') && summonerData.status.status_code == 404) {
            message.channel.send("This summoner name cannot be found!");
            return;
        }

        encryptedID = summonerData.id;
        summonerName = summonerData.name;
        summonerLevel = summonerData.summonerLevel;
        accountID = summonerData.accountId;
        puuid = summonerData.puuid
        iconID = summonerData.profileIconId;


        // Champion Mastery Lookup
        if (split[1] == 'mastery') {
            var masteries = [];
            var names = [];
            const masteryLink = masterySearchLink + encryptedID + '?' + riotKey;
            const masteryResponse = await fetch(masteryLink);
            let masteryData = await masteryResponse.json();

            // Parse out mastery level, mastery points, and champion names
            for (var i = 0; i < 10; i++) {
                var id = masteryData[i].championId;
                var points = masteryData[i].championPoints;
                var level = masteryData[i].championLevel;
                var champName = '';
                var m = '';
                var n = '';
                for (const key in IDTable.data) {
                    if (IDTable.data[key].key == id) {
                        champName = IDTable.data[key].id;
                        n = champName;
                        m = 'Mastery Level: ' + level + ',     Mastery Points: ' + points;
                        masteries.push(m);
                        names.push(n);
                    }
                }
            }

            const masteryEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Summoner Champion Mastery Summary for `' + summonerName + '`')
                .setDescription('Top 10 Highest Mastery Champions')
                .addFields(
                    { name: '1: `' + names[0] + '`', value: masteries[0] },
                    { name: '2: `' + names[1] + '`', value: masteries[1] },
                    { name: '3: `' + names[2] + '`', value: masteries[2] },
                    { name: '4: `' + names[3] + '`', value: masteries[3] },
                    { name: '5: `' + names[4] + '`', value: masteries[4] },
                    { name: '6: `' + names[5] + '`', value: masteries[5] },
                    { name: '7: `' + names[6] + '`', value: masteries[6] },
                    { name: '8: `' + names[7] + '`', value: masteries[7] },
                    { name: '9: `' + names[8] + '`', value: masteries[8] },
                    { name: '10:  `' + names[9] + '`', value: masteries[9] },
                )
            message.channel.send(masteryEmbed);
        } else if (split[1] == 'rank') { // Player Rank Lookup (Solo and Flex)
            const rankLink = accountInfoLink + encryptedID + '?' + riotKey;
            const accountResponse = await fetch(rankLink);
            let accountData = await accountResponse.json();
            console.log(accountData);
            const rankEmbed = new Discord.MessageEmbed();
            var highestRank = -1;

            // Unranked Account
            if (accountData.length == 0) {
                rankEmbed.setColor('#0099ff');
                rankEmbed.setTitle('Rank Summary for ' + summonerName);
                rankEmbed.setDescription('Summoner Level: `' + summonerLevel + '`\nThis Player is Currently Unranked');
            } else {
                // Parse first ranked queue
                var queueType = '';
                if (accountData[0].queueType == 'RANKED_SOLO_5x5') {
                    queueType = 'Ranked Solo/Duo';
                } else {
                    queueType = 'Ranked Flex 5x5'
                }

                highestRank = Math.max(highestRank, rankedConvert[accountData[0].tier]);
                var rankTier = accountData[0].tier + '  ' + accountData[0].rank + '  ' + accountData[0].leaguePoints + " LP.";
                var win = accountData[0].wins;
                var lose = accountData[0].losses;
                var winRate = Math.round(win / (win + lose) * 1000) / 10;
                var WRData = 'Wins: `' + win + '`  Losses: `' + lose + '`  Winrate: `' + winRate + '%`';

                rankEmbed.setColor('#0099ff');
                rankEmbed.setTitle(summonerName);
                rankEmbed.setDescription('Summoner Level: `' + summonerLevel + '`');
                rankEmbed.addFields(
                    { name: queueType + ': ' + rankTier, value: WRData },
                );
                rankEmbed.setThumbnail('https://raw.githubusercontent.com/StevenWu2001/Discord-Bot-for-LOL/main/img/rankEmblems/Emblem_Grandmaster.png');

                // Check Ranked Promotion Series
                if (accountData[0].hasOwnProperty('miniSeries')) {
                    var progress = accountData[0].miniSeries.progress;
                    var progressStr = '';
                    var nextRank = numsToRank[rankedConvert[accountData[0].tier] + 1];
                    for (var c in progress) {
                        if (progress[c] == 'L') {
                            progressStr += ':x:   ';
                        } else if (progress[c] == 'W') {
                            progressStr += ':o:   ';
                        } else {
                            progressStr += ':question:   ';
                        }
                    }

                    rankEmbed.addField('``' + summonerName + ' is on his promotion to ' + nextRank + '`` ', progressStr);
                }

                // Parse second ranked queue (if exist)
                if (accountData.length == 2) {
                    if (accountData[1].queueType == 'RANKED_SOLO_5x5') {
                        queueType = 'Ranked Solo/Duo';
                    } else {
                        queueType = 'Ranked Flex 5x5'
                    }

                    highestRank = Math.max(highestRank, rankedConvert[accountData[1].tier]);
                    var rankTier = accountData[1].tier + '  ' + accountData[1].rank + '  ' + accountData[1].leaguePoints + " LP.";
                    var win = accountData[1].wins;
                    var lose = accountData[1].losses;
                    var winRate = Math.round(win / (win + lose) * 1000) / 10;
                    var WRData = 'Wins: `' + win + '`  Losses: `' + lose + '`  ' + 'Winrate: `' + winRate + '%`';

                    rankEmbed.addFields(
                        { name: queueType + ':  ' + rankTier, value: WRData },
                    );

                    // Check Ranked Promotion Series
                    if (accountData[1].hasOwnProperty('miniSeries')) {
                        var progress = accountData[1].miniSeries.progress;
                        var progressStr = '';
                        var nextRank = numsToRank[rankedConvert[accountData[1].tier] + 1];
                        for (var c in progress) {
                            if (progress[c] == 'L') {
                                progressStr += ':x:   ';
                            } else if (progress[c] == 'W') {
                                progressStr += ':o:   ';
                            } else {
                                progressStr += ':question:   ';
                            }
                        }

                        rankEmbed.addField('``' + summonerName + ' is on his promotion to ' + nextRank + '`` ', progressStr);
                    }
                }

            }

            if (highestRank != -1) {
                rankEmbed.setThumbnail(rankedEmblem[highestRank]);
            }
            
            // Send to chat
            message.channel.send(`${message.author}!`);
            message.channel.send(rankEmbed);
        } else if (split[1] == 'freerotation') {
            freeChamps = [];
            freeChampsStr = '';
            freeChampsForNew = [];
            freeChampsForNewStr = '';

            freeRotationEmbed = new Discord.MessageEmbed();
            freeRotationEmbed.setColor("#0099ff");
            freeRotationEmbed.setTitle("This Week's Champion Free Rotation:");

            const freeChampLink = freeRotationLink + '?' + riotKey;
            const freeChampResponse = await fetch(freeChampLink);
            let champ = await freeChampResponse.json();

            freeChamps = champ.freeChampionIds;
            freeChampsForNew = champ.freeChampionIdsForNewPlayers;

            var i = 1;
            for (const id in freeChamps) {
                for (const key in IDTable.data) {
                    if (IDTable.data[key].key == freeChamps[id]) {
                        freeChampsStr += i++ + ': ' + IDTable.data[key].id + '\n';
                    }
                }
            }
            i = 1;
            for (const id in freeChampsForNew) {
                for (const key in IDTable.data) {
                    if (IDTable.data[key].key == freeChampsForNew[id]) {
                        freeChampsForNewStr += i++ + ': ' + IDTable.data[key].id + '\n';
                    }
                }
            }

            freeRotationEmbed.addFields(
                { name: 'Free Champions: ', value: freeChampsStr, inline: true },
                { name: 'Free Rotation For Players Under lv 10: ', value: freeChampsForNewStr, inline: true }
            );
            
            message.channel.send(freeRotationEmbed);

        } else if (split[1] == 'match') {
            message.channel.send("Fetching match history...")
            // W or L
            // Champ played
            // Type of game
            matchEmbed = new Discord.MessageEmbed();
            matchEmbed.setColor("#0099ff");
            
            console.log(split)
            const link = matchHistoryLink + puuid + '/ids?start=0&count=' + numOfMatch + '&' + riotKey;
            const response = await fetch(link);
            let matchidList = await response.json();

            var totalDeaths = 0;
            var totalKills = 0;
            var totalAssists = 0;
            var totalWins = 0;
            var totalLosses = 0;

            console.log(matchidList)
            for (const matchid in matchidList) {
                
                // Match Info
                var win = false;
                var champPlayed = "";
                var champId = "";
                var gameType = "";
                var kill = 0;
                var death = 0;
                var assist = 0;
                var kda = "";
                var position = "";
                var gameDuration = "";
                let minions = 0;
                let camps = 0;
                let csPerMin = 0.0;             

                // An individual report based on position the player played
                let individualReport = "";

                var matchlink = matchLookupLink + matchidList[matchid] + '?' + riotKey;
                const matchResponse = await fetch(matchlink);
                let matchData = await matchResponse.json();
                
                gameType = queueIDConvert[matchData['info']['queueId']];
                if (gameType == null) {
                    gameType = 'Other';
                }

                let durationSec = matchData['info']['gameDuration']
                let hours = Math.floor(durationSec / 3600);
                durationSec %= 3600
                let minutes = Math.floor(durationSec / 60);
                let seconds = durationSec % 60;
                
                if (hours != 0) {
                    gameDuration += hours + ":";
                }
                if (minutes != 0) {
                    gameDuration += minutes + ':';
                } else {
                    gameDuration += '00:';
                }
                if (seconds != 0) {
                    gameDuration += seconds;
                } else {
                    gameDuration += '00';
                }

                for (const i in matchData['info']['participants']) {
                    if (matchData['info']['participants'][i]['puuid'] == puuid) {
                        const data = matchData['info']['participants'][i];
                        win = data['win'];
                        champPlayed = data['championName'];
                        champId = data['championId'];
                        kill = data['kills'];
                        death = data['deaths'];
                        assist = data['assists'];
                        position = data['teamPosition']
                        minions = data['totalMinionsKilled'];
                        camps = data['neutralMinionsKilled'];
                        csPerMin = Math.round(((minions + camps) / matchData['info']['gameDuration']) * 600) / 10; 

                        kda = kill + '/' + death + '/' + assist;
                        totalKills += kill;
                        totalDeaths += death;
                        totalAssists += assist;
                        
                        if (win) {
                            totalWins++;
                        } else {
                            totalLosses++;
                        }

                        if (position == 'TOP') {

                        } else if (position == 'JUNGLE') {
                            // let minions = data['totalMinionsKilled'];
                            // let camps = data['neutralMinionsKilled'];
                            // let csPerMin = Math.round(((minions + camps) / matchData['info']['gameDuration']) * 600) / 10;
                            // individualReport += '`' + (minions + camps) + ' CS(' + csPerMin + ')`  ';

                            // let dragon = data['dragonKills'];
                            // let baron = data['baronKills'];
                            // individualReport += '`' + dragon + '` dragons ' + '`' + baron + '` barons.';

                        } else if (position == 'MIDDLE') {

                        } else if (position == 'BOTTOM') {

                        } else if (position == 'SUPPORT') {

                        }

                        break;
                    }
                }

                if (position in positionConvert) {
                    position = '(' + positionConvert[position] + ')';
                }

                champIcon = '<:pic' + champId + ':' + client.emojis.cache.find(emoji => emoji.name === "pic" + champId) + '>';

                let totalCS = ' `' + (minions + camps) + '(' + csPerMin + ')`';
                var matchSummary = (win ? ':white_check_mark:' : ':x:') + '`' + gameDuration + '`' + ' `' + kda + '` ' + totalCS + ' ' + champPlayed + champIcon + ' (Troll)';
                matchEmbed.addFields(
                    {name: (parseInt(matchid) + 1) + '. ' + gameType + ' ' + position, value: matchSummary},
                );
            }
            
            var avgKda = Math.round(((totalKills + totalAssists) / totalDeaths) * 100) / 100;
            var winrate = Math.round(totalWins / (totalWins + totalLosses) * 100) / 100;
            matchEmbed.setThumbnail('http://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/' + iconID + '.png');
            matchEmbed.setTitle('Recent ' + (totalWins + totalLosses) + ' Match(es) for ```' + summonerName + '```');
            matchEmbed.setDescription('Average KDA: `' + avgKda + '` Winrate: `' + winrate + '`')
            
            // Send to chat
            message.channel.send(`${message.author}!`);
            message.channel.send(matchEmbed);
        } else {
            message.channel.send("The given parameters are invalid. Use !guide for more information.");
        }
        
        inUse = false;
    },
};