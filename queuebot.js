const Discord = require('discord.js');
const client = new Discord.Client();

// file i/o
const fs = require('fs');

// grab settings from file
const {token} = require('./token.json')
const config = require('./config.json')


// import commands from dir
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	console.log("[STARTUP] Adding command " + file);
	const command = require("./commands/" + file);
	client.commands.set(command.name, command);
}


const cooldowns = new Discord.Collection();

client.once('ready', () => {
	console.log(`[STARTUP] Ready.`);
});

client.on('message', msg => {
	
	// ignore bot messages
	if (message.author.bot) { return; }
	
	// ignore messages that dont start with a valid prefix
	if (!message.content.startsWith(prefix)) { return; }

	// turn message into array
	const args = message.content.slice(prefix.length).split(/ +/);
	
	// pull first word (the command) out
	const commandName = args.shift().toLowerCase();

	// if command specified does not exist
	const command = client.commands.get(commandName) || 
					client.commands.find( cmd => cmd.aliases && cmd.aliases.includes(commandName) );

	if (!command) return;
	
		
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
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}
	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	
	
	// ==============
	// ACTUAL COMMAND CALL
	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}

});

client.login(token);
