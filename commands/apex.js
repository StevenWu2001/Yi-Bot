
const profileLink = "https://api.mozambiquehe.re/bridge?version=5&platform=PC";
const apexKey = process.env.APEXKEY;

const Discord = require('discord.js');
const utf8 = require('utf8');
const { DiscordAPIError } = require("discord.js");
//const fetch = require("node-fetch");

module.exports = {
	name: 'apex',
	description: 'The apex legends command',
	async execute(message, args) {
        split = message.content.split(" ");
        var playerName = '';
        if (split[1] == 'player') {
            for (var i = 2; i < split.length; i++) {
                playerName += split[i] + '%20';
            }
            playerName = utf8.encode(playerName);

            // API Call
            const link = profileLink + '&player=' + playerName + '&auth=' + apexKey;
            const response = await fetch(link);
            let playerData = await response.json();
            if (playerData.hasOwnProperty('Error')) {
                message.channel.send("Player not found!");
                return;
            }
            console.log(playerData);

            // Retrieve data from JSON
            const name = playerData.global.name;
            const emblem = playerData.global.rank.rankImg;
            const level = playerData.global.level;
            const rank = playerData.global.rank.rankName;
            const div = playerData.global.rank.rankDiv;
            const rankScore = playerData.global.rank.rankScore;
            const arenaRank = playerData.global.arena.rankName;
            const arenaDiv = playerData.global.arena.rankDiv;
            const totalKills = playerData.total.kills.value;

            // Generate Discord Embed
            const playerEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Apex Legends Summary: `' + name + '`')
                .setDescription('Player Level: `' + level + '`')
            playerEmbed.addFields(
                {name : "Rank: " + rank + " " + div + ", " + rankScore + " RP" + "       Arena: " + arenaRank + " " + arenaDiv, value: "Total Kills: `" + totalKills + '`'},
            );

            playerEmbed.setThumbnail(emblem);
            message.channel.send(playerEmbed);


        }
	},
};
