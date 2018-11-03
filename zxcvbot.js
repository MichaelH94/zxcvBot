const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const quiz = require('./quiz.json');
const mysql = require('mysql');
const msgTimer = new Set();


// Database
const connection = mysql.createConnection({
    host: config.host,
    port: config.dbPort,
    user: config.dbUser,
    password: config.dbPass, 
    database: config.dbName
});


client.on("ready", () => {
  console.log("I am ready!");
 // client.channels.get("381943210185981955").send("zxcvBot is here!")
});

client.on("message", (message) => {

    const args = message.content.slice(config.pfx.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    

    if (!message.content.startsWith(config.pfx) || message.author.bot) {
    return;
    }
    
    if(msgTimer.has(message.author.id) && message.content.startsWith(config.pfx)) {
      msg.channel.send(message.author + ": Please wait before sending another command.")
      return;
    } else { 
  
    if(command === "games") {
      setTimer(message.author.id);
      message.channel.send({embed: { 
        color: 3447003,
        author: {
          name: client.user.username,
          icon_url: client.user.avatarURL
        },
        title: "Games currently supported by zxcv",
        fields: [{
          name: "MMOS",
          value: "Guild Wars 2 (Server: Dragonbrand), OldSchool Runescape (CC: zxcv)",
        },
        {
          name: "Competitive",
          value: "Super Smash Bros. Melee, Super Smash Bros. Ultimate, League of Legends (NA)"
        }
      ] 
      }
    });
    }

    if(command === "streams") {
      setTimer(message.author.id);
      message.channel.send({embed: { 
        color: 3447003,
        author: {
          name: client.user.username,
          icon_url: client.user.avatarURL
        },
        title: "List of zxcv member streams",
        description: "[Mike1337](https://twitch.tv/zxcv1337x)" + ", "+ "[zxcvster](https://twitch.tv/zxcvster)" 
      }
    });
  }

  if(command === "quiz") {
  const item = quiz[Math.floor(Math.random() * quiz.length)];
  const filter = response => {
  return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
  };

  message.channel.send(item.question).then(() => {
    message.channel.awaitMessages(filter, { maxMatches: 1, time: 30000, errors: ['time'] })
        .then(collected => {
            message.channel.send(`${collected.first().author} got the correct answer!`);
        })
        .catch(collected => {
            message.channel.send('Looks like nobody got the answer this time.');
        });
});
  };
// Everything below is for the RPG
  if(command === "createacc") {
    setTimer(message.author.id);
    if(!args[0] == "" && !args[1] == "") {
      var userid = message.author.id;  
      var user = message.author;
      var characterName = args[0];
      var characterClass = args[1];
      message.channel.send(userid + " " + args[0] + " " + args[1])
      message.channel.send("Creating account...");
      connection.query(
        'INSERT INTO Characters (id,charname,class,lvl,xp) VALUES (' 
        + userid + ',"' + characterName + '","' + characterClass + '",1,0)'
        + 'IF NOT EXISTS (SELECT * FROM Characters WHERE id = ' + userid + ')');
      message.channel.send("Account creation finished (assuming you don't have an account already.)"); 
      message.channel.send("Okay " + user + ". You are a " + characterClass);
    } else {
      message.channel.send("In order to create your account, please use the following syntax: !createacc [Name] [Class].")
      return;
    }

  };

  if(command === "stats") {
    setTimer(message.author.id);
    var userid = message.author.id;  
    var user = message.author;
    connection.query('SELECT * FROM Characters WHERE id = ' + userid, function(err,res) {
      if (err) throw err;
      message.channel.send("Hello " + res[0].charname + "! You are a level " + res[0].lvl + " " + res[0].class + " with " + res[0].xp + " XP")
    })
  }

// Everything above is for the RPG

} }); //End of all commands, first } is for timer handling DO NOT REMOVE

function setTimer(x) {
  msgTimer.add(x);
  setTimeout(() => {
    msgTimer.delete(x);
  }, 3000)
}

client.login(config.token)
