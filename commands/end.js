module.exports = {
	
	// Command options
	name: 'end',
	aliases: ['delete'],
	
	usage: '<name>',
	description: 'Deletes queue and channel with <name>, if it exists.',
	
	cooldown: 5,
	args: 1,
	
	mmOnly: true,
	
	execute (message, args) {
		
	}
}
