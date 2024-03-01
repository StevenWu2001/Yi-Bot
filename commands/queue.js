const Discord = require('discord.js');
const {SlashCommandBuilder} = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Shows the current playlist.'),
	execute(interaction, client) {
        const voiceChannel = interaction.member.voice.channel;

        // Check is use is in the vcs
        if (!voiceChannel) {
            interaction.reply(`You must be in a voice channel!`);
            return;
        }

        // Get queue from the vc
        const queue = client.player.nodes.get(interaction.guild);
        if (!queue) {
            interaction.reply(`The bot is not in a voice channel!`);
            return;
        }

        // If something is playing, we can pull the playlist
        if (queue.isPlaying()) {
            queueStr = "**The Current Playlist**\n";

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

            interaction.reply(queueStr);
        } else {
            interaction.reply(`Nothing is being played right now!`);
        }
	},
};
