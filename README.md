# gridsvcs-motd
[![GitHub](https://img.shields.io/badge/GitHub-%23121011.svg?logo=github&logoColor=white)][motd]
[![Build and Push Motd Docker Image](https://github.com/codemarc/gridsvcs-motd/actions/workflows/docker-build-push-motd.yml/badge.svg)](https://github.com/codemarc/gridsvcs-motd/actions/workflows/docker-build-push-motd.yml)
![GitHub last commit](https://img.shields.io/github/last-commit/codemarc/gridsvcs-motd)  

Message of the day service for gridlinks  
This service creates its data using openai.chat api.

> create a list of 50 "message of the day" quotes formatted as an array of json objects containing the fields message and author

```json
[
  {"message": "The only way to do great work is to love what you do.", "author": "Steve Jobs"},
  {"message": "Success is not the key to happiness. Happiness is the key to success.","author":"Albert Schweitzer"},
  {"message": "Believe you can and you're halfway there.","author": "Theodore Roosevelt"},
  ⋮
]
```

<!-- References -->
[motd]: https://github.com/codemarc/gridsvcs-motd

### CQRS - Command Query Responsibility Segregation

CQRS is a design pattern that separates the operations of a system into two distinct parts:
commands and queries. In CQRS, commands are used to modify the state of the system, while queries are used to retrieve the current state of the system.

1. **Commands**: These are operations that modify state. Essentially, any function that performs an action that changes data or has a side effect is a command.
Commands may create, update, or delete data but typically do not return any data to the caller.

2. **Queries**: These are operations that retrieve state without changing it. Queries fetch data and return it but do not modify the data or have side effects.
The principle here is that you can ask a question about the state of the system without changing the system.


### Tools reference

* [OpenAI Platform](https://platform.openai.com/), [API keys](https://platform.openai.com/api-keys) (for this service use the project gridlinks and the key named motd)


## build and run

You can build and run the service with the following commands:

#### install dependencies
```
$ yarn install
yarn install v1.22.22
[1/4] 🔍  Resolving packages...
[2/4] 🚚  Fetching packages...
[3/4] 🔗  Linking dependencies...
[4/4] 🔨  Building fresh packages...
✨  Done in 4.12s.
```

#### update build and version identifiers
The update command updates the version number in the `package.json` file.
This build command updates the build number in the `build.num` file.
The build number is used to identify the version of the service.
It can be easily translated to a human readable date and time.
```
$ yarn update
yarn version --patch
info Current version: 0.0.9
info New version: 0.0.10
✨  Done in 0.66s.

$ yarn build
yarn run v1.22.22
$ npx buildnumgen > build.num
✨  Done in 1.26s.

$ cat build.num 
241019209

$ npx buildnumgen $(cat build.num) 
Sat Oct 19 2024 06:58
```

#### start script 
The start script is a wrapper to run ./motd.js (the service). It sets the environment and invokes node passing thru any arguments

```bash
$ ./start

grid start motd v0.0.10

starting in production mode...
using default environment...
sat 2024-10-19 07:11:01 am [info]: running motd cli v0.0.10 (241019209)
sat 2024-10-19 07:11:01 am [info]: no command issued

   motd 0.0.10 - Message of the Day service for Gridlinks

   USAGE

     motd <command> [options]

   COMMANDS

     env                  display environment                
     refresh [topic]      updates all cached data            
     server               start the service                  
     help <command>       Display help for a specific command

   GLOBAL OPTIONS

     -h, --help         Display help                                      
     -V, --version      Display version                                   
     --no-color         Disable colors                                    
     --quiet            Quiet mode - only displays warn and error messages
     -v, --verbose      Verbose mode - will also output debug messages    
```


