# QueueBot
Queue bot for Discord, tentatively written for the [Pokemon Sword & Shield Discord](http://discord.gg/pokemonswordshield "Pokemon Sword & Shield Discord").

------------

### Usage
- `!queue create <name> <length>`

	Creates a new queue with the given name and length, and a new channel `#queue-<name>` under a configured category.

	Can only be called by authorised users, e.g. the middleman role.

- `!queue join $NAME`

	Adds user to queue `<name>` (if it exists), and posts their info in that queue's channel.

`Position: ## | Switch Profile Name: ## | IGN: ## | Friend Code: ## `

- `!queue set <option> <value>`

	Users can set their profile data for the above information. `<option>` can be one of the following: `friendcode`, `ign`,`profilename`

- `!queue end <name>`

	eletes queue and the associated channel.

	Can only be called by authorised users, e.g. the middleman role.

------------

### Setup
Main file is `queuebot.js`

Bot token goes in `token.json`
```
{
	"token": "TOKEN HERE"
}
```
