require("dotenv").config();

// Initialize Setups
const fs = require('fs');
const Discord = require('discord.js');
const { Client, GatewayIntentBits, Partials, Events } = require('discord.js');
const {prefix} = require('./config.json');

const client = new Client({
    intents: [
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel, Partials.Message],
  });
client.login(process.env.BOT_TOKEN);

// Command Handler
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

console.log(client.commands)

// Execute Commands
client.on(Events.MessageCreate, message => {
    if (!message.content.startsWith(prefix) || message.author.bot) {
        return;
    }
    const args = message.content.slice(prefix.length).trim().split('/ +/');
    const command = args.shift().toLowerCase();
    const first = command.split(' ')[0];
    if (!client.commands.has(first)) {
        return;
    }
    console.log(client.commands.get(first))
    try {
        client.commands.get(first).execute(message, args);
    } catch (error) {
        console.log(error.message)
        message.reply("This command cannot be executed!");
    }
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isStringSelectMenu()) return;

    if (interaction.customId === "Match Dropdown") {
        let choices = "";
        await interaction.values.forEach(async value => {
            choices += `${value}`
        })

        try {
            await interaction.reply({content: "Here it is!"})
            client.commands.get("lol").execute(choices, "__match__", interaction);
        } catch (error) {
            console.log(error.message)
            message.reply("This command cannot be executed!");
        }
    }
})