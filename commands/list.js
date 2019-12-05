
const options = {
	name: 'list',
	aliases: ['l', 'all'],
	
	description: 'Lists all current queues.',
	
	cooldown: 5,
}

async function execute (message, args, db) {
	
	console.log("[ INFO ] Listing queues.");
	
	let reply = "";
	
	const queueDB = db.collection('queues');
	
	//get all queues in database
	let dbPromise = () => {return new Promise( (resolve, reject) => {
		queueDB.find().toArray( (err, arr) => { err ? reject(err) : resolve(arr); });
	})};
	let findarr = await dbPromise();
	
	reply += `Currently ${findarr.length} active queues.`;
	console.log("[ INFO ]  > "+findarr.length+" currently active.");
	
	findarr.forEach( (elem) => {
		reply += `\n<#${elem.channelID}>: `;
		const spacesLeft = elem.capcity - elem.users.length
		reply += spacesLeft == 0 ? "No spaces left." : spacesLeft +" of "+ elem.capacity +" spaces left.";
	});
	
	message.channel.send(reply);
	
}

module.exports = options;
module.exports.execute = execute;
