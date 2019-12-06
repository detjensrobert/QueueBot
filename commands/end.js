const { prefix, colors } = require('../config.json');
const Discord = require('discord.js');

const options = {
	
	name: 'end',
	aliases: ['delete', 'close'],
	
	usage: '<queue-name>',
	description: 'Ends queue and deletes its channel.',
	
	cooldown: 5,
	args: 1,
	
	mmOnly: true,
}

async function execute (message, args, db) {
	const name = args[0].toLowerCase();
		
	const queueDB = db.collection('queues');
	
	console.log(`[ INFO ] Deleting queue "${name}"`);
	
	// look for name in db to see if already used
	let findarr = await queueDB.find({name: name}).toArray();
	
	// if name not found, abort
	if ( findarr.length == 0 ) {
		console.log("[ INFO ]  > No queue by that name. Aborting.");
		const errEmbed = new Discord.RichEmbed().setColor(colors.error)
			.setTitle(`Could not find queue \`${name}\`.`)
		return message.channel.send(errEmbed);
	}
	
	//delete channel
	let channelID = findarr[0].channelID;
	message.guild.channels.get(channelID).delete();
	
	//delete from database
	queueDB.deleteOne({ name: name });
	
	console.log("[ INFO ]  > Queue deleted.");
	
	const replyEmbed = new Discord.RichEmbed().setColor(colors.success)
		.setTitle(`Queue \`${name}\` deleted.`);
	message.channel.send(replyEmbed);
}

module.exports = options;
module.exports.execute = execute;
