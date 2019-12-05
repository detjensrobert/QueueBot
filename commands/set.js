const { prefix } = require('../config.json');


const options = {
	
	name: 'set',
	aliases: ['setinfo'],
	
	usage: ['profile <Switch profile name>', 'ign <name>', 'fc SW-XXXX-XXXX-XXXX'],
	description: 'Sets your queue display info for the join queue message.',
	
	cooldown: 5,
}

async function execute (message, args, db) {
	
	const option = args.shift().toLowerCase();
	let value = args.join(' ');
	
	if (value.length == 0) {
		let reply = `🚫 I don't understand what you're trying to set.\n**Usage:** \`${prefix}${options.name} ${options.usage}\``;
	}
	
	console.log("[ INFO ] Updating userdata for user " + message.author.id);
	
	let updated;
	
	switch (option) {
		case 'fc':
			const fcRegex = new RegExp(/(SW-)?[0-9]{4}-[0-9]{4}-[0-9]{4}/);
			//if not a valid code
			console.log("checking:", value, fcRegex.test(value));
			if ( !(fcRegex.test(value)) ) {
				let reply = `🚫 I dont't understand this friendcode.\nIs it formatted correctly?`
					+ `\n **Usage:** \`${prefix}${this.name} fc (SW-)####-####-#### \``;
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
			let reply = `🚫 I don't understand what you're trying to set.\n**Usage:** \`${prefix}${options.name} ${options.usage}\``;
			return message.channel.send(reply);
	}
	
	const userdataDB = db.collection('userdata');
	
	userdataDB.updateOne({ userID: message.author.id }, { $set: {[`${option}`]: value} }, {upsert: true});
	
	console.log("[ INFO ]  > "+updated+" set to " + value);
	
	message.channel.send("✅ "+updated+" set!");
	
}

module.exports = options;
module.exports.execute = execute;
