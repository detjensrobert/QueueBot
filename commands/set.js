const { prefix, colors } = require('../config.json');
const Discord = require('discord.js');

const options = {
	
	name: 'set',
	aliases: ['info', 'setinfo'],
	
	usage: ['profile <Switch profile name>', 
	        'ign <In-game name>', 
	        'fc SW-####-####-####'],
	description: 'Sets your queue display info for the join queue message.',
	
	cooldown: 3,
	minArgs: 2,
}

async function execute (message, args, db) {
	
	const option = args.shift();
	let value = args.join(' ');
	let toSet = "";
	
	let usageStr = "";
	options.usage.forEach( usage => usageStr += `\`${prefix}${options.name} ${usage}\`\n`);
	
	if (value.length == 0) {
		const errEmbed = new Discord.RichEmbed().setColor(colors.error)
			.setTitle("Could not parse what you're trying to set.")
			.addField("Usage:", usageStr);
		return message.channel.send(errEmbed);
	}
	
	console.log("[ INFO ] Updating userdata for user " + message.author.id);
	
	let updated;
	
	switch (option) {
		case 'fc':
		case 'friendcode':
			toSet = 'fc';
			//if not a valid code, abort
			const fcRegex = new RegExp(/(SW-)?[0-9]{4}-[0-9]{4}-[0-9]{4}/);
			if ( !(fcRegex.test(value)) ) {
				console.log("[ INFO ]  > Bad friendcode. Aborting.");
				const errEmbed = new Discord.RichEmbed().setColor(colors.error)
					.setTitle("Could not parse friendcode. Is it formatted correctly?")
					.addField("Usage:", `\`${prefix}${options.name} ${options.usage[2]}\``);
				return message.channel.send(errEmbed);
			}
			updated = "Friendcode";
			if (value.length == 14) { value = "SW-"+value }
			break;
			
		case 'ign':
		case 'gamename':
			toSet = 'ign';
			updated = "IGN";
			break;
			
		case 'profile':
		case 'profilename':
			toSet = 'profile';
			updated = "Switch profile name";
			break;
			
		default:
			console.log("[ INFO ]  > ");
			const errEmbed = new Discord.RichEmbed().setColor(colors.error)
				.setTitle("I don't understand what you're trying to set.")
				.addField("Usage:", usageStr);
			return message.channel.send(errEmbed);
	}
	
	// update that information in the db
	const userdataDB = db.collection('userdata');
	await userdataDB.updateOne({ userID: message.author.id }, { $set: {[`${toSet}`]: value} }, {upsert: true});
	
	userArr = await userdataDB.find({userID: message.author.id}).toArray();
	const { fc, ign, profile } = userArr[0];
	
	console.log("[ INFO ]  > "+updated+" set to " + value);
	
	const replyEmbed = new Discord.RichEmbed().setColor(colors.success)
		.setTitle(`${updated} set.`)
		.setDescription(`**Switch profile**: \`${profile || "[no data]"}\` \n**IGN**: \`${ign || "[no data]"}\` \n**Friendcode**: \`${fc || "[no data]"}\``);
	return message.channel.send(replyEmbed);
	
}

module.exports = options;
module.exports.execute = execute;
