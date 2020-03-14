# QueueBot
Queue bot for Discord, written for the [Pokemon Sword & Shield Discord](http://discord.gg/pokemonswordshield "Pokemon Sword & Shield Discord") 

------------

### Overview

This bot manages creation and moderation of queue channels. Users can create a queue with a certain capacity, and other users can join the queue until the capcity is reached.

When a user joins a queue, the bot posts a message with that user's information in the queue's channel like so:

`Position: ## | Switch Profile Name: ## | IGN: ## | Friend Code: ## ` 

Queue channels are visible to everyone, but only QueueBot, the queue host, queue members, and a configurable admin role can send messages.

------------

### Usage
- `!queue open <queue-name> <length>`

	Creates a new queue with the given name and length, and a new channel `#queue-<queue-name>` under a configured category.

	Can only be called by authorised users (with a specified role e.g. Middlemen).
	
	The resultant channel is only visible to the queue members and a queue admin role.

- `!queue random <queue-name> <length>`

	Creates a new *random* queue with the given name and length, and a new channel `#queue-<queue-name>` under a configured category.
	
	Since this is a random queue, a message is sent to the `#queue-list` (or configured) channel. Users react to this message to join.

 	Can only be called by authorised users (with a specified role e.g. Middlemen).
	
	The resultant channel is only visible to the queue members and a queue admin role.

- `!queue join <queue-name>`

	Adds user to queue `<queue-name>` (if it exists), and posts their info in that queue's channel.

- `!queue set <Switch profile name> | <In-game name> | (SW-)XXXX-XXXX-XXXX`

	Users can set their profile data for the join message.
	
- `!queue me`

	Displays the queue information a user has entered for the join message.
	
- `!queue add <amount>`

	Adds <amount> more capacity to an exising queue.

- `!queue close <queue-name>`

	Deletes queue and the associated channel.
	
	Can only be called by authorised users (with a specified role e.g. Middlemen).
	
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

Make sure the bot has react permissions in the configured `#queue-list` channel!
