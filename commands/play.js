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
        queue.setRepeatMode(QueueRepeatMode.QUEUE);

        if(!queue.connection) {
            await queue.connect(voiceChannel);
        }

        try {
            // Search for songs
            //const searchQuery = message.content.split(" ").slice(1).join(" ");
            const searchRes = await client.player.search(searchQuery)
            console.log(searchRes.queryType);

            // Play the first song in the track  
            const song = searchRes.tracks[0];
            await queue.addTrack(song);
            if (!queue.isPlaying()) {
                interaction.reply(`${interaction.user} Now Playing: **${song.description} (${song.duration})**`);
                await queue.node.play();
            } else {
                await interaction.reply(`${interaction.user} Added to the queue: **${song.description} (${song.duration})**`)
            }
        } catch (e) {
            interaction.reply("No songs found!");
            return;
        }
	},
};
