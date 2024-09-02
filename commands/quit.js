const Discord = require('discord.js');
const {SlashCommandBuilder} = require("discord.js")
const { useMainPlayer } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quit')
        .setDescription('Disconnects the bot from the current voice channel.'),
	async execute(interaction, client) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guild);
        if (queue) {
            if (queue.connection) {
                await interaction.reply(`Disconnecting...`);
                await queue.delete();
                return;
            }
        } else {
            await interaction.reply(`I'm not in a voice channel right now!`);
            return;
        }
	},
};
