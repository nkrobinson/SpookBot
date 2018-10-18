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

  if (command === 'help') {
    message.channel.send('Type !<COMMAND> to start');
    message.channel.send('Available commands: join, leave, play, pause, stop, volume');
  }

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

  if (command === 'leave') {
    try {
      for (const connection of client.voiceConnections.values()) {
          connection.disconnect();
          connection.off();
      }
    } catch(err) {
      message.reply('Not in a voice channel');
    }
  }
  
  if(command === "play") {
    try {
      message.member.voiceChannel.join()
        .catch(console.log);
    } catch(err) {
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

  if (command === 'pause') {
    try {
      for (const connection of client.voiceConnections.values()) {
        if (connection.speaking) {
          connection.dispatcher.pause();
        } else {
          connection.dispatcher.resume();
        }
      }
    } catch(err) {
      message.reply('Not playing anything');
    }
  }

  if (command === 'stop') {
    try {
      for (const connection of client.voiceConnections.values()) {
        if (connection.speaking) {
          connection.dispatcher.end();
        }
      }
    } catch(err) {
      message.reply('Not playing anything');
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