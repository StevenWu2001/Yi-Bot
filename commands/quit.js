const Discord = require('discord.js');
const {SlashCommandBuilder} = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quit')
        .setDescription('Disconnects the bot from the current voice channel.'),
	execute(interaction, client) {
        const queue = client.player.nodes.get(interaction.guild);
        if (queue) {
            if (queue.connection) {
                interaction.reply(`Disconnecting...`);
                queue.delete();
                return;
            }
        } else {
            interaction.reply(`I'm not in a voice channel right now!`);
            return;
        }
	},
};
