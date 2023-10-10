const Discord = require('discord.js');

module.exports = {
	name: 'queue',
	description: 'Show the the current playing queue',
	execute(message, args, interaction, client) {
        const voiceChannel = message.member.voice.channel;

        // Check is use is in the vc
        if (!voiceChannel) {
            message.channel.send(`You must be in a voice channel!`);
            return;
        }

        // Get queue from the vc
        const queue = client.player.nodes.get(message.guild);
        if (!queue) {
            message.channel.send(`The bot is not in a voice channel!`);
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

            message.channel.send(queueStr);
        } else {
            message.channel.send(`Nothing is being played right now!`);
        }
	},
};
