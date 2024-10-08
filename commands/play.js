const { SlashCommandBuilder } = require("discord.js")
const { useMainPlayer } = require('discord-player');

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
        await interaction.deferReply();
        const player = useMainPlayer();
        await player.extractors.loadDefault((ext) => ext === 'SoundCloudExtractor');

        // Get the song name and chech whether the user is in a voice channel
        const searchQuery = interaction.options.data[0].value;
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            await interaction.editReply("You must be in a voice channel!");
            return;
        }

        // Initialize the music player
        const queue = player.nodes.create(interaction.guild, {
            selfDeaf: false,
            volume: 80,
            leaveOnEmpty: false,
            leaveOnEmptyCooldown: 300000,
            leaveOnEnd: false,
            leaveOnEndCooldown: 300000,
        });

        queue.setRepeatMode(2); // Repeat

        if (!queue.connection) {
            await queue.connect(voiceChannel);
        }

        //Search and play songs
        const searchRes = await player.search(searchQuery)
        if (searchRes.tracks == null || searchRes.tracks.length == 0) {
            await interaction.editReply("Currently only support links from [SoundCloud](https://soundcloud.com/).");
            return;
        }

        //Check if the search result is a YouTube playlist
        if (searchRes.queryType == 'soundcloudPlaylist') {
            console.log(searchRes)
            for (let i = 0; i < searchRes.tracks.length; i++) {
                await queue.addTrack(searchRes.tracks[i]);
            }

            await interaction.editReply(`${interaction.user} Playlist **${searchRes.playlist.title}** with **${searchRes.tracks.length}** songs added.`);

            if (!queue.isPlaying()) {
                await queue.node.play();
            }
        } else {
            //Add the first song in the track to the queue
            console.log(searchRes)
            const song = searchRes.tracks[0];
            await queue.addTrack(song);

            //Play the song
            if (!queue.isPlaying()) {
                await interaction.editReply(`${interaction.user} Now Playing: **${searchRes.tracks[0].description} (${searchRes.tracks[0].duration})**`);
                await queue.node.play();
            } else {
                await interaction.editReply(`${interaction.user} Added to the queue: **${searchRes.tracks[0].description} (${searchRes.tracks[0].duration})**`)
            }
        }
    },
};
