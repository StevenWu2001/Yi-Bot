const summonerSearchLink = 'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/';
const masterySearchLink = 'https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/';
const accountInfoLink = 'https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/';
const freeRotationLink = 'https://na1.api.riotgames.com/lol/platform/v3/champion-rotations'

const utf8 = require('utf8');
const riotKey = 'api_key=' + process.env.RIOTKEY;
const { DiscordAPIError } = require("discord.js");
const fetch = require("node-fetch");
const Discord = require('discord.js');

// Ranked Emblem Conversion
const rankedEmblem = {
    0: 'https://raw.githubusercontent.com/StevenWu2001/Discord-Bot-for-LOL/main/img/rankEmblems/Emblem_Iron.png',
    1: 'https://raw.githubusercontent.com/StevenWu2001/Discord-Bot-for-LOL/main/img/rankEmblems/Emblem_Bronze.png',
    2: 'https://raw.githubusercontent.com/StevenWu2001/Discord-Bot-for-LOL/main/img/rankEmblems/Emblem_Silver.png',
    3: 'https://raw.githubusercontent.com/StevenWu2001/Discord-Bot-for-LOL/main/img/rankEmblems/Emblem_Gold.png',
    4: 'https://raw.githubusercontent.com/StevenWu2001/Discord-Bot-for-LOL/main/img/rankEmblems/Emblem_Platinum.png',
    5: 'https://raw.githubusercontent.com/StevenWu2001/Discord-Bot-for-LOL/main/img/rankEmblems/Emblem_Diamond.png',
    6: 'https://raw.githubusercontent.com/StevenWu2001/Discord-Bot-for-LOL/main/img/rankEmblems/Emblem_Master.png',
    7: 'https://raw.githubusercontent.com/StevenWu2001/Discord-Bot-for-LOL/main/img/rankEmblems/Emblem_Grandmaster.png',
    8: 'https://raw.githubusercontent.com/StevenWu2001/Discord-Bot-for-LOL/main/img/rankEmblems/Emblem_Challenger.png',
};

const rankedConvert = {
    "IRON": 0,
    "BRONZE": 1,
    "SILVER": 2,
    "GOLD": 3,
    "PLATINUM": 4,
    "DIAMOND": 5,
    "MASTER": 6,
    "GRANDMASTER": 7,
    "CHALLENGER": 8
}

const numsToRank = {
    0: "IRON",
    1: "BRONZE",
    2: "SILVER",
    3: "GOLD",
    4: "PLATINUM",
    5: "DIAMOND",
    6: "MASTER",
    7: "GRANDMASTER",
    8: "CHALLENGER"
}

// Command Process
module.exports = {
    // show lol rank #name
    // show lol mastery #name
    // show lol freerotation
    name: 'lol',
    description: 'A show command',
    async execute(message, args) {
        var split = message.content.split(' ')
        var summonerName = '';
        var encryptedID = '';          // Summoner ID
        var accountID = '';
        var summonerLevel = '';

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
        //console.log(summonerData);

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
                rankEmbed.setTitle('Rank Summary for `' + summonerName + '`');
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

        } else {
            message.channel.send("The given parameters are invalid. Use !guide for more information.");
        }
    },
};