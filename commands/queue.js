const Discord = require('discord.js');
const {SlashCommandBuilder} = require("discord.js")
const { useMainPlayer } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Shows the current playlist.'),
	async execute(interaction, client) {
        const voiceChannel = interaction.member.voice.channel;

        // Check is use is in the vcs
        if (!voiceChannel) {
            await interaction.reply(`You must be in a voice channel!`);
            return;
        }

        const player = useMainPlayer();

        // Get queue from the vc
        const queue = player.nodes.get(interaction.guild);
        if (!queue) {
            await interaction.reply(`The bot is not in a voice channel!`);
            return;
        }

        // If something is playing, we can pull the playlist
        if (queue.isPlaying()) {
            let totalSongs = queue.currentTrack ? 1 : 0;
            if (queue.tracks.data) {
                totalSongs += queue.tracks.data.length;
            }

            queueStr = "**The Current Playlist **" + `(${totalSongs} Song(s) Total)` + "\n";

            // Current Song
            if (queue.currentTrack) {
                queueStr += `- ${queue.currentTrack.description} (${queue.currentTrack.duration}) -- Currently Playing\n`
            } else {
                queueStr += "Nothing..."
            }

            // Other songs in the queue
            if (queue.tracks.data) {
                for (var i = 0; i < queue.tracks.data.length; i++) {
                    queueStr += `- ${queue.tracks.data[i].description} (${queue.tracks.data[i].duration})\n`
                }
            }

            // Checks if output exceeds 2000 char limit
            if (queueStr.length > 2000) {
                queueStr = queueStr.substring(0, 1970) + '..........';
            }

            await interaction.reply(queueStr);    
        } else {
            await interaction.reply(`Nothing is being played right now!`);
        }
	},
};
