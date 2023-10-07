const Discord = require('discord.js');
const ytdl = require("ytdl-core");
const { joinVoiceChannel } = require('@discordjs/voice');

const queue = [];

module.exports = {
	name: 'play',
	description: 'The play music command',
	async execute(message, args) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            message.channel.send("You are not in a voice channel!");
            return;
        }

        const songInfo = await ytdl.getInfo("https://www.youtube.com/watch?v=Wc5IbN4xw70&ab_channel=CardiB");
        const song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
        };

        if (queue.length == 0) {
            try {
                const connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: voiceChannel.guild.id,
                    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                });

                play(connection, song);
            } catch (error) {
                console.log(error)
                message.channel.send("An error has occured!");
                return;
            }
        } else {
            queue.push(song);
            message.channel.send(`**${song.title}** has been added to the queue!`);
            return;
        }

	},
};
