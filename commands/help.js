const { prefix, embedColor, middlemanRoleID } = require('../config.json');
const Discord = require('discord.js');

module.exports = {
	
	name: 'help',
	aliases: ['?', 'h'],
	
	description: 'Shows this list of commands.',
	
	cooldown: 5,
	
	
	execute(message, args) {
		
		const commands = message.client.commands;
		
		const embed = new Discord.RichEmbed()
			.setAuthor("QueueBot Help" , message.client.user.displayAvatarURL)
			.setColor(embedColor);
		
		
		commands.forEach((cmd) => {
			
			// only show middleman-restricted commands if in a server and has the middleman role
			if ( !cmd.mmOnly || (cmd.mmOnly && message.guild && message.member.roles.has(middlemanRoleID)) ) {
				let usage_str = "Usage: `" + prefix+cmd.name;
			
				if (cmd.usage) {
					usage_str += " " + cmd.usage;
				}
				
				usage_str += "`";
				
				//~ if (cmd.aliases) {
					//~ usage_str += "\nAliases: `" + prefix+cmd.name + "`";
					//~ for (i = 1; i < cmd.aliases.length; i++) {
						//~ usage_str += ", `" + prefix+cmd.aliases[i] + "`";
					//~ }
				//~ }
				
				embed.addField(`**${cmd.name}**: ${cmd.description}`, usage_str);
				
			}
		})

		message.author.send({embed})
			.then(() => {
				if (message.channel.type === 'dm') return;
				message.reply('help message sent to your DMs.');
			})
			.catch(error => {
				console.error(`[ ERROR ] Could not send help DM to ${message.author.tag}.\n`, error);
				message.reply('it seems like I can\'t send you the help message. Do you have DMs disabled?');
			});
			
	},
};
