const Discord = require('discord.js');

module.exports = {
	name: 'next',
	description: 'Skip the current song and move to the next one',
	async execute(message, args, interaction, client) {
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

        // If something is playing, we can skip the current song
        if (queue.isPlaying()) {
            await queue.node.remove();
            if (queue.tracks.data.length != 0) {
                message.channel.send(`${message.author} Skipping the current song`);
                await queue.node.play();
            } else {
                message.channel.send(`${message.author} This is the last song in the playlist!`);
            }
            
        } else {
            message.channel.send(`Nothing is being played right now!`);
        }
	},
};
