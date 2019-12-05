const { prefix } = require('../config.json');

const options = {
	
	// Command options
	name: 'join',
	aliases: ['add'],
	
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
	let dbPromise = () => {return new Promise( (resolve, reject) => {
		queueDB.find({name: name}).toArray( (err, arr) => { err ? reject(err) : resolve(arr); });
	})};
	let queueArr = await dbPromise();
	
	// if queue not found, abort
	if ( queueArr.length == 0 ) {
		message.channel.send("🚫 No queues by that name exist.");
		console.log("[ INFO ]  > No queue by that name. Aborting.");
		return;
	}
	
	const { capacity, users, length } = queueArr[0];
	
	// if already in the queue
	if (users.includes(message.author.id)) {
		message.channel.send("🚫 You're already in this queue.");
		console.log("[ INFO ]  > User already in queue. Aborting.");
		return;
	}
	
	// if queue is full
	if (capacity == length) {
		message.channel.send("🚫 This queue is full.");
		console.log("[ INFO ]  > Queue full. Aborting.");
		return;
	}
	
	// look for userdata in db
	dbPromise = () => {return new Promise( (resolve, reject) => {
		userdataDB.find({userID: message.author.id}).toArray( (err, arr) => { err ? reject(err) : resolve(arr); });
	})};
	userArr = await dbPromise();
	
	// if userdata not found, abort
	if ( userArr.length == 0 ) {
		message.channel.send("🚫 You haven't added your info yet. Use `"+prefix+"set` to set that up.");
		console.log("[ INFO ]  > User hasn't added info. Aborting.");
		return;
	}
	if ( !(userArr[0].fc && userArr[0].ign && capacity) ) {
		message.channel.send("🚫 You're missing some of your info. Make sure to `"+prefix+"set` all three.");
		console.log("[ INFO ]  > User hasn't added info. Aborting.");
		return;
	}
		
	// post info to channel
	const { fc, ign, profile } = userArr[0];
	
	let channelID = queueArr[0].channelID;
	message.guild.channels.get(channelID).send(`**\`${length+1}/${capacity}\`** | ${message.author} | **Switch profile**: \`${profile}\` | **IGN**: \`${ign}\` | **Friendcode**: \`${fc}\``);
	
	// decrease available queue spots
	queueDB.updateOne({name: name}, {$inc: {length: 1}, $push: {users: message.author.id} });
	
	message.channel.send(`✅ Added you to the queue. You're in position ${length+1} of ${capacity}`);
	
}

module.exports = options;
module.exports.execute = execute;
