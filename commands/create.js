const { queueCategoryID } = require('../config.json')

module.exports = {
	
	// Command options
	name: 'create',
	aliases: ['createqueue', 'makequeue'],
	
	usage: '<name> <length>',
	description: 'Creates new queue & channel named <name> with a capacity of <length>.',
	
	cooldown: 5,
	args: 2,
	
	mmOnly: true,
	
	execute: async (message, args) => {
		const name = args[0];
		const length = parseInt(args[1]);
		
		if (isNaN(length)) {
			let reply = `I don't understand.`;

			if (this.usage) {
				reply += `\n**Usage:** \`${prefix}${this.name} ${this.usage}\``;
			}

			return message.reply(reply);
		}
		
		console.log(`[ INFO ] Creating queue with name "${name}" and length ${length}`);
		
		channelPromise = message.guild.createChannel("queue-"+name, {type: 'text', parent: queueCategoryID} )
		queueChannel = await channelPromise;
			
		message.channel.send("Queue `"+name+"` created. Channel: " + queueChannel);
		
		console.log("[ INFO ] Channel "+ queueChannel.id +" created.");
	}
}
