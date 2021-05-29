const summonerSearchLink = 'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/';
const masterySearchLink = 'https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/';
const accountInfoLink = 'https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/';
const matchHistorySearchLink = 'https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/';
const matchSearchLink = 'https://na1.api.riotgames.com/lol/match/v4/matches/';

const utf8 = require('utf8');
const riotKey = 'api_key=' + process.env.RIOTKEY;
const { DiscordAPIError } = require("discord.js");
const fetch = require("node-fetch");
const Discord = require('discord.js');

module.exports = {
    // show lol rank #name
    // show lol mastery #name
    // show lol playtime #name
    name: 'show',
    description: 'A show command',
    async execute(message, args) {
        var split = message.content.split(' ')
        var summonerName = '';
        var encryptedID = '';          // Summoner ID
        var accountID = '';
        var summonerLevel = '';

        for (var i = 3; i < split.length; i++) {
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
        console.log(summonerData);

        // Champion Mastery Lookup
        if (split[2] == 'mastery') {
            var masteries = [];
            var names = [];
            const masteryLink = masterySearchLink + encryptedID + '?' + riotKey;
            const masteryResponse = await fetch(masteryLink);
            let masteryData = await masteryResponse.json();
            const IDResponse = await fetch('http://ddragon.leagueoflegends.com/cdn/11.11.1/data/en_US/champion.json')
            const IDTable = await IDResponse.json();

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
                .setTitle('Summoner Champion Mastery Summary for ' + summonerName)
                .setDescription('Top 10 Highest Mastery Champions')
                .addFields(
                    { name: '1: ' + names[0], value: masteries[0] },
                    { name: '2: ' + names[1], value: masteries[1] },
                    { name: '3: ' + names[2], value: masteries[2] },
                    { name: '4: ' + names[3], value: masteries[3] },
                    { name: '5: ' + names[4], value: masteries[4] },
                    { name: '6: ' + names[5], value: masteries[5] },
                    { name: '7: ' + names[6], value: masteries[6] },
                    { name: '8: ' + names[7], value: masteries[7] },
                    { name: '9: ' + names[8], value: masteries[8] },
                    { name: '10:  ' + names[9], value: masteries[9] },
                )
            message.channel.send(masteryEmbed);
        } else if (split[2] == 'rank') { // Player Rank Lookup (Solo and Flex)
            const rankLink = accountInfoLink + encryptedID + '?' + riotKey;
            const accountResponse = await fetch(rankLink);
            let accountData = await accountResponse.json();
            const rankEmbed = new Discord.MessageEmbed();

            // Unranked Account
            if (accountData.length == 0) {
                rankEmbed.setColor('#0099ff');
                rankEmbed.setTitle('Rank Summary for ' + summonerName);
                rankEmbed.setDescription('Summoner Level: ' + summonerLevel + '\nThis Player is Currently Unranked');
            } else {
                // Parse first ranked queue
                var queueType = '';
                if (accountData[0].queueType == 'RANKED_SOLO_5x5') {
                    queueType = 'Ranked Solo/Duo';
                } else {
                    queueType = 'Ranked Flex 5x5'
                }
                var rankTier = accountData[0].tier + '  ' + accountData[0].rank + '  ' + accountData[0].leaguePoints + " LP.";
                var win = accountData[0].wins;
                var lose = accountData[0].losses;
                var winRate = Math.round(win / (win + lose) * 1000) / 10;
                var WRData = 'Wins: ' + win + '  Losses: ' + lose + '  ' + winRate + '% winrate';

                rankEmbed.setColor('#0099ff');
                rankEmbed.setTitle('Rank Summary for ' + summonerName);
                rankEmbed.setDescription('Summoner Level: ' + summonerLevel);
                rankEmbed.addFields(
                    { name: queueType + ':  ' + rankTier, value: WRData },
                );

                // Parse second ranked queue (if exist)
                if (accountData.length == 2) {
                    if (accountData[1].queueType == 'RANKED_SOLO_5x5') {
                        queueType = 'Ranked Solo/Duo';
                    } else {
                        queueType = 'Ranked Flex 5x5'
                    }

                    var rankTier = accountData[1].tier + '  ' + accountData[1].rank + '  ' + accountData[0].leaguePoints + " LP.";
                    var win = accountData[1].wins;
                    var lose = accountData[1].losses;
                    var winRate = Math.round(win / (win + lose) * 1000) / 10;
                    var WRData = 'Wins: ' + win + '  Losses: ' + lose + '  ' + winRate + '% winrate';
                    
                    rankEmbed.addFields(
                        { name: queueType + ':  ' + rankTier, value: WRData },
                    );
                }

            }
            message.channel.send(rankEmbed);
        } else if (split[2] == 'playtime') {
            message.channel.send("Searching for player match history. This might take a moment......");
            var weekTimeUnix = 604800000;
            const playTimeEmbed = new Discord.MessageEmbed();
            var currentTime = Date.now();
            var totalPlayTime = 0;

            const matchHistoryLink = matchHistorySearchLink + accountID + '?' + riotKey;
            const matchHistoryResponse = await fetch(matchHistoryLink);
            let matchHistoryData = await matchHistoryResponse.json();
            
            var matchIDs = [];
            for (var i = 0; i < matchHistoryData.matches.length; i++) {
                const matchDate = matchHistoryData.matches[i].timestamp;
                const id = matchHistoryData.matches[i].gameId;
                if (matchDate >= (currentTime - weekTimeUnix)) {
                    matchIDs.push(id);
                }
            }
            
            var aram = 0, normal = 0, ranked = 0, others = 0;
            var matchLink, matchResponse, matchData;
            for (var i = 0; i < matchIDs.length; i++) {
                matchLink = matchSearchLink + matchIDs[i] + '?' + riotKey;
                matchResponse = await fetch(matchLink);
                matchData = await matchResponse.json();
                totalPlayTime += matchData.gameDuration;
                console.log(totalPlayTime);
                if (matchData.queueId == 450) {
                    aram++;
                } else if (matchData.queueId == 400) {
                    normal++;
                } else if (matchData.queueId == 420 || matchData.queueId == 440) {
                    ranked++;
                } else {
                    others++;
                }
            }
            var hours = Math.round(totalPlayTime / 3600);
            var mins = Math.round(totalPlayTime % 3600 % 60);
            
            playTimeEmbed.setTitle('Play Time Summary for ' + summonerName);
            playTimeEmbed.setDescription(summonerName + ' has played a total of ' 
                + hours + ' hours, ' + mins + ' minutes over the past week. For a total of ' + matchIDs.length + ' games.\n\n'
                + 'This includes: ' + normal + ' normal draft games, ' + ranked + ' ranked games, ' + aram +
                 ' ARAM games, and ' + others + ' other games modes.');

            message.channel.send(playTimeEmbed);

        } else {
            message.channel.send("The given parameters are invalid. Use !guide for more information.");
        }
    },
};