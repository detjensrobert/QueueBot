# QueueBot
Queue bot for Discord, tentatively written for the [Pokemon Sword & Shield Discord](http://discord.gg/pokemonswordshield "Pokemon Sword & Shield Discord") based on a suggestion from one of their members. 

------------

### Overview

This bot manages creation and moderation of queue channels. Users can create a queue with a certain capacity, and other users can join the queue until the capcity is reached.

When a user joins a queue, the bot posts a message with that user's information in the queue's channel like so:

`Position: ## | Switch Profile Name: ## | IGN: ## | Friend Code: ## ` 

Queue channels are visible to everyone, but only QueueBot, the queue host, queue members, and a configurable admin role can send messages.

------------

### Usage
- `!queue create <queue-name> <length>`

	Creates a new queue with the given name and length, and a new channel `#queue-<queue-name>` under a configured category.

	Can only be called by authorised users (with a specified role e.g. Middlemen).
	
	The resultant channel is only visible to the queue members and a queue admin role.

- `!queue join <queue-name>`

	Adds user to queue `<queue-name>` (if it exists), and posts their info in that queue's channel.

- `!queue set profile <Switch profile name> / ign <name> / fc (SW-)XXXX-XXXX-XXXX`

	Users can set their profile data for the join message.

- `!queue end <queue-name>`

	Deletes queue and the associated channel.

	Can only be called by authorised users, e.g. a specified role.
	
- `!queue list`

	Lists currently active queues, their channels, and open seats.
	
- `!queue help`

	Displays a help message with commands and their usages.

------------

### Setup
Main file is `queuebot.js`.  `npm start` will start the bot.

Bot token goes in `token.json`. Create if not present:
```
{
  "token": "TOKEN HERE"
}
```

MongoDB settings go in `mongodb_config.json`. Create if not present:
```
{
  "host": "HOSTNAME",
  "user": "USERNAME",
  "pass": "PASSWORD",
  "dbname": "DATABASE"
  "port": "PORT" // Optional, will use default (21017) if not specified
}
```
The bot will use collections `queues` and `userdata`.
