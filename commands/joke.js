const Discord = require('discord.js');

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = {
	name: 'joke',
	description: 'Tell a league of legend joke',
	async execute(message, args) {
        const response = await openai.createCompletion({
            model: "text-curie-001",
            prompt: "Tell me a league of legend joke",
            max_tokens: 500,
          });

        var result = response.data.choices[0]['text']
        message.channel.send(result)
	},
};
