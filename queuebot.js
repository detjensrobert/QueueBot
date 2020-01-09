const Discord = require('discord.js');
const client = new Discord.Client();

// file i/o
const fs = require('fs');

// grab settings from file
const { token } = require('./token.json')
const { prefix, colors, middlemanRoleID, restrictToChannel } = require('./config.json')

// connect to mongodb server
const MongoClient = require('mongodb').MongoClient;
const mdbconf = require('./mongodb_config.json'); // mdbconf == mongoconfig
mdbconf.port = mdbconf.port || "27017";
//~ const mongoURL = `mongodb://${mdbconf.user}:${mdbconf.pass}@${mdbconf.host}:${mdbconf.port}/`;
const mongoURL = `mongodb://${mdbconf.host}:${mdbconf.port}/`;
var db;

// import commands from dir
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require("./commands/" + file);
	client.commands.set(command.name, command);
	
	console.log("[ START ] Added command: " + command.name);
}

const cooldowns = new Discord.Collection();


// =======


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
	
	// only listen in specified channel, if given
	if (restrictToChannel && message.channel.id != restrictToChannel) { return; }
	
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
	
	if (command.minArgs && args.length < command.minArgs) {
		const errEmbed = new Discord.RichEmbed().setColor(colors.error)
			.setTitle("I don't understand. Are you missing something?")
			.addField("Usage:", `\`${prefix}${command.name} ${command.usage}\``);
		return message.channel.send(errEmbed);
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
			const errEmbed = new Discord.RichEmbed().setColor(colors.error)
				.setTitle(`Wait ${timeLeft.toFixed(1)} more second(s) to call this again.`);
			return message.channel.send(errEmbed);
		}
	}
	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	
	
	// ==============
	// ACTUAL COMMAND CALL
	try {
		command.execute(message, args, db);
	} catch (error) {
		console.error("[ ERROR ] " +error);
		message.reply('there was an error trying to execute that command!');
	}

});

// Login to database and Discord
// but only login to Discord once db is ready
console.log(`[ START ] Connecting to MongoDB ( ${mongoURL} )`);
MongoClient.connect(mongoURL, function (err, mongoclient) {
	if (err) { throw err; }
	
	db = mongoclient.db(mdbconf.dbname);
	
	console.log("[ START ] Logging in to Discord...");
	client.login(token);
});

