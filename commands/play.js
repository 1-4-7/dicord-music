const { MessageEmbed } = require('discord.js');

module.exports.config = { 
    name: 'play',
    aliases: ['oynat','çal','cal','p']
}

module.exports.sex = async(client, message, args, config) => {

if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send("Botla aynı kanalda olmalısın!**");
  
if (!message.member.voice.channel) return message.channel.send("Şarkı açmak için lütfen herhangi bir ses kanalına girin!");

if (!args[0]) return message.channel.send("Lütfen bir şarkı ismi yazın!");

client.player.play(message, args.join(" "));

};
