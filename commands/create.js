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
	
	execute: async (message, args, db) => {
		const name = args[0];
		const length = parseInt(args[1]);
		
		const queueDB = db.collection('queues');
		
		if (isNaN(length)) {
			let reply = `Queue length needs to be a number.`;

			if (this.usage) {
				reply += `\n**Usage:** \`${prefix}${this.name} ${this.usage}\``;
			}

			return message.reply(reply);
		}
		
		console.log(`[ INFO ] Creating queue with name "${name}" and length ${length}`);
		
		
		//look for name in db to see if already used
		let dbPromise = () => {return new Promise( (resolve, reject) => {
			queueDB.find({name: name}).toArray( (err, arr) => { err ? reject(err) : resolve(arr); });
		})};
		let findarr = await dbPromise();
		
		// if name already in use, abort
		if ( findarr.length !== 0 ) {
			message.channel.send("A channel with that name already exists! Please choose a different name.");
			console.log("[ INFO ] Duplicate name. Aborting.");
			return;
		}
		
		// create channel
		channelPromise = message.guild.createChannel("queue-"+name, {type: 'text', parent: queueCategoryID} )
		queueChannel = await channelPromise;
			
		message.channel.send("Queue `"+name+"` created. Channel: " + queueChannel);
		
		console.log("[ INFO ] Channel "+ queueChannel.id +" created.");
		
		// add new queue to db
		queueDB.insertOne({
			channelID: queueChannel.id,
			name: name,
			length: length
		});
		
		return;
	}
}
