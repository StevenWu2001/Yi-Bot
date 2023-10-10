const Discord = require('discord.js');

module.exports = {
	name: 'quit',
	description: 'Disconnect the bot from a voice channel',
	execute(message, args, interaction, client) {
        const queue = client.player.nodes.get(message.guild);
        if (queue) {
            if (queue.connection) {
                message.channel.send(`Disconnecting...`);
                queue.delete();
                return;
            }
        } else {
            message.channel.send(`I'm not in a voice channel right now!`);
            return;
        }
	},
};
