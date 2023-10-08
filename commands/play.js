const Discord = require('discord.js');
const ytdl = require("ytdl-core");
const { joinVoiceChannel } = require('@discordjs/voice');
const { QueryType } = require("discord-player");
const { QueueRepeatMode } = require("discord-player");

module.exports = {
	name: 'play',
	description: 'The play music command',
	async execute(message, args, interaction, client) {
        await client.player.extractors.loadDefault();
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            message.channel.send("You must be in a voice channel!");
            return;
        }

        const queue = client.player.nodes.create(message.guild, {
               selfDeaf: false,
               volume: 80,
               leaveOnEmpty: false,
               leaveOnEmptyCooldown: 300000,
               leaveOnEnd: false,
               leaveOnEndCooldown: 300000,
             });
        
        // Repeat current track
        queue.setRepeatMode(QueueRepeatMode.TRACK);

        if(!queue.connection) {
            await queue.connect(voiceChannel);
        }

        try {
            // Search for songs
            const searchQuery = message.content.split(" ").slice(1).join(" ");
            const searchRes = await client.player.search(searchQuery)

            // Play the first song in the track   
            const song = searchRes.tracks[0];
            console.log(song)
            await queue.addTrack(song);

            if (!queue.playing) {
                await queue.node.play();
            }

            await message.channel.send(`${message.author} Now Playing: **${song.description} (${song.duration})**`)
        } catch (e) {
            message.channel.send("No songs found!");
            return;
        }
	},
};
