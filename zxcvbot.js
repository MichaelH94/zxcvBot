const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", (message) => {
    const args = message.content.slice(config.pfx.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (!message.content.startsWith(config.pfx) || message.author.bot) {
    return;
    ;}

    
});


client.login(config.token)
