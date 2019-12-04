module.exports = {
	
	// Command options
	name: 'join',
	aliases: ['add'],
	
	usage: '<queue name>',
	description: 'Adds you to the specified queue, if it exists.',
	
	cooldown: 5,
	args: 1,
	
	execute: async (message, args) => {
		console.log("JOIN");
	}
}
