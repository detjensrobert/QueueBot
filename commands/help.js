const { prefix, colors, middlemanRoleID } = require('../config.json');
const Discord = require('discord.js');

const options = {

	name: 'help',
	aliases: ['info', '?', 'h'],

	description: 'Shows this list of commands.',

	cooldown: 5,
};
/* == HELP MESSAGE FORMAT ==
 * $NAME ($ALIASES)
 * $DESCRIP
 * Usage:
 *   $USAGE
 * Examples:
 *   $EXAMPLE
 */

async function execute(message) {

	console.log("[ INFO ] Showing help");

	const commands = message.client.commands;

	const helpEmbed = new Discord.RichEmbed().setColor(colors.info)
		.setAuthor("QueueBot Help", message.client.user.displayAvatarURL)
		.setFooter("QueueBot created by WholeWheatBagels", 'https://cdn.discordapp.com/avatars/197460469336899585/efb49d183b81f30c42b25517e057a704.png');

	commands.forEach((cmd) => {

		//               .. only show middleman-restricted commands if in a server and they have the middleman role
		if (!cmd.mmOnly || (cmd.mmOnly && message.guild && message.member.roles.has(middlemanRoleID))) {

			let helpStr = cmd.description;

			if (cmd.usage) {

				// if multiple usages
				if (Array.isArray(cmd.usage)) {
					cmd.usage.forEach(usage => helpStr += `\n\`${prefix}${cmd.name} ${usage}\``);
				}
				else {
					helpStr += `\n\`${prefix}${cmd.name} ${cmd.usage}\``;
				}

			}
			else {
				helpStr += `\n\`${prefix}${cmd.name}\``;
			}

			if (cmd.example) {
				helpStr += "\nExamples:";

				// if multiple examples
				if (Array.isArray(cmd.example)) {
					cmd.example.forEach(example => helpStr += `\n- \`${prefix}${cmd.name} ${example}\``);
				}
				else {
					helpStr += `\n- \`${prefix}${cmd.name} ${cmd.example}\``;
				}
			}

			if (cmd.mmOnly) {
				helpStr += "\n*(Middleman restricted)*";
			}

			helpEmbed.addField(`**${cmd.name}**` + (cmd.aliases ? ", " + cmd.aliases.join(", ") : ""), helpStr);

		}
	});

	message.channel.send(helpEmbed);

}

module.exports = options;
module.exports.execute = execute;
