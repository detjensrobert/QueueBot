const { prefix, colors } = require('../config.json');
const Discord = require('discord.js');

const options = {
	name: 'list',
	aliases: ['l', 'all'],
	
	description: 'Lists all current queues.',
	
	cooldown: 5,
}

async function execute (message, args, db) {
	
	console.log("[ INFO ] Listing queues.");
	
	//get all queues in database
	const queueDB = db.collection('queues');
	const findarr = await queueDB.find().toArray();
	console.log(findarr);
	
	const replyEmbed = new Discord.RichEmbed().setColor(colors.info)
		.setTitle(`Currently ${findarr.length} active queues.`);
		
	console.log("[ INFO ]  > "+findarr.length+" currently active.");
	
	let reply = "";
	findarr.forEach( (elem) => {
		reply += `\n<#${elem.channelID}>: `;
		reply += elem.available == 0 ? "No spaces left." : `${elem.available} of ${elem.capacity} spaces left`;
	});
	replyEmbed.setDescription(reply);
	
	message.channel.send(replyEmbed);
	
}

module.exports = options;
module.exports.execute = execute;
