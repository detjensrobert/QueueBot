module.exports = {
	
	// Command options
	name: 'create',
	aliases: ['createqueue', 'makequeue'],
	
	usage: '<name> <length>',
	description: 'Creates new queue & channel named <name> with a capacity of <length>',
	
	cooldown: 5,
	args: 2,
	
	mmOnly: true,
	
}

exports.execute = (message, args) => {
	console.log("CREATE");
	const name = args[0];
	const length = args[1];
	
	if () {
		
	}
}
