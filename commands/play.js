const Discord = require('discord.js');
const ytdl = require("ytdl-core");
const { joinVoiceChannel } = require('@discordjs/voice');
const { QueryType } = require("discord-player");
const { QueueRepeatMode } = require("discord-player");
const {SlashCommandBuilder} = require("discord.js")

module.exports = {
    // Define the play command with a required arg
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play music!')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('Searches for a song with name or link.')
                .setRequired(true)),
                

	async execute(interaction, client) {
        // Get the song name and chech whether the user is in a voice channel
        const searchQuery = interaction.options.data[0].value;
        await client.player.extractors.loadDefault();
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            interaction.reply("You must be in a voice channel!");
            return;
        }

        // Initialize the music player
        const queue = client.player.nodes.create(interaction.guild, {
               selfDeaf: false,
               volume: 80,
               leaveOnEmpty: false,
               leaveOnEmptyCooldown: 300000,
               leaveOnEnd: false,
               leaveOnEndCooldown: 300000,
             });
        
        // Repeat current track
        queue.setRepeatMode(2);

        if(!queue.connection) {
            await queue.connect(voiceChannel);
        }

        // Search and play songs
        try {
            const searchRes = await client.player.search(searchQuery)
            
            // Check if the search result is a YouTube playlist
            if (searchRes.queryType == 'youtubePlaylist') {
                for (let i = 0; i < searchRes.tracks.length; i++) {
                    await queue.addTrack(searchRes.tracks[i]);
                }
                interaction.reply(`${interaction.user} Playlist **${searchRes.playlist.description}** with **${searchRes.tracks.length}** songs added.`);
                if (!queue.isPlaying()) {
                    await queue.node.play();
                }
            } else {
                // Add the first song in the track to the queue
                const song = searchRes.tracks[0];
                await queue.addTrack(song);

                // Play the song
                if (!queue.isPlaying()) {
                    interaction.reply(`${interaction.user} Now Playing: **${searchRes.tracks[0].description} (${searchRes.tracks[0].duration})**`);
                    await queue.node.play();
                } else {
                    await interaction.reply(`${interaction.user} Added to the queue: **${searchRes.tracks[0].description} (${searchRes.tracks[0].duration})**`)
                }
            }
        } catch (e) {
            console.log(e)
            interaction.reply("No songs found!");
            return;
        }
	},
};
