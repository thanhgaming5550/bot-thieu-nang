const Discord = require('discord.js');
const { ActivityType, ChannelType } = require('discord.js')
const client = new Discord.Client({intents: ["Guilds", "GuildMessages", "GuildMessageReactions", "GuildVoiceStates", "MessageContent"]});
module.exports = client;
const fs = require('fs');
const { readdirSync } = require('fs');
const { join } = require('path')
require('log-timestamp')(function() { return "[" + new Date().toLocaleString(`en-GB`,  { timeZone: 'Asia/Ho_Chi_Minh' }) + "] "});
require("dotenv").config();
const colors = require("colors");
const DisTube = require("distube")
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { SpotifyPlugin } = require('@distube/spotify');
const { Routes } = require("discord-api-types/v9")
const { REST } = require("@discordjs/rest")
const { YtDlpPlugin } = require("@distube/yt-dlp");
var crypto = require('crypto-js');

    console.log(colors.bold(colors.cyan('Preparing and Running...')));

    const config = JSON.parse(fs.readFileSync("config.json"));
    const package = JSON.parse(fs.readFileSync("package.json"));

    const prefix = config.prefix; 
    client.emotes = config.emoji;
    const cmdFolder = config.source.command;
    const slsFolder = config.source.slash;

    client.commands = new Discord.Collection();
    client.slash = new Discord.Collection();

    const commandFiles = readdirSync(join(__dirname, cmdFolder)).filter(file => file.endsWith(".js"));
    
    const cmdcount = fs.readdirSync(cmdFolder).length;
    const slscount = fs.readdirSync(slsFolder).length;
    
    //?Text Command
    console.log(colors.bold(colors.yellow(`Starting load Commands...`)))
    var loaded = true; var count = 0;
    for (const file of commandFiles) {
        const command = require(join(__dirname, cmdFolder, `${file}`));
        try {
            client.commands.set(command.name, command) 
            count++;
            let text = colors.yellow(`[Command] `) + colors.green(`[${count}/${cmdcount}] Loaded ${file}`);
            console.log(text);
        } catch {
            let text = colors.yellow(`[Command] `) + colors.red(`[${count}/${cmdcount}] Unloaded ${file}`);
            loaded = false;
            console.log(text);
        }
    }
    loaded ? console.log(colors.bold(colors.green(`Loaded all Commands!`))) : console.log(colors.bold(colors.red(`Load all Commands Falled!`)))
    
    const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);
    count = 0;

    //?Slash Command
    console.log(colors.bold(colors.yellow(`Starting load Slash Commands...`)))
    const slashFiles = readdirSync(join(__dirname, slsFolder)).filter(file => file.endsWith(".js"));
    const arrayOfSlashCommands = [];
    for (const file of slashFiles) {
        const command = require(join(__dirname, slsFolder, `${file}`));
        try {
            client.slash.set(command.name, command)
            arrayOfSlashCommands.push(command);
            count++
            let text = colors.yellow(`[Slash] `) + colors.green(`[${count}/${slscount}] Loaded ${file}`);
            console.log(text);
        } catch {
            let text = colors.yellow(`[Slash] `) + colors.red(`[${count}/${slscount}] Unloaded ${file}`);
            loaded = false;
            console.log(text);
        }
    }
    (async () => {
        try {
            await rest.put(
                Routes.applicationCommands(process.env.clientID),
                    { body: arrayOfSlashCommands }
                )
            console.log(colors.bold(colors.green(`Loaded all Slash Commands!`)))
        } catch (error) {
            console.error(colors.red(error))
            console.log(colors.bold(colors.red(`Load all Slash Commands Falled!`)))
        }
    })();

    client.on ("error", console.error);

    client.on('ready', () => {
        let i = 0, activities;
        activities = [`v${package.version}`,`/help`,`/invite`,`/changelog`,`/support`,`${client.guilds.cache.size} m??y ch???`,`${cmdcount} l???nh ch???`, `${slscount} l???nh g???ch ch??o`]
        client.user.setActivity(`${activities[i ++ % activities.length]}`, {type: ActivityType.Listening})
        setInterval(() => {
            activities = [`v${package.version}`,`/help`,`/invite`,`/changelog`,`/support`,`${client.guilds.cache.size} m??y ch???`,`${cmdcount} l???nh ch???`, `${slscount} l???nh g???ch ch??o`]
            client.user.setActivity(`${activities[i ++ % activities.length]}`, {type: ActivityType.Listening})
        }, 30000)
            
        console.log(colors.bold(colors.green(`Logged in as ${client.user.tag}!`)));
        console.log(colors.green(`Online`));
        console.log(`Bot hi???n ??ang ??? ${client.guilds.cache.size} m??y ch???, ph???c v??? ${cmdcount} l???nh ch??? v?? ${slscount} l???nh g???ch ch??o`);
        console.log('=========================================================================================================');
    });

    client.distube = new DisTube.DisTube(client, {
        searchSongs: 5,
        searchCooldown: 30,
        leaveOnEmpty: true,
        emptyCooldown: 60,
        leaveOnFinish: true,
        leaveOnStop: true,
        savePreviousSongs: true,
        nsfw: false,
        plugins: [new SoundCloudPlugin(), new YtDlpPlugin({ update: false }), new SpotifyPlugin()],
    })
    client.distube
        .on("error", (channel, error) => {
            console.log(colors.red(error));
            const exampleEmbed = new Discord.EmbedBuilder()
                .setColor('Red')
                .setAuthor({name: `${client.emotes.error} | ???? x???y ra l???i`})
                .setDescription(`\n${error}\n\n\`H??y th??? l???i m???t l???n n???a ho???c ?????i m???t l??c r???i th??? l???i! N???u v???n ????? v???n ch??a ???????c kh???c ph???c, li??n h??? v???i ch??? Bot b???ng />support ????? ???????c gi??p ?????\``)
                .setTimestamp()
            channel.send({embeds : [exampleEmbed]});
        })
        .on("addSong", (queue, song) => {
            const exampleEmbed = new Discord.EmbedBuilder()
                .setColor('#800080')
                .setAuthor({name: `${client.emotes.success} | ???? th??m b??i nh???c`})
                .setTitle(`${song.name}`)
                .setURL(`${song.url}`)
                .setThumbnail(`${song.thumbnail}`)
                .addFields([
                    {name:'L?????t xem', value: `${new Intl.NumberFormat('en-US').format(song.views)}`, inline: true},
                    {name:'L?????t th??ch', value: `${new Intl.NumberFormat('en-US').format(song.likes)}`, inline: true},
                    {name:'Y??u c???u b???i', value: `${song.user}`, inline: true},
                    {name:'Ng?????i t???i l??n', value: `[${song.uploader.name}](${song.uploader.url})`, inline: true},
                    {name:'Th???i l?????ng', value: `${song.isLive ? "LIVE" : song.formattedDuration}`, inline: true},
                    {name:'??m l?????ng', value: `${queue.volume}%`, inline: true},
                    {name:'L???p', value: `${queue.repeatMode ? queue.repeatMode === 2 ? "T???t c???" : "????n b??i" : "T???t"}`, inline: true},
                    {name:'T??? ?????ng ph??t', value: `${queue.autoplay ? "B???t" : "T???t"}`, inline: true},
                    {name:'Filter', value: `\`${queue.filters.size === 0 ? "T???t" : queue.filters.names.join(", ")}\``, inline: true},
                ])
                .setTimestamp()
            console.log(colors.yellow(queue.id +` | Th??m b??i "${song.name}"/${song.url}`));
            queue.textChannel.send({embeds : [exampleEmbed]});
        })
        .on("playSong", (queue, song) => {
            const exampleEmbed = new Discord.EmbedBuilder()
                .setColor('Blue')
                .setAuthor({name: `${client.emotes.success} | B???t ?????u ph??t b??i nh???c`})
                .setTitle(`${song.name}`)
                .setURL(`${song.url}`)
                .setThumbnail(`${song.thumbnail}`)
                .addFields([
                    {name: 'L?????t xem', value: `${new Intl.NumberFormat('en-US').format(song.views)}`, inline:true},
                    {name: 'L?????t th??ch', value: `${new Intl.NumberFormat('en-US').format(song.likes)}`, inline:true},
                    {name: 'Y??u c???u b???i', value: `${song.user}`, inline:true},
                    {name: 'Ng?????i t???i l??n', value: `[${song.uploader.name}](${song.uploader.url})`, inline:true},
                    {name: 'Th???i l?????ng', value: `${song.isLive ? "LIVE" : song.formattedDuration}`, inline:true},
                    {name: '??m l?????ng', value: `${queue.volume}%`, inline:true},
                    {name: 'L???p', value: `${queue.repeatMode ? queue.repeatMode === 2 ? "T???t c???" : "????n b??i" : "T???t"}`, inline:true},
                    {name: 'T??? ?????ng ph??t', value:`${queue.autoplay ? "B???t" : "T???t"}`, inline:true},
                    {name: 'Filter', value:`\`${queue.filters.size === 0 ? "T???t" : queue.filters.names.join(", ")}\``, inline:true},
                ])
                .setTimestamp()
            console.log(colors.blue(queue.id +` | Ph??t b??i "${song.name}"/${song.url} | Queue c?? ${(queue.song === undefined ? 0 : queue.song.length())+1} b??i`));
            queue.textChannel.send({
                embeds: [exampleEmbed]
            });
        })
        .on("addList", (queue, playlist) => {
            var songlist = [];
            for (let i = 0; i < playlist.songs.length; i++) {
                songlist[i] = `${i+1}. [${playlist.songs[i].name}](${playlist.songs[i].url})` + " -** `" + playlist.songs[i].formattedDuration + "`**";
            }
            const song = songlist.join('\n');
            const exampleEmbed = new Discord.EmbedBuilder()
                .setColor('#800080')
                .setAuthor({name: `${client.emotes.success} | ???? th??m danh s??ch ph??t`})
                .setTitle(`${playlist.name}`)
                .setURL(`${playlist.url}`)
                .setThumbnail(`${playlist.thumbnail}`)
                .setDescription(`**G???m c??c b??i:** \n${song}\n`)
                .addFields([
                    {name: 'T???ng th???i l?????ng', value:`${playlist.formattedDuration}`, inline: true},
                    {name: 'Y??u c???u b???i', value:`${playlist.user}`, inline: true},
                ])
                .setTimestamp()
            console.log(colors.yellow(queue.id +` | Th??m Playlist "${playlist.name}"/${playlist.url}`));
            queue.textChannel.send({embeds : [exampleEmbed]});
        })
        
        .on("searchResult", (message, results, query) => {
            let i = 0;
            const exampleEmbed = new Discord.EmbedBuilder()
                .setColor('Green')
                .setTimestamp()
                .setAuthor({name: `${client.emotes.search} | K???t qu??? t??m ki???m cho "${query}"`})
                .setTitle(`G???i s??? th??? t??? b??i b???n mu???n ph??t t????ng ???ng`)
                .setThumbnail(`${results[0].thumbnail}`)
                .setDescription(`\n${results.map(song => `**${++i}**. [${song.name}](${song.url}) - \`${song.isLive ? "LIVE" : song.formattedDuration}\``).join("\n")}\n\n*Y??u c???u b???i: ${message.author}*`)
                .setFooter({text: `T??? ?????ng h???y sau 30s`, iconURL:"https://www.iconpacks.net/icons/2/free-youtube-logo-icon-2431-thumb.png"})
            message.reply({embeds : [exampleEmbed]});
        })
        .on("searchCancel", message => message.reply(`${client.emotes.error} | H???y ph??t nh???c do ng?????i d??ng ch??a ch???n b??i`))
        .on('searchInvalidAnswer', message => message.reply(`${client.emotes.error} | T??m ki???m kh??ng h???p l???`))
        .on('searchNoResult', message => message.reply(`${client.emotes.error} | Kh??ng c?? k???t qu??? t??m ki???m`))
        .on("searchDone", () => {})

        .on('finish', queue => {
            queue.textChannel.send(`${client.emotes.success} | ???? ph??t xong`)
        })
        .on('finishSong', (queue, song) => {
            queue.textChannel.send(`${client.emotes.success} | ???? ph??t xong b??i`)
            delete song.voteskip; //Thuy???t Ki???n t???o m???ng
            console.log(colors.blue(queue.id +` | Ph??t xong b??i "${song.name}" | C??n ${(queue.song === undefined ? 1 : queue.song.length())-1} b??i`));
        })
        .on('disconnect', queue => {
            queue.textChannel.send(`${client.emotes.success} | ???? tho??t k??nh`)
            console.log(colors.green(queue.id +` | Tho??t k??nh`));
        })
        .on('empty', (queue) => {
            queue.textChannel.send(`${client.emotes.queue} | Danh s??ch ch??? ???? Tr???ng. T??? ?????ng tho??t k??nh sau 60s tr???ng ng?????i`)
        })
        .on('deleteQueue', queue => {
            queue.textChannel.send(`${client.emotes.queue} | ???? x??a danh s??ch ch???`);
            console.log(colors.green(`${queue.id} | X??a danh s??ch ch???`));
        })
        .on("noRelated", queue => queue.textChannel.send(`${client.emotes.error} | Kh??ng t??m th???y b??i li??n quan`));
    client.on("messageCreate", async (message) => {
        if(message.author.bot) return;
        if(message.channel.type === ChannelType.DM) return;
        if(message.content.startsWith(prefix)) {
            const args = message.content.slice(prefix.length).trim().split(/ +/);
            const command = args.shift().toLowerCase();
            
            if(!client.commands.has(command)) return;

            try {
                if (command === "oantuti") client.commands.get(command).run(client, message, args); else {
                //! Ph???n ch???y l???nh Command B??nh th?????ng: client.commands.get(command).run(client, message, args);
                    const movedEmbed = new Discord.EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`**L???nh \`${prefix}${command}\` ???? ???????c chuy???n sang Slash Command.**\n**Vui l??ng s??? d???ng \`/${command}\`**`)
                        .setTimestamp()
                    message.reply({embeds: [movedEmbed]});
                    console.log(colors.yellow(`[Command] ${message.author.id} : ` + crypto.AES.encrypt(message.content, process.env.keyEncrypt)))
                }    
            } catch (error) { 
                console.error(error);
                message.reply({content: "???? x???y ra l???i! Vui l??ng th??? l???i"})
            }
        }
    });

    client.on("interactionCreate", async (interaction) => {
        if (interaction.isCommand() || interaction.isContextMenuCommand()) {
            if (!interaction.guild) return;
            const command = client.slash.get(interaction.commandName);
            try {
                 //?{ name: 'id', type: 'INTEGER', value: 69 }
                const option = [];
                const output = []; //option.value
                for (let opt of interaction.options.data) {
                    option.push(opt);
                    if (opt.type !== "SUB_COMMAND") {
                       output.push(opt.name + ":\"" + opt.value + "\"")
                    } else {
                        let string = `${opt.name} `
                        for (let dem = 0; dem < opt.options.length; dem++) {
                            string = string + opt.options[dem].name + `:"` + opt.options[dem].value + `" `
                        }
                        output.push(string)
                    }
                }
                interaction.member = interaction.guild.members.cache.get(interaction.user.id);
                command.run(client, interaction, option);
                console.log(colors.white(`[Slash]   ${interaction.user.id} : ` + crypto.AES.encrypt(`/${interaction.commandName} ${JSON.stringify(option)}`, process.env.keyEncrypt)))
            } catch (error) {
                console.error(colors.red(error))
                await interaction.reply({ content: "???? x???y ra l???i! Vui l??ng th??? l???i", ephemeral: true })
            }
        }
    })

    process.on('uncaughtException', function (err) {
        console.log(colors.red(err));
    });

    console.log(colors.bold(colors.cyan('Logging in...')));
    client.login(process.env.TOKEN).then((token) => {
        client.user.setPresence({
            status: 'online',
        });
    });
