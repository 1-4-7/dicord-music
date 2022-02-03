//Modules
const { Client, Collection, MessageEmbed, Message } = require("discord.js");
const { readdir } = require("fs");
const { Player } = require('discord-player');

const BotConf = require('./config.json');
const client = new Client();
client.cooldown = new Set();
client.player = new Player(client);
client.commands = new Collection();
client.aliases = new Collection();

client.on('ready', async () => { 
  client.user.setActivity(`${BotConf.CustomStatus}`, { type: "STREAMING", url: "https://www.twitch.tv/efeemek"})
      .then(console.log('PASS - '+ client.user.tag +' ismiyle API\'ye bağlanıldı ve bot hazır durumda.'))
      .catch(() => console.log('ERROR - Belirsiz bir hata ile karşılaşıldı.'));
}); 

readdir('./commands', (err, files) => { 
  files.forEach(fs => { 
  let command = require(`./commands/${fs}`); 
  client.commands.set(command.config.name, command);
  if(command.config.aliases) command.config.aliases.forEach(Aliases => client.aliases.set(Aliases, command.config.name));
  });
});

client.on('message', async message => {
  if (!message.guild || message.author.bot || message.channel.type === 'dm') return;
  let prefix = BotConf.BotPrefixes.filter(p => message.content.startsWith(p))[0]; 
  if (!prefix) return;
  let config = BotConf;
  let args = message.content.split(' ').slice(1);
  let command = message.content.split(' ')[0].slice(prefix.length); 
  let load = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  if (load){
   if (!message.member.hasPermission(8) && client.cooldown.has(message.author.id)) return message.channel.send(new MessageEmbed().setDescription('**5** Saniyede bir komut kullanabilirsin.').setFooter(BotConf.EmbedFooter).setColor('ffff00').setTimestamp());
    client.cooldown.add(message.author.id);
    setTimeout(() => client.cooldown.delete(message.author.id), 5000);
    load.sex(client, message, args, config);
  };
});

client.player.on("trackStart", (message, track) => message.channel.send(new MessageEmbed().setColor("008000").setAuthor(`${track.title} ==> ${message.member.voice.channel.name} kanalında çalıyor!`)));

client.player.on("botDisconnect", (message) => message.channel.send("Müzik bittiği için sesli kanaldan ayrıldım."));

client.player.on('channelEmpty', (message) => message.channel.send(` kanaldaki herkes çıktığı için müziği kapattım.`));

client.player.on('noResults', (message, query) => message.channel.send(`şarkı bulunamadı!`));

client.player.on('playlistAdd', (message, playlist) => message.channel.send(new MessageEmbed().setColor("ffff00").setAuthor(` **${playlist.items.length}** adet şarkı **${playlist.title}** başarıyla oynatma listesine eklendi.`)));

client.player.on('queueEnd', (message) => message.channel.send(`Oynatma listesinde şarkı olmadığı için müzik durduruldu.`));

client.player.on('searchCancel', (message) => message.channel.send(`Lütfen tekrar deneyin.`));

client.player.on('searchInvalidResponse', (message, tracks) => message.channel.send(`1 ve ${tracks.length} arasında bir sayı girin`));

client.player.on('searchResults', (message, query, tracks) =>  message.channel.send(new MessageEmbed().setColor("ffff00").setAuthor(`${query} için bulunan sonuçlar;`).setDescription(`${tracks.map((t, i) => `**${i + 1}** - ${t.title}`).join('\n')}`)));
  
client.player.on('trackAdd', (message, track) => message.channel.send(new MessageEmbed().setColor("008000").setAuthor(`${track.title} ismli şarkı oynatma listesine eklendi!`)));

client.player.on('error', (message, error) => { switch (error) {
  case 'NotPlaying': message.channel.send(new MessageEmbed().setColor("ff0000").setDescription("**Bu sunucuda müzik çalamıyorum!**")); break;
  case 'NotConnected': message.channel.send(new MessageEmbed().setColor("ff0000").setDescription("**Şu anda bir sesli kanalda bulunmamaktasınız!**")); break;
  case 'UnableToJoin': message.channel.send(new MessageEmbed().setColor("ff0000").setDescription("**Bulunduğunuz kanala girmem için yeterli iznim yok, gerekli izinleri verdikten sonra lütfen tekrar deneyin.**")); break;
  default: message.channel.send(new MessageEmbed().setColor("ff0000").setDescription(`**Bir şeyler ters gitti, lütfen Eon147#5279 iletişime geçin...**`));
}; });

client.login(BotConf["Client_Token"]).catch(() => console.log("ERROR - Bota giriş yapılırken başarısız olundu."));

client
.on('disconnect', () => console.log('ERROR - Bot is disconnecting...'))
.on('reconnecting', () => console.log('ERROR - Bot reconnecting...'))
.on('error', err => console.log(`ERROR - ${err}`))
.on('warn', err => console.log(`ERROR - ${err}`));

process
.on('unhandledRejection', err => console.log('ERROR - ', err))
.on('uncaughtException', err => { console.log('ERROR - ', err); process.exit(1); });
