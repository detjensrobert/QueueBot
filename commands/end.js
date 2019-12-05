const { prefix } = require('../config.json');


const options = {
	
	name: 'end',
	aliases: ['delete', 'close'],
	
	usage: '<queue-name>',
	description: 'Ends queue and deletes its channel.',
	
	cooldown: 2,
	args: 1,
	
	mmOnly: true,
}

async function execute (message, args, db) {
	const name = args[0].toLowerCase();
		
	const queueDB = db.collection('queues');
	
	console.log(`[ INFO ] Deleting queue "${name}"`);
	
	
	// look for name in db to see if already used
	let dbPromise = () => {return new Promise( (resolve, reject) => {
		queueDB.find({name: name}).toArray( (err, arr) => { err ? reject(err) : resolve(arr); });
	})};
	let findarr = await dbPromise();
	
	// if name not found, abort
	if ( findarr.length == 0 ) {
		message.channel.send("🚫 No queues by that name exist.");
		console.log("[ INFO ]  > No queue by that name. Aborting.");
		return;
	}
	
	//delete channel
	let channelID = findarr[0].channelID;
	message.guild.channels.get(channelID).delete();
	
	//delete from database
	queueDB.deleteOne({ name: name });
	
	message.channel.send("✅ Queue deleted.");
	
	console.log("[ INFO ]  > Queue deleted.");
	
	return;
	
}

module.exports = options;
module.exports.execute = execute;
