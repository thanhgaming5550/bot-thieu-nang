class Pokemon {

    constructor(options) {
        if(!options.token) throw new TypeError('Missing argument: token')
        if(typeof options.token !== 'string') throw new TypeError('token must be in a string')
      
        if(!options.interaction) throw new TypeError('Missing argument: interaction')
    
        this.interaction = options.interaction;
        this.token = options.token;
      
    }
    async start() {
        const fetch = require("node-fetch")
        const Discord = require('discord.js');
        fetch(`https://api.dagpi.xyz/data/wtp`, {
            headers: {
                "Authorization": this.token
            }
        })
        .then(res => res.json())
        .then(data => {
          
    const pok = new Discord.MessageEmbed()
        .setTitle(`Đây là Pokemon gì?`)
        .addField(`Thể loại:`,`${data.Data.Type}`, true)
        .addField(`Năng lực:`, `${data.Data.abilities}`)
        .setImage(data.question)
        .setFooter(`Nhập stop để dừng chơi`)
        .setColor("RANDOM")
        .setTimestamp()

    const right = new Discord.MessageEmbed()
        .setTitle(`Bạn đã đoán đúng!`)
        .setAuthor(this.interaction.user.tag)
        .setURL(data.Data.Link)
        .setDescription(`Nó là ${data.Data.name}`)
        .setImage(data.answer)
        .setColor("RANDOM")
        .addField(`Thể loại:`,`${data.Data.Type}`, true)
        .addField(`Năng lực:`, `${data.Data.abilities}`)
        .setTimestamp()
   

    const wrong = new Discord.MessageEmbed()
    .setTitle(`Bạn đã thua!`)
    .setAuthor(this.interaction.user.tag)
    .setURL(data.Data.Link)
    .setDescription(`Nó là ${data.Data.name}`)
    .setImage(data.answer)
    .setColor("RANDOM")
    .addField(`Thể loại:`,`${data.Data.Type}`, true)
    .addField(`Năng lực:`, `${data.Data.abilities}`)
    .setTimestamp()
    

    this.interaction.reply({embeds : [pok]})
    const gameFilter = m => m.user.id
    const gameCollector = this.interaction.channel.createMessageCollector(gameFilter);

    gameCollector.on('collect', async msg => {
        if(msg.author.bot) return
        const selection = msg.content.toLowerCase();
        if (selection === data.Data.name.toLowerCase()) {
        msg.reply({embeds : [right]})
        gameCollector.stop()
          } else if (selection === "stop") {
            msg.reply({embeds : [wrong]})
            gameCollector.stop();
          } else if (selection !== data.Data.name ) {
            msg.reply("**SAI!** - Nhập `stop` nếu bạn muốn dừng chơi")
          }
    })
    
})
}
}

module.exports = Pokemon;