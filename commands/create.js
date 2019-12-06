const { prefix, queueCategoryID, colors } = require('../config.json');
const Discord = require('discord.js');

const options = {
	
	name: 'create',
	aliases: ['createqueue', 'makequeue', 'start'],
	
	usage: '<queue-name> <capacity>',
	description: 'Creates new queue & channel named <queue-name> with a capacity of <capacity>.',
	
	cooldown: 5,
	args: 2,
	
	mmOnly: true,
}

async function execute (message, args, db) {
	
	const name = args[0].toLowerCase();
	const capacity = parseInt(args[1]);
	
	if (isNaN(capacity) || capacity <= 0) {
		const errEmbed = new Discord.RichEmbed().setColor(colors.error)
			.setTitle("Queue capacity needs to be a positive number.")
			.addField("Usage:", `\`${prefix}${options.name} ${options.usage}\``);
		return message.channel.send(errEmbed);
	}
	
	// limit name length to 25 characters
	if (name.length > 25) {
		const errEmbed = new Discord.RichEmbed().setColor(colors.error)
			.setTitle("Name is too long. Max 25 chars")
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
			.setTitle("A queue with that name already exists. Please choose a different name.")
			.addField("Usage:", `\`${prefix}${options.name} ${options.usage}\``);
		return message.channel.send(errEmbed);
	}
	
	// create channel
	queueChannel = await message.guild.createChannel(name, {type: 'text', parent: queueCategoryID} );
	
	const queueEmbed = new Discord.RichEmbed().setColor(colors.info)
		.setTitle(`**Queue \`${name}\`**`)
		.addField(`Capacity:  \` ${capacity} \``, `Host: ${message.author}`, );
	queueChannel.send(queueEmbed);
	
	const replyEmbed = new Discord.RichEmbed().setColor(colors.success)
		.setTitle(`Queue \`${name}\` created.`)
		.setDescription(`Channel: ${queueChannel}`);
	message.channel.send(replyEmbed);
			
	// add new queue to db
	queueDB.insertOne({
		channelID: queueChannel.id,
		name: name,
		capacity: capacity,
		available: capacity,
		users: []
	});
	
	console.log("[ INFO ]  > Queue and channel created. ");
	
	return;
}

module.exports = options;
module.exports.execute = execute;
