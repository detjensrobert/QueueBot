module.exports = {
	
	// Command options
	name: 'set',
	aliases: ['setinfo'],
	
	usage: '<option> <value>',
	description: 'Sets your queue display info for the join message. <option> can be one of: `friendcode`, `ign`, `profilename`',
	
	cooldown: 5,
	args: 2,
	
	// command invocation
	execute (message, args) {
		console.log("SET");
	}
}
