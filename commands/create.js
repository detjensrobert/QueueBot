const { prefix, queueCategoryID } = require('../config.json');

const options = {
	
	name: 'create',
	aliases: ['createqueue', 'makequeue', 'start'],
	
	usage: '<queue-name> <length>',
	description: 'Creates new queue & channel named <queue-name> with a capacity of <length>.',
	
	cooldown: 5,
	args: 2,
	
	mmOnly: true,
}

async function execute (message, args, db) {
	
	const name = args[0].toLowerCase();
	const length = parseInt(args[1]);
	
	if (isNaN(length) || length <= 0) {
		let reply = `🚫 Queue length needs to be a positive number.`
			+`\n**Usage:** \`${prefix}${this.name} ${this.usage}\``;
		return message.reply(reply);
	}
	
	// limit name length to 25 characters
	if (name.length > 25) {
		let reply = `🚫 Name is too long! Max 25 chars.`
			+`\n**Usage:** \`${prefix}${this.name} ${this.usage}\``;
		return message.reply(reply);
	}
	
	console.log(`[ INFO ] Creating queue with name "${name}" and length ${length}`);
	
	const queueDB = db.collection('queues');
	
	
	//look for name in db to see if already used
	let dbPromise = () => {return new Promise( (resolve, reject) => {
		queueDB.find({name: name}).toArray( (err, arr) => { err ? reject(err) : resolve(arr); });
	})};
	let findarr = await dbPromise();
	
	// if name already in use, abort
	if ( findarr.length !== 0 ) {
		message.channel.send("🚫 A queue with that name already exists! Please choose a different name.");
		console.log("[ INFO ]  > Duplicate name. Aborting.");
		return;
	}
	
	// create channel
	channelPromise = message.guild.createChannel("queue-"+name, {type: 'text', parent: queueCategoryID} )
	queueChannel = await channelPromise;
	queueChannel.send("Created by " + message.author + "\nCapacity: " + length);
	
	message.channel.send("✅ Queue `"+name+"` created. Channel: " + queueChannel);
			
	// add new queue to db
	queueDB.insertOne({
		channelID: queueChannel.id,
		name: name,
		length: length
	});
	
	console.log("[ INFO ]  > Queue and channel created. ");
	
	return;
}

module.exports = options;
module.exports.execute = execute;
