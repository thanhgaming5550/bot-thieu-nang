const Discord = require('discord.js')
const { ActionRowBuilder, ButtonBuilder, Client, CommandInteraction } = require("discord.js");

module.exports = {
    name: "filter",
    description: "Lọc/Mod nhạc",

    options: [
        {
            name: "mode",
            type: 3,
            description: "Chế độ Lọc/Mod",
            required: true,
            choices: [
                {
                    name: "Xem các bộ lọc đang áp dụng",
                    value: "none"
                },
                {
                    name: "Tắt toàn bộ Filter",
                    value: "off"
                },
                {
                    name: "3d",
                    value: "3d"
                },
                {
                    name: "bassboost",
                    value: "bassboost"
                },
                {
                    name: "echo",
                    value: "echo"
                },
                {
                    name: "karaoke",
                    value: "karaoke"
                },
                {
                    name: "nightcore",
                    value: "nightcore"
                },
                {
                    name: "vaporwave",
                    value: "vaporwave"
                },
                {
                    name: "flanger",
                    value: "flanger"
                },
                {
                    name: "gate",
                    value: "gate"
                },
                {
                    name: "haas",
                    value: "haas"
                },
                {
                    name: "reverse",
                    value: "reverse"
                },
                {
                    name: "surround",
                    value: "surround"
                },
                {
                    name: "mcompand",
                    value: "mcompand"
                },
                {
                    name: "phaser",
                    value: "phaser"
                },
                {
                    name: "tremolo",
                    value: "tremolo"
                },
                {
                    name: "earwax",
                    value: "earwax"
                },
            ]
        }
    ],

    /**
    *
    * @param {Client} client
    * @param {CommandInteraction} interaction
    * @param {Object[]} option //{ name: 'id', type: 'INTEGER', value: 69 }
    */
    async run (client, interaction, option) {
        
        if (!interaction.member.voice.channel) return interaction.reply({content: `${client.emotes.error} |  Bạn phải ở trong một kênh nói`, ephemeral: true});
        if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) return interaction.reply({content: `${client.emotes.error} |  Bạn phải ở cùng kênh nói với Bot`, ephemeral: true}); 

        const queue = client.distube.getQueue(interaction)
        if (!queue) return interaction.reply({content: `${client.emotes.error} | Chả có gì đang phát cả!`, ephemeral: true});
        
        if (option[0].value == "none") return interaction.reply(`${client.emotes.filter} Filter : **${queue.filters.size === 0 ? "`Tắt`" : "`" + queue.filters.names.join(", ") + "`"}**`)
        else if (option[0].value.toLowerCase() === "off") {
            queue.filters.clear();
            interaction.reply(`${client.emotes.filter} | **\`Tắt toàn bộ Filter\`** \n*Vui lòng đợi một lát để áp dụng thay đổi*`)
        }
        else {
            const filter = (queue.filters.names.includes(option[0].value.toLowerCase()) ? queue.filters.remove(option[0].value.toLowerCase()) : queue.filters.add(option[0].value.toLowerCase()))
            let status; if (filter.names.includes(option[0].value.toLowerCase())) {status = "`Bật`"} else {status = "`Tắt`"} 
            interaction.reply(`${client.emotes.filter} | **${option[0].value.toLowerCase()}: ${status}** \n*Vui lòng đợi một lát để áp dụng thay đổi*`);
        }
    }
}