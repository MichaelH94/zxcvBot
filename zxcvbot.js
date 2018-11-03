const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const quiz = require('./quiz.json');
const mysql = require('mysql');
// const inquirer = require('inquirer');


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

    if(command === "games") {
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
          value: "Super Smash Bros. Melee, League of Legends (NA)"
        }
      ] 
      }
    });
    }

    if(command === "streams") {
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

  if(command === "createacc") {
    message.channel.send("This is currently a test! Let's make you an account.. maybe")
    var userid = message.author.id;  
    var user = message.author;
    message.channel.send("Hey " + user + " let's test uhh, this bot accepting new messages or maybe we'll change the syntax");
    message.channel.send("Okay. Let's test this properly now")
    message.channel.send("To create an account we need: ID, Name, Class");
    message.channel.send(userid + " " + args[0] + " " + args[1])
    message.channel.send("Okay, let's load this into the database");
    connection.query('INSERT INTO Characters (id,charname,class,lvl,xp) VALUES (' + userid + ',"' + args[0] + '","' + args[1] + '",1,0)');
    message.channel.send("Now, let's see if it worked. Please god.");
  };

  if(command === "showacc") {
    var userid = message.author.id;  
    var user = message.author;
    connection.query('SELECT * FROM Characters WHERE id = ' + userid, function(err,res) {
      if (err) throw err;
      message.channel.send("Hello " + res[0].charname + "! You are a level " + res[0].lvl + " " + res[0].class + " with " + res[0].xp + " XP")
    })
  }

}); //End of all commands


client.login(config.token)
