const Discord = require("discord.js");
const client = new Discord.Client();

const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

client.volume = 0.5;

client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
});


client.on("message", async message => {
  if(message.author.bot) return;

  if(message.content.indexOf(config.prefix) !== 0) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === 'join') {
    if (message.member.voiceChannel) {
      message.member.voiceChannel.join()
        .then(connection => {
          message.reply('I have successfully connected to the channel!');
        })
        .catch(console.log);
    } else {
      message.reply('You need to join a voice channel first!');
    }
  }
  
  if(command === "mp3") {
    if (!client.voiceConnections.has(message.member.voiceChanne)) {
      message.member.voiceChannel.join()
        .then(connection => {
          message.reply('I have successfully connected to the channel!');
        })
        .catch(console.log);
    }
    const fname = args.join(" ");
    const broadcast = client.createVoiceBroadcast();
    console.log(`Playing ${fname}.`); 
    broadcast.playFile('./audio/' + fname + '.mp3');
    const streamOptions = { volume: client.volume };
    for (const connection of client.voiceConnections.values()) {
        connection.playBroadcast(broadcast, volume=streamOptions);
    }
  }

  if (command === 'leave') {
    if (client.voiceConnections) {
      message.member.voiceChannel.leave();
    }
  }
  
  if(command === "volume") {
    client.volume = args.join(" ");
    message.reply('Set volume to ' + client.volume);
    for (const connection of client.voiceConnections.values()) {
        connection.volume = client.volume
    }
  }
});

client.login(config.token);