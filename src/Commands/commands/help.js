const Discord = require('discord.js');

module.exports = {
        name: "help",
        description: "command list",

        async run(client, message, args) {
        
        const help = new Discord.EmbedBuilder()
                .setTitle(`**-> NHẤN VÀO ĐỂ XEM HƯỚNG DẪN SỬ DỤNG <-**`)
                .setDescription(`Hướng dẫn sử dụng Bot Thieu Nang`)
                .setThumbnail('https://i.imgur.com/gfnBgbS.png')
                .setURL(`https://bit.ly/btnguide`)
                .setTimestamp()
                .setColor("Random")
        message.reply({embeds : [help]});
   }
} 