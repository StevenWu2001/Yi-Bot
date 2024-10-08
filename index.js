require("dotenv").config();

// Initialize Setups
const fs = require('fs');
const Discord = require('discord.js');
const { Client, GatewayIntentBits, Partials, Events, ActivityType, REST, Routes} = require('discord.js');
const { VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');
//const {prefix} = require('./config.json');
const { Player } = require('discord-player')
//const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
//const ffmpeg = require('fluent-ffmpeg');
//ffmpeg.setFfmpegPath(ffmpegPath);
const { prefix } = require('./config.json');

const client = new Client({
    intents: [
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildVoiceStates
    ],
    partials: [Partials.Channel, Partials.Message],
  });

client
.on('ready', () =>{
    emojiList = client.emojis
    client.user.setActivity("Master Yi", {type: ActivityType.Playing})
}
)
client.login(process.env.BOT_TOKEN);

client.player = Player.singleton(client);
client.player.events.on('connection', (queue) => {
    queue.dispatcher.voiceConnection.on('stateChange', (oldState, newState) => {
      const oldNetworking = Reflect.get(oldState, 'networking');
      const newNetworking = Reflect.get(newState, 'networking');
  
      const networkStateChangeHandler = (oldNetworkState, newNetworkState) => {
        const newUdp = Reflect.get(newNetworkState, 'udp');
        clearInterval(newUdp?.keepAliveInterval);
      }
  
      oldNetworking?.off('stateChange', networkStateChangeHandler);
      newNetworking?.on('stateChange', networkStateChangeHandler);
    });
});

// Command Handler
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    }
}

// Execute Commands
// client.on(Events.MessageCreate, message => {
//     if (!message.content.startsWith(prefix) || message.author.bot) {
//         return;
//     }
//     const args = message.content.slice(prefix.length).trim().split('/ +/');
//     const command = args.shift().toLowerCase();
//     const first = command.split(' ')[0];
//     if (!client.commands.has(first)) {
//         return;
//     }

//     try {
//         client.commands.get(first).execute(message, args, null, client);
//     } catch (error) {
//         console.log(error.message)
//         message.reply("This command cannot be executed!");
//     }
// });

client.on(Events.InteractionCreate, async interaction => {
    //if (!interaction.isStringSelectMenu()) return;
    const command = interaction.client.commands.get(interaction.commandName);
    
    if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

    try {
		await command.execute(interaction, client);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.editReply({ content: 'There was an error while executing this command! If you are using **/play**, some songs cannot be played due to issues like format, or age restriction.', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command! If you are using **/play**, some songs cannot be played due to issues like format, or age restriction.', ephemeral: true });
		}
	}

    if (interaction.customId === "Match Dropdown") {
        let choices = "";
        await interaction.values.forEach(async value => {
            choices += `${value}`
        })

        try {
            await interaction.reply({content: "Here it is!"})
            client.commands.get("lol").execute(choices, "__match__", interaction, client);
        } catch (error) {
            console.log(error.message)
            message.reply("This command cannot be executed!");
        }
    }
})