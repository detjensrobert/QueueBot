module.exports = {
	
	// Command options
	name: 'join',
	aliases: ['add'],
	
	usage: '<queue name>',
	description: 'Adds you to the specified queue and sends a message with your info in the queue channel.',
	
	cooldown: 5,
	args: 1,
	
	execute: async (message, args, db) => {
		
		const name = args[0];
		
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
		
		
		// look for userdata in db
		dbPromise = () => {return new Promise( (resolve, reject) => {
			userdataDB.find({userID: message.author.id}).toArray( (err, arr) => { err ? reject(err) : resolve(arr); });
		})};
		userArr = await dbPromise();
		
		// if userdata not found, abort
		if ( userArr.length == 0 ) {
			message.channel.send("🚫 You haven't add your info yet. Use `"+prefix+"set` to set that up.");
			console.log("[ INFO ]  > User hasn't added info. Aborting.");
			return;
		}
		
		
		// post info to channel
		const position = queueArr[0].length;
		const { fc, ign, profile } = userArr[0];
		
		let channelID = queueArr[0].channelID;
		message.guild.channels.get(channelID).send(`Position: ${postition} | Switch profile: ${profile} | IGN: ${ign} | Friendcode: ${fc}`);
		
		// decrease available queue spots
		queueDB.updateOne({name: name}, {$inc: {length: -1} });
		
		message.channel.send("✅ Added you to the queue. You're in position "+position);
		
	}
}
