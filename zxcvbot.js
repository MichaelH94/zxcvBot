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
  // admin.send("zxcvBot is here!")
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


    if(command === "zcommands") {
      reply.send("Currently supported commands: !games, !streams, !gz/grats/gratz !quiz (under development)");
      setTimer(userid);
    };

    if(command === "zhelp") {
      reply.send("Do !zcommands for a list of commands. The Quiz, Text RPG and RS DM simulation are under development. There is a 3 second timer between each command per user."); 
      setTimer(userid);
    }
  
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
          value: "Super Smash Bros. Melee, Super Smash Bros. Ultimate, League of Legends (NA), Apex Legends"
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

  if(command === "gz" || command === "grats" || command === "gratz") {
      let i = Math.floor(Math.random() * 11); 
      setTimer(userid);
      let u = message.author.username;


      if(args[1] == null) {
        i = 69;
      };

      switch(i) {
        case 0:
        reply.send("Congrats " + u + " on " + args[0] + " " + args[1] + "!");
        break;

        case 1:
        reply.send("Aww yeah, congratulations " + u + " on " + args[0] + " " + args[1] + "!");
        break;
        
        case 2:
        reply.send("OH HELL YEAH DUDE GRATS ON " + args[0] + " " + args[1] + " " + u + "!!!!");
        break;
        
        case 3:
        reply.send("imagine getting " + args[0] + " " + args[1] + " in 2019 LLOOOOOOOLLLLL grats tho " + u + ".")
        break;

        case 4:
        reply.send("gz " + u + "on " + args[0] + " " + args[1] + " ig lol");
        break;

        case 5: 
        reply.send("if ur not doing a drop party then idrc about ur " + args[0] + " " + args[1] + " tbfh")
        break; 

        case 6: 
        reply.send("GRATS ON " + args[0] + " " + args[1] + " " + u + "!!!!!!!!!!!11")
        break;

        case 7:
        reply.send("gz gz gz gz gz gz gz on " + args[0] + " " + args[1] + " " + u + ".");
        break;

        case 8:
        reply.send("wow " + u + ", " + args[0] + " " + args[1] + " is pretty gr8 fam gz");
        break; 
        
        case 9: 
        reply.send("zxcv wins once again because " + u + " just got " + args[0] + " " + args[1] + "!");
        break;

        case 10:
        reply.send("lmfao are u serious dude legit no1 cares about ur " + args[0] + " " + args[1] + " " + u + " u noob LOOOL")
        break;

        case 69:
        reply.send("Congrats " + u + " on your " + args[0] + "!");
        break;
      }
  }

// Everything below is for the RPG
  if(command === "createacc") {
    setTimer(userid);
    if(!args[0] == "") {
      var characterName = args[0];
      var str = 0;
      var intel = 0;
      var spd = 0;
      reply.send("Okay. " + characterName + ", right? Let's pick a class first.");
      reply.send("[1] Fighter\n[2] Mage\n[3] Rogue");
      let collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 6000 , errors: ['time'] });
      collector.on('collect', message => {
          if (message.content == 1) {
            connection.query(
              'INSERT IGNORE Characters (id,charname,class,lvl,xp,hp,stam,intel,str,spd,luck) VALUES (' 
              + userid + ',"' + characterName+ '","Fighter",1,0,100,50,5,10,5,10)');

            reply.send("Creating account...");
            reply.send("Account creation finished (assuming you don't have an account already.)"); 
            reply.send("Check your stats with !stats to confirm account creation.");
          } else if(message.content == 2) {
            connection.query(
              'INSERT IGNORE Characters (id,charname,class,lvl,xp,hp,stam,intel,str,spd,luck) VALUES (' 
              + userid + ',"' + characterName + '","Mage",1,0,100,50,10,5,5,10)');

            reply.send("Creating account...");
            reply.send("Account creation finished (assuming you don't have an account already.)"); 
            reply.send("Check your stats with !stats to confirm account creation.");
          } else if(message.content == 3) {
            connection.query(
              'INSERT IGNORE Characters (id,charname,class,lvl,xp,hp,stam,intel,str,spd,luck) VALUES (' 
              + userid + ',"' + characterName + '","Rogue",1,0,100,50,5,5,10,10)');

            reply.send("Creating account...");
            reply.send("Account creation finished (assuming you don't have an account already.)"); 
            reply.send("Check your stats with !stats to confirm account creation.");
          } else  {
              message.channel.send("You need to enter 1, 2 or 3.");
              return;
          }
      })
      
    } else {
      reply.send("In order to create your account, you need to include your character's name like this: !createacc [Name].")
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
      let hp = res[0].hp;
      let stam = res[0].stam;
      let intel = res[0].intel;
      let str = res[0].str;
      let spd = res[0].spd;
      let luck = res[0].luck;

      reply.send({embed: { 
        color: 3447003,
        author: {
          name: client.user.username,
          icon_url: client.user.avatarURL
        },
        title: charname,
        fields: [{
          name: "Stats",
          value: "Class: " + charclass + 
          "\nLevel: " + lvl + 
          "\nXP: " + xp +
          "\nHitpoints: " + hp +
          "\nStamina: " + stam + 
          "\nIntelligence: " + intel + 
          "\nStrength: " + str +
          "\nSpeed: " + spd + 
          "\nLuck: " + luck
        },
        {
          name: "Achievements",
          value: "Achievements, misc. stats will go here"
        }] 
      }    
    });
    });
  };

  if(command === "test") {
     
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
