module.exports = {
	
	// Command options
	name: 'end',
	aliases: ['delete'],
	
	usage: '<name>',
	description: 'Deletes queue and channel with <name>, if it exists.',
	
	cooldown: 2,
	args: 1,
	
	mmOnly: true,
	
	execute: async (message, args, db) => {
		const name = args[0];
		
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
		let channelID = findarr[0].channelID
		message.guild.channels.get(channelID).delete();
		
		//delete from database
		queueDB.deleteOne({ name: name });
		
		message.channel.send("✅ Queue deleted.");
		
		console.log("[ INFO ]  > Queue deleted.");
		
		return;
	}
}
