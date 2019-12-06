const { prefix, colors } = require('../config.json');
const Discord = require('discord.js');

const options = {
	
	// Command options
	name: 'join',
	aliases: ['add', 'enter'],
	
	usage: '<queue-name>',
	description: 'Adds you to the specified queue and sends a message with your info in the queue channel.',
	
	cooldown: 5,
	args: 1,
}

async function execute (message, args, db) {
	
	const name = args[0].toLowerCase();
	
	const queueDB = db.collection('queues');
	const userdataDB = db.collection('userdata');
	
	console.log(`[ INFO ] Adding user to queue "${name}"`);
	
	// look for queue in db
	let queueArr = await queueDB.find({name: name}).toArray();
	
	// if queue not found, abort
	if ( queueArr.length == 0 ) {
		console.log("[ INFO ]  > No queue by that name. Aborting.");
		const errEmbed = new Discord.RichEmbed().setColor(colors.error)
			.setTitle(`Could not find queue \`${name}\`.`);
		return message.channel.send(errEmbed);
	}
	
	const { capacity, users, available, channelID } = queueArr[0];
	
	// if already in the queue
	if (users.includes(message.author.id)) {
		console.log("[ INFO ]  > User already in queue. Aborting.");
		const errEmbed = new Discord.RichEmbed().setColor(colors.error)
			.setTitle(`You're already in queue \`${name}\`.`);
		return message.channel.send(errEmbed);
	}
	
	// if queue is full
	if (available == 0) {
		console.log("[ INFO ]  > Queue full. Aborting.");
		const errEmbed = new Discord.RichEmbed().setColor(colors.error)
			.setTitle(`Queue \`${name}\` is full`);
		return message.channel.send(errEmbed);
	}
	
	// look for userdata in db
	userArr = await userdataDB.find({userID: message.author.id}).toArray();
	
	// if userdata not found, abort
	if ( userArr.length == 0 ) {
		console.log("[ INFO ]  > User hasn't added info. Aborting.");
		const errEmbed = new Discord.RichEmbed().setColor(colors.error)
			.setTitle("You haven't added your info yet.")
			.setDescription(`Use \`${prefix}set\` to set that up`);
		return message.channel.send(errEmbed);
	}
	if ( !(userArr[0].fc && userArr[0].ign && capacity) ) {
		console.log("[ INFO ]  > User hasn't added info. Aborting.");
		const errEmbed = new Discord.RichEmbed().setColor(colors.error)
			.setTitle("You haven't added all of your info yet.")
			.setDescription(`Make sure you \`${prefix}set\` all three.`);
		return message.channel.send(errEmbed);
	}
	
	// make channel visible to user
	message.guild.channels.get(channelID).overwritePermissions(message.author, { 'SEND_MESSAGES': true });
		
	// post info to channel
	const { fc, ign, profile } = userArr[0];
	
	const queueEmbed = new Discord.RichEmbed().setColor(colors.success)
		.setDescription(`\`${capacity-available+1}/${capacity}\` ${message.author} \n**Switch profile**: \`${profile}\` \n**IGN**: \`${ign}\` \n**Friendcode**: \`${fc}\``);
	message.guild.channels.get(channelID).send(queueEmbed);
	
	// decrease available queue spots
	queueDB.updateOne({name: name}, {$inc: {available: -1}, $push: {users: message.author.id} });
	
	// confirmation message
	const replyEmbed = new Discord.RichEmbed().setColor(colors.success)
		.setTitle("Added you to the queue.")
		.setDescription(`You're in position ${capacity-available+1} of ${capacity}.`);
	message.channel.send(replyEmbed);
	
}

module.exports = options;
module.exports.execute = execute;
