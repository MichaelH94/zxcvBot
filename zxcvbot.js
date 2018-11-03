// Constants, dependencies
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const quiz = require('./quiz.json');
const mysql = require('mysql');
const msgTimer = new Set();

// Channel control - Replace these with config at home
const general = client.channels.get("381943210185981955");
const admin = client.channels.get("489296951381065728");
const rpgchan = client.channels.get("508147971422945331");

// Database
const connection = mysql.createConnection({
    host: config.host,
    port: config.dbPort,
    user: config.dbUser,
    password: config.dbPass, 
    database: config.dbName
});

// Client intialized
client.on("ready", () => {
  console.log("I am ready!");
  admin.send("zxcvBot is here!")
});

// Command control
client.on("message", (message) => {

    const args = message.content.slice(config.pfx.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const userid = message.author.id;  
    const user = message.author;
    const reply = message.channel;
    

    if (!message.content.startsWith(config.pfx) || message.author.bot) {
    return;
    }
    
    if(msgTimer.has(userid) && message.content.startsWith(config.pfx)) {
      reply.send(user + ": Please wait before sending another command.")
      return;
    } else { 
  
    if(command === "games") {
      setTimer(userid);
      reply.send({embed: { 
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
      setTimer(userid);
      reply.send({embed: { 
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
  setTimer(userid);
  const item = quiz[Math.floor(Math.random() * quiz.length)];
  const filter = response => {
  return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
  };

  reply.send(item.question).then(() => {
    reply.awaitMessages(filter, { maxMatches: 1, time: 30000, errors: ['time'] })
        .then(collected => {
            reply.send(`${collected.first().author} got the correct answer!`);
        })
        .catch(collected => {
            reply.send('Looks like nobody got the answer this time.');
        });
});
  };

// Everything below is for the RPG
  if(command === "createacc") {
    setTimer(userid);
    if(!args[0] == "" && !args[1] == "") {
      var characterName = args[0];
      var characterClass = args[1];
      reply.send(userid + " " + args[0] + " " + args[1])
      reply.send("Creating account...");
      connection.query(
        'INSERT INTO Characters (id,charname,class,lvl,xp) VALUES (' 
        + userid + ',"' + characterName + '","' + characterClass + '",1,0)'
        + 'IF NOT EXISTS (SELECT * FROM Characters WHERE id = ' + userid + ')');
      reply.send("Account creation finished (assuming you don't have an account already.)"); 
      reply.send("Okay " + user + ". You are a " + characterClass);
    } else {
      reply.send("In order to create your account, please use the following syntax: !createacc [Name] [Class].")
      return;
    }

  };

  if(command === "stats") {
    setTimer(userid);
    connection.query('SELECT * FROM Characters WHERE id = ' + userid, (err,res) => {
      if (err) return err;
      let charname = res[0].charname;
      let lvl = res[0].lvl;
      let charclass = res[0].class;
      let xp = res[0].xp;

      reply.send({embed: { 
        color: 3447003,
        author: {
          name: client.user.username,
          icon_url: client.user.avatarURL
        },
        title: charname,
        fields: [{
          name: "Stats",
          value: charclass + ", Level: " + lvl + ", XP: " + xp,
        },
        {
          name: "Placeholder",
          value: "Achievements will go here"
        }] 
      }    
    });
    });
  };

// Everything above is for the RPG

} }); //End of all commands, first } is for timer handling DO NOT REMOVE

function setTimer(x) {
  msgTimer.add(x);
  setTimeout(() => {
    msgTimer.delete(x);
  }, 3000)
}

client.login(config.token)
