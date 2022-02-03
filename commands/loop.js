const { MessageEmbed } = require("discord.js");


module.exports.config = { 
    name: 'loop',
    aliases: ['döngü']
}

module.exports.sex = async(client, message, args, config) => {

if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(new MessageEmbed().setColor('ffff00').setDescription("**Botla aynı kanalda olmalısın!**"));
    
if (!message.member.voice.channel) return message.channel.send("Lütfen bir sesli kanala girin!");

if (!client.player.getQueue(message)) return message.channel.send("Döngüye almak için bir şarkı ekleyin!");

let repeatMode = client.player.getQueue(message).repeatMode
if (repeatMode) { client.player.setRepeatMode(message, false); return message.channel.send(`Döngü  devre dışı bırakıldı!`);
} else { client.player.setRepeatMode(message, true); return message.channel.send(`Döngü aktive edildi!`)}; 

};
