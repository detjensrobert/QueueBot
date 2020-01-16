const { prefix, queueCategoryID, queueAdminRoleID, colors } = require('../config.json');
const Discord = require('discord.js');

const options = {
	
	name: 'open',
	aliases: ['start', 'create'],
	
	usage: '<queue name> <capacity>',
	description: 'Creates a new queue with the given <queue name> and <capacity>.',
	
	cooldown: 5,
	minArgs: 2,
	
	mmOnly: true,
}

async function execute (message, args, db) {
	
	const capacity = parseInt(args.pop());
	const name = args.join('-').toLowerCase();
	
	if (isNaN(capacity) || capacity <= 0) {
		const errEmbed = new Discord.RichEmbed().setColor(colors.error)
			.setTitle("Oops! Queue capacity needs to be a positive number.")
			.addField("Usage:", `\`${prefix}${options.name} ${options.usage}\``);
		return message.channel.send(errEmbed);
	}
	
	// limit name length to 20 characters
	if (name.length > 20) {
		const errEmbed = new Discord.RichEmbed().setColor(colors.error)
			.setTitle("Oops! Name is too long. Max 25 chars")
			.addField("Usage:", `\`${prefix}${options.name} ${options.usage}\``);
		return message.channel.send(errEmbed);
	}
	
	console.log(`[ INFO ] Creating queue with name "${name}" and capacity ${capacity}`);
	
	const queueDB = db.collection('queues');
	
	//look for name in db to see if already used
	const findarr = await queueDB.find({name: name}).toArray();
	
	// if name already in use, abort
	if ( findarr.length != 0 ) {
		console.log("[ INFO ]  > Duplicate name. Aborting.");
		const errEmbed = new Discord.RichEmbed().setColor(colors.error)
			.setTitle("Oops! A queue with that name already exists. Please choose a different name.")
			.addField("Usage:", `\`${prefix}${options.name} ${options.usage}\``);
		return message.channel.send(errEmbed);
	}
	
	// create channel w/ perms (only allow needed people to send messages)
	const permissions = [
		{ id: message.guild.id,     deny: ['SEND_MESSAGES'], }, // @everyone
		{ id: message.client.user, allow: ['SEND_MESSAGES'], }, // the bot
		{ id: message.author,      allow: ['SEND_MESSAGES'], }, // queue host
		{ id: queueAdminRoleID,    allow: ['SEND_MESSAGES'], }, // queue admin role
	];
	const queueChannel = await message.guild.createChannel(name, {type: 'text', parent: queueCategoryID, permissionOverwrites: permissions} );
	
	const queueEmbed = new Discord.RichEmbed().setColor(colors.info)
		.setTitle(`**Queue \`${name}\`**`)
		.addField(`Capacity:  \` ${capacity} \``, `Host: ${message.author}`, );
	queueChannel.send(queueEmbed);
			
	// add new queue to db
	queueDB.insertOne({
		channelID: queueChannel.id,
		name: name,
		host: message.author.id,
		capacity: capacity,
		taken: 0,
		users: []
	});
	
	const replyEmbed = new Discord.RichEmbed().setColor(colors.success)
		.setTitle(`Queue \`${name}\` created.`)
		.setDescription(`Channel: ${queueChannel}`);
	message.channel.send(replyEmbed);
	
	console.log("[ INFO ]  > Queue and channel created. ");
	
	return;
}

module.exports = options;
module.exports.execute = execute;
