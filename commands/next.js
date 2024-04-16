const Discord = require('discord.js');
const {SlashCommandBuilder} = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('next')
        .setDescription('Skips the current song.'),
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
            await queue.node.remove();
            if (queue.tracks.data.length != 0) {
                await interaction.reply(`${interaction.user} Current song skipped, now playing **${queue.tracks.data[0].description} (${queue.tracks.data[0].duration})**`);
                await queue.node.play();
            } else {
                await interaction.reply(`${interaction.user} This is the last song in the playlist!`);
            }
            
        } else {
            await interaction.reply(`Nothing is being played right now!`);
        }
	},
};
