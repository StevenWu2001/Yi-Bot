const Discord = require('discord.js');
const {SlashCommandBuilder} = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clears the playing queue (removes all songs).'),
	async execute(interaction, client) {
        const voiceChannel = interaction.member.voice.channel;
        // Check if user is in the vc
        if (!voiceChannel) {
            await interaction.reply(`You must be in a voice channel!`);
            return;
        }

        // Get queue from the vc
        const queue = client.player.nodes.get(interaction.guild);
        if (!queue) {
            await interaction.reply(`The bot is not in a voice channel!`);
            return;
        }

        // If something is playing, we can skip the current song
        if (queue.isPlaying()) {
            queue.tracks.clear(); // Clears the queue
            queue.node.skip(); // Skips the current song
            await interaction.reply(`${interaction.user} Queue cleared!`);          
        } else {
            await interaction.reply(`Nothing is being played right now!`);
        }
	},
};
