const Discord = require('discord.js');
const client = new Discord.Client();

// file i/o
const fs = require('fs');

// grab settings from file
const { token } = require('./token.json')
const { prefix, middlemanRoleID } = require('./config.json')

// connect to mongodb server
const MongoClient = require('mongodb').MongoClient;


// import commands from dir
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	console.log("[ START ] Adding command " + file);
	const command = require("./commands/" + file);
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();


client.once('ready', () => {
	console.log(`[ START ] Ready.`);
});

client.on('message', message => {
		
	// ignore messages that dont start with a valid prefix
	if (!message.content.startsWith(prefix)) { return; }
	
	// ignore bot messages
	if (message.author.bot) { return; }
	
	// ignore DMs
	if (message.channel.type !== "text") { return; }

	// turn message into array
	const args = message.content.trim().slice(prefix.length).split(/ +/);
	
	// pull first word (the command) out
	const commandName = args.shift().toLowerCase();

	// get command from name or alias
	const command = client.commands.get(commandName) || 
					client.commands.find( cmd => cmd.aliases && cmd.aliases.includes(commandName) );
	
	if (!command) return;
	
	
	// == CHECK OPTIONS ==
	
	// if middleman only
	if (command.mmOnly && !message.member.roles.has(middlemanRoleID)) { return; }
	
	if (command.args && args.length != command.args) {
		let reply = `I don't understand.`;

		if (command.usage) {
			reply += `\n**Usage:** \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.reply(reply);
	}
	
	
	
	// == COOLDOWN HANDLING ==
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}
	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;
	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s)!`);
		}
	}
	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	
	
	
	// ==============
	// ACTUAL COMMAND CALL
	try {
		command.execute(message, args);
	} catch (error) {
		console.error("[ ERROR ] " +error);
		message.reply('there was an error trying to execute that command!');
	}

});

client.login(token);
