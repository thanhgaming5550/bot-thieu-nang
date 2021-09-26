module.exports = {
    name: "shuffle",
    description: "interesting music",

    async run (client, message, args){
    console.log(`${message.createdAt} | ${message.author.tag} ${message.author} : ${message}`)
    if (!message.member.voice.channel) return message.channel.send(`${client.emotes.error} - Bạn không ở trong một kênh thoại !`);

    if (!client.player.getQueue(message)) return message.channel.send(`${client.emotes.error} - Chẳng có gì đang phát cả !`);

    client.player.shuffle(message);

    return message.channel.send(`${client.emotes.success} - Bắt đầu trộn **${client.player.getQueue(message).tracks.length}** bản nhạc !`);
    }
};
