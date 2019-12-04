module.exports = {
	
	// Command options
	name: 'join',
	aliases: ['add'],
	
	usage: '<queue name>',
	description: 'Adds you to the specified queue, if it exists.',
	
	cooldown: 5,
	args: 2,
	
	execute (message, args) {
		console.log("JOIN");
	}
}
