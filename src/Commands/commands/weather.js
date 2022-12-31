const weather = require('weather-js');
const Discord = require('discord.js');

module.exports = {
    name: "weather",
    description: "Checks a weather forecast",

    async run (client, message, args){
        
    weather.find({search: args.join(" "), degreeType: 'C'}, function (error, result){
        // 'C' can be changed to 'F' for farneheit results
        if(!args[0]) return message.reply('Vui lòng đưa ra 1 vị trí')
        if (error) {
            console.error(error);
            return message.reply({content: `Đã xảy ra lỗi, vui lòng thử lại.`});
        }

        if(result === undefined || result.length === 0) return message.reply('Vị trí không hợp lệ. Vui lòng kiểm tra lại.');

        var current = result[0].current;
        var location = result[0].location;

        const weatherinfo = new Discord.EmbedBuilder()
        .setDescription(`**${current.skytext}**`)
        .setAuthor({name: `DỰ BÁO THỜI TIẾT Ở ${current.observationpoint}`})
        .setThumbnail(current.imageUrl)
        .setColor(0x111111)
        .addFields([
            {name: 'Múi giờ', value: `UTC${location.timezone}`, inline:true},
            {name: 'Đơn vị đo', value: 'Độ Celsius (°C)', inline:true},
            {name: 'Nhiệt độ', value: `${current.temperature}°`, inline:true},
            {name: 'Gió', value: current.winddisplay, inline:true},
            {name: 'Cảm nhận thấy', value: `${current.feelslike}°`, inline:true},
            {name: 'Độ ẩm', value: `${current.humidity}%`, inline:true},
        ])

        message.reply({embeds : [weatherinfo]})
        })        
    }
}