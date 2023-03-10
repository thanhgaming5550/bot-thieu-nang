const Discord = require('discord.js')

module.exports = {
    name: "ping",
    description: "Kiแปm tra Ping",

    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    async run (client, interaction, args) {
        const ping = new Discord.EmbedBuilder()
            .setTitle('**๐ PING PONG! ๐**')
            .setColor("Random")
            .addFields(
                {
					name: "๐ Bot Latency",
					value: `${Date.now() - interaction.createdTimestamp}ms`,
					inline: true,
				},
				{
					name: "โ๏ธ API Latency",
					value: `${Math.round(client.ws.ping)}ms`,
					inline: true,
				}
            )
            .setTimestamp()   
        interaction.reply({embeds : [ping], ephemeral: true});
    }
}