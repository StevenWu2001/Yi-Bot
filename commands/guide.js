const Discord = require('discord.js');
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

const dot = ":diamond_shape_with_a_dot_inside:";

module.exports = {
	name: 'guide',
	description: 'The help command',
	execute(message, args) {
        var lolCmd = "1: Champion Mastery :bulb:\n `!lol mastery SUMMONER_NAME`\n\n";
        lolCmd += "2: Rank Info :brain:\n `!lol rank SUMMONER_NAME`\n\n";
        lolCmd += "3: Weekly Free Rotation :free:\n `!lol freerotation`\n\n";
        lolCmd += "4: Recent Match History :watch:\n `!lol match SUMMONER_NAME NUMBER_OF_MATCHES (optional, default 5, max 20)`"

        var apex = "1: Player Stats :bulb:\n`!apex player ORIGIN_USERNAME`\n\n";

        var music = "1: Play Music (or add a new song to the playlist) :musical_note:\n `!play SONG_NAME / LINK`\n\n";
        music = "2: Show the Current Playlist :musical_note:\n `!queue`\n\n";
        music = "2: Skip the Currente Song :musical_note:\n `!next`\n\n";
        music = "4: Disconnecting the Bot :musical_note:\n `!quit`\n\n";

		const helpEmbed = new Discord.EmbedBuilder();
        helpEmbed.setColor('#0099ff');
        helpEmbed.setTitle('A List of Available Commands');
        helpEmbed.setDescription('Type the following commands to the bot!');
        helpEmbed.addFields(
            {name : dot + ' League of Legends', value: lolCmd + "\n"},
            {name : dot + ' Music', value : music + "\n"},
            {name : dot + " Apex Legends", value : apex + "\n"},
            {name : dot + ' Guide :hammer_and_wrench:', value : '`!guide`'},
        );
        message.channel.send({ embeds: [helpEmbed] });
	},
};
