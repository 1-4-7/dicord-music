const { MessageEmbed } = require('discord.js');

module.exports.config = { 
    name: 'np',
    aliases: ['çalanşarkı','calansarki']
}

module.exports.sex = async(client, message, args, config) => {

if (!message.member.voice.channel) return message.channel.send("Lütfen bir sesli kanala girin!");

if (!client.player.getQueue(message)) return message.channel.send("şu anda şarkı çalmıyor");

const track = await client.player.nowPlaying(message);
const filters = [];
Object.keys(client.player.getQueue(message).filters).forEach((filterName) => { if (client.player.getQueue(message).filters[filterName]) filters.push(filterName); });

message.channel.send({ embed: { color: 'ffff00', author: { name: track.title }, footer: { text: `${config.EmbedFooter}` },
    fields: [ { name: 'Kanal', value: track.author, inline: true }, { name: 'Şarkıyı Açan', value: track.requestedBy.username, inline: true },
                { name:  "Oynatma listesinden mi?", value: track.fromPlaylist ? 'Evet' : 'Hayır', inline: true },
                { name: 'İzlenme Sayısı', value: track.views, inline: true },
                { name: 'Şarkı Süresi', value: track.duration, inline: true },
                { name: 'Filtre Aktivesi', value: filters.length, inline: true },
                { name: 'Oynatılma Süresi', value: client.player.createProgressBar(message, { timecodes: true }), inline: true }
            ],
            thumbnail: { url: track.thumbnail },
            timestamp: new Date(),
        },
    });
};

