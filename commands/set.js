const { prefix } = require('../config.json');


const options = {
	
	name: 'set',
	aliases: ['info', 'setinfo'],
	
	usage: ['profile <Switch profile name>', 'ign <name>', 'fc SW-XXXX-XXXX-XXXX'],
	description: 'Sets your queue display info for the join queue message.',
	
	cooldown: 5,
}

async function execute (message, args, db) {
	
	let option = args.shift();
	if (option) option = option.toLowerCase();
	let value = args.join(' ');
	
	if (value.length == 0) {
		let reply = `🚫 I don't understand what you're trying to set.\n**Usage:** \`${prefix}${options.name} ${options.usage}\``;
	}
	
	console.log("[ INFO ] Updating userdata for user " + message.author.id);
	
	let updated;
	
	switch (option) {
		case 'fc':
			//if not a valid code, abort
			const fcRegex = new RegExp(/(SW-)?[0-9]{4}-[0-9]{4}-[0-9]{4}/);
			if ( !(fcRegex.test(value)) ) {
				console.log("[ INFO ]  > Bad friendcode. Aborting.");
				let reply = `🚫 I dont't understand this friendcode. Is it formatted correctly?`
					+ `\n **Usage:** \`${prefix}${options.name} ${options.usage[2]}\``;
				return message.channel.send(reply);
			}
			updated = "Friendcode";
			if (value.length == 14) { value = "SW-"+value }
			break;
			
		case 'ign':
			updated = "IGN";
			break;
			
		case 'profile':
			updated = "Switch profile name";
			break;
			
		default:
			let reply = `🚫 I don't understand what you're trying to set.\n**Usage:** \`${prefix}${options.name} ${options.usage.join(" / ")}\``;
			return message.channel.send(reply);
	}
	
	// update that information in the db
	const userdataDB = db.collection('userdata');
	
	await userdataDB.updateOne({ userID: message.author.id }, { $set: {[`${option}`]: value} }, {upsert: true});
	
	// get user's info from db to show updated value
	let dbPromise = () => {return new Promise( (resolve, reject) => {
		userdataDB.find({userID: message.author.id}).toArray( (err, arr) => { err ? reject(err) : resolve(arr); });
	})};
	userArr = await dbPromise();
	const { fc, ign, profile } = userArr[0];
	
	console.log("[ INFO ]  > "+updated+" set to " + value);
	
	message.channel.send("✅ "+updated+" set!\n**Switch profile**: `" + (profile || "[no data]") 
		+ "` | **IGN**: `" + (ign || "[no data]") + "` | **Friendcode**: `" + (fc || "[no data]") + "`");
	
}

module.exports = options;
module.exports.execute = execute;
