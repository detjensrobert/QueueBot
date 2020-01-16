const { colors } = require('../config.json');
const Discord = require('discord.js');

const options = {
	
	name: 'setign',
	
	usage: '<In-game name>', 
	description: 'Sets your IGN individually for the join queue message.',
	
	cooldown: 3,
	minArgs: 1,
}

async function execute (message, args, db) {
	
	console.log("[ INFO ] Updating userdata for user " + message.author.id);
	
	let value = args.join(' ');
	
	// update that information in the db
	const userdataDB = db.collection('userdata');
	await userdataDB.updateOne({ userID: message.author.id }, { $set: {ign: value} }, {upsert: true});
	
	const userArr = await userdataDB.find({userID: message.author.id}).toArray();
	const { fc, ign, profile } = userArr[0];
	
	console.log("[ INFO ]  > IGN set to " + value);
	
	const replyEmbed = new Discord.RichEmbed().setColor(colors.success)
		.setTitle(`IGN set.`)
		.setDescription(`**Switch profile**: \`${profile || "[no data]"}\` \n**IGN**: \`${ign || "[no data]"}\` \n**Friendcode**: \`${fc || "[no data]"}\``);
	return message.channel.send(replyEmbed);
}

module.exports = options;
module.exports.execute = execute;
