module.exports = {
	
	// Command options
	name: 'set',
	aliases: ['setinfo'],
	
	usage: 'profile <Switch profile name> / ign <name> / fc (SW-)XXXX-XXXX-XXXX',
	description: 'Sets your queue display info for the join queue message.\
	\nEx.: `Position: 5 | Switch Profile: Bagels | IGN: Bagels | Friendcode: SW-1234-5678-9000`',
	
	cooldown: 5,
	
	execute: (message, args, db) => {
				
		const option = args.shift();
		const value = args.join(' ');
		
		console.log("[ INFO ] Updating userdata for user " + message.author.id);
		
		if (value.length == 0) {
			let reply = `🚫 I don't understand what you're trying to set.`;
					+ `\n**Usage:** \`${prefix}${this.name} ${this.usage}\``;
		}
		
		let updated;
		
		switch (option) {
			case 'fc':
				//if not a valid code
				if ( !(value.match(/(SW-)?[0-9]{3}-[0-9]{3}-[0-9]{3}/) )) {
					let reply = `🚫 I dont't understand this friendcode.\nIs it formatted correctly?`
						+ `\n **Usage:** \`${prefix}${this.name} fc (SW-)####-####-#### \``;
				}
				updated = "Friendcode";
				break;
			case 'ign':
				
				updated = "IGN";
				break;
			case 'profile':
				updated = "Switch profile name";
				break;
			default:
				let reply = `🚫 I don't understand what you're trying to set.`;
					+ `\n**Usage:** \`${prefix}${this.name} ${this.usage}\``;
				return message.reply(reply);
		}
		
		const userdataDB = db.collection('userdata');
		
		userdataDB.updateOne({ userID: message.author.id }, { $set: {option: value, userID: message.author.id} }, {upsert: true});
		
		console.log("[ INFO ]  > "+updated+" set to " + value);
		
		message.channel.send("✅ "+updated+" set!");
		
	}
}

async function setFC(message, fc, db) {
	
	
}
