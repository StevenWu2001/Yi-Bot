const Discord = require('discord.js');

module.exports = {
	name: 'guide',
	description: 'The help command',
	execute(message, args) {
		const helpEmbed = new Discord.MessageEmbed();
        helpEmbed.setColor('#0099ff');
        helpEmbed.setTitle('A List of Available Commands');
        helpEmbed.setDescription('Type the following commands to the bot!');
        helpEmbed.addFields(
            {name : '1: Get Champion Mastery :bulb:', value: '`!show lol mastery SUMMONER_NAME`\n'},
            {name : '2: Get Rank Info :brain:', value : '`!show lol rank SUMMONER_NAME`\n'},
            {name : '3: Get Weekly Free Rotation :watch:', value : '`!show lol freerotation` \n'},
            {name : '4: Guide :hammer_and_wrench:', value : '`!guide`'},
        );
        message.channel.send(helpEmbed);
        
	},
};