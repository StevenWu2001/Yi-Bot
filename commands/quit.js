const Discord = require('discord.js');
const {SlashCommandBuilder} = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quit')
        .setDescription('Disconnects the bot from the current voice channel.'),
	async execute(interaction, client) {
        const queue = client.player.nodes.get(interaction.guild);
        if (queue) {
            if (queue.connection) {
                await interaction.reply(`Disconnecting...`);
                queue.delete();
                return;
            }
        } else {
            await interaction.reply(`I'm not in a voice channel right now!`);
            return;
        }
	},
};
