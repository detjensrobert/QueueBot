const { prefix, colors } = require('../config.json');
const Discord = require('discord.js');

const options = {

	name: 'me',
	aliases: ['myinfo'],

	description: 'Shows the info you\'ve added for the queue message',

	cooldown: 3,
};

async function execute(message, args, db) {

	console.log("[ INFO ] Showing userdata for user " + message.author.id);

	const userdataDB = db.collection('userdata');
	const userArr = await userdataDB.find({ userID: message.author.id }).toArray();

	// if userdata not found, abort
	if (userArr.length == 0) {
		console.log("[ INFO ]  > User hasn't added info. Aborting.");
		const errEmbed = new Discord.RichEmbed().setColor(colors.error)
			.setTitle("Oops! You haven't added your info yet.")
			.setDescription(`Use \`${prefix}set\` to set that up`);
		return message.channel.send(errEmbed);
	}

	const { fc, ign, profile } = userArr[0];

	const replyEmbed = new Discord.RichEmbed().setColor(colors.info)
		.setTitle(`Your info:`)
		.setDescription(`**Switch profile**: \`${profile || "[no data]"}\` \n**IGN**: \`${ign || "[no data]"}\` \n**Friendcode**: \`${fc || "[no data]"}\``);
	return message.channel.send(replyEmbed);
}

module.exports = options;
module.exports.execute = execute;
