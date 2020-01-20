const config = require('../config.json');
const Discord = require('discord.js');

const options = {

	name: 'set',
	aliases: ['setall'],

	usage: '<Profile name> | <ign> | <SW-####-####-####>',
	description: 'Sets your queue display info for the join queue message.',

	cooldown: 3,
	minArgs: 5,
};

async function execute(message, args, db) {

	const values = args.join(' ').split(' | ');

	if (values.length != 3) {
		const errEmbed = new Discord.RichEmbed().setColor(config.colors.error)
			.setTitle("Oops! Could not parse what you're trying to set.")
			.addField("Usage:", `\`${config.prefix}${options.name} ${options.usage}\``);
		return message.channel.send(errEmbed);
	}

	console.log("[ INFO ] Updating userdata for user " + message.author.id);

	// if not a valid code, abort
	const fcRegex = new RegExp(/(SW-)?[0-9]{4}-[0-9]{4}-[0-9]{4}/);
	if (!(fcRegex.test(values[2]))) {
		console.log("[ INFO ]  > Bad friendcode. Aborting.");
		const errEmbed = new Discord.RichEmbed().setColor(config.colors.error)
			.setTitle("Oops! Could not parse friendcode. Is it formatted correctly?")
			.addField("Usage:", `\`${config.prefix}${options.name} ${options.usage}\``);
		return message.channel.send(errEmbed);
	}
	if (values[2].length == 14) { values[2] = "SW-" + values[2]; }

	// update that information in the db
	const userdataDB = db.collection('userdata');
	await userdataDB.updateOne({ userID: message.author.id }, { $set: { profile: values[0], ign: values[1], fc: values[2] } }, { upsert: true });

	console.log("[ INFO ]  > Userdata set to " + values);

	const replyEmbed = new Discord.RichEmbed().setColor(config.colors.success)
		.setTitle(`Info set.`)
		.setDescription(`**Switch profile**: \`${values[0] || "[no data]"}\` \n**IGN**: \`${values[1] || "[no data]"}\` \n**Friendcode**: \`${values[2] || "[no data]"}\``);
	return message.channel.send(replyEmbed);

}

module.exports = options;
module.exports.execute = execute;
