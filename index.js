require("dotenv").config();

// Initialize Setups
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
const {prefix} = require('./config.json');
client.login(process.env.BOT_TOKEN);

// Command Handler
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Execute Commands
client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) {
        return;
    }

    const args = message.content.slice(prefix.length).trim().split('/ +/');
    const command = args.shift().toLowerCase();
    const first = command.split(' ')[0];
    if (!client.commands.has(first)) {
        return;
    }

    try {
        client.commands.get(first).execute(message, args);
    } catch (error) {
        message.reply("This command cannot be executed!");
    }
});