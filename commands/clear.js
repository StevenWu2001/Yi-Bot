const Discord = require('discord.js');
const {SlashCommandBuilder} = require("discord.js")
const { useMainPlayer } = require('discord-player');

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
        
        const player = useMainPlayer();

        // Get queue from the vc
        const queue = player.nodes.get(interaction.guild);
        if (!queue) {
            await interaction.reply(`The bot is not in a voice channel!`);
            return;
        }

        // If something is playing, we can skip the current song
        if (queue.isPlaying()) {
            queue.setRepeatMode(0);
            await queue.tracks.clear(); // Clears the queue
            await queue.node.skip(); // Skips the current song
            await interaction.reply(`${interaction.user} Queue cleared!`);     
            queue.setRepeatMode(2);     
        } else {
            await interaction.reply(`Nothing is being played right now!`);
        }
	},
};
