const { MessageEmbed } = require("discord.js");

module.exports.config = { 
    name: 'skip',
    aliases: ['geç','gec']
}

module.exports.sex = async(client, message, args, config) => {

if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send("Botla aynı kanalda olmalısın!");
    
if (!message.member.voice.channel) return message.channel.send("Lütfen bir sesli kanala girin!");

if (!client.player.getQueue(message)) return message.channel.send("oynatma listesinde şarkı yok!");

client.player.skip(message);

message.channel.send(new MessageEmbed().setColor("ffff00").setAuthor(`Oynatılan şarkı geçildi.`));

};
