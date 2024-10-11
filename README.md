# gridsvcs-motd
[![GitHub](https://img.shields.io/badge/GitHub-%23121011.svg?logo=github&logoColor=white)][motd]
[![Build and Push Motd Docker Image](https://github.com/codemarc/gridsvcs-motd/actions/workflows/docker-build-push-motd.yml/badge.svg)](https://github.com/codemarc/gridsvcs-motd/actions/workflows/docker-build-push-motd.yml)
![GitHub last commit](https://img.shields.io/github/last-commit/codemarc/gridsvcs-motd)  
message of the day microservice for gridlinks, part of the gridsvcs project


<!-- References -->
[motd]: https://github.com/codemarc/gridsvcs-motd

### microservice considerations
To be considered as a microservice, some basic NFR's should be met:

1. Single Responsibility -  Each microervice should have a single responsibility.
2. Independence - Each microservice should be independant of others.
3. Scalability - Each microservice should be scalable.
4. Agnosticism - This service is built with JavaScript (Node.js), but it doesn't imply
any dependency on the technology stack of other components of the larger system

## patterns used

CQRS - Command Query Responsibility Segregation

CQRS is a design pattern that separates the operations of a system into two distinct parts:
commands and queries.

Here's a breakdown of its core concepts:

1. **Commands**: These are operations that modify state. Essentially, any function that performs an action that changes data or has a side effect is a command.
Commands may create, update, or delete data but typically do not return any data to the caller.

2. **Queries**: These are operations that retrieve state without changing it. Queries fetch data and return it but do not modify the data or have side effects.
The principle here is that you can ask a question about the state of the system without changing the system.

## tools reference

* [OpenAI Platform](https://platform.openai.com/), [API keys](https://platform.openai.com/api-keys) (for this service use the project gridlinks and the key named motd)




## build and run

To surpress the experimental warning, you can set the following environment variables:
export NODE_OPTIONS=--experimental-vm-modules NODE_NO_WARNINGS=1

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

#### run in dev mode
```
$ yarn dev
yarn run v1.22.22
$ nodemon ./motd.js server
[nodemon] 3.1.4
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node ./motd.js server`
(node:58258) ExperimentalWarning: Importing JSON modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
sun 2024-08-04 10:41:20 am [info]: running motd cli v0.0.5 build 240802516
sun 2024-08-04 10:41:20 am [info]: starting server
sun 2024-08-04 10:41:20 am [info]: data directory set to /Users/marc/cmc/gridsvcs/motd/data
sun 2024-08-04 10:41:20 am [info]: server is running on http://localhost:3000
sun 2024-08-04 10:41:20 am [info]: try http://localhost:3000/v1/api-docs
sun 2024-08-04 10:41:20 am [info]: try http://localhost:3000/v1/motd/status
sun 2024-08-04 10:41:20 am [info]: try http://localhost:3000/v1/motd/quotes
sun 2024-08-04 10:41:20 am [info]: try http://localhost:3000/v1/motd/topics
sun 2024-08-04 10:41:20 am [info]: press CTRL+C to stop
```

#### run in server mode
```
$ yarn server
$ node ./motd.js server
(node:58797) ExperimentalWarning: Importing JSON modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
sun 2024-08-04 10:44:27 am [info]: running motd cli v0.0.5 build 240802516
sun 2024-08-04 10:44:27 am [info]: starting server
sun 2024-08-04 10:44:27 am [info]: data directory set to /Users/marc/cmc/gridsvcs/motd/data
sun 2024-08-04 10:44:27 am [info]: server is running on http://localhost:3000
sun 2024-08-04 10:44:27 am [info]: try http://localhost:3000/v1/api-docs
sun 2024-08-04 10:44:27 am [info]: try http://localhost:3000/v1/motd/status
sun 2024-08-04 10:44:27 am [info]: try http://localhost:3000/v1/motd/quotes
sun 2024-08-04 10:44:27 am [info]: try http://localhost:3000/v1/motd/topics
sun 2024-08-04 10:44:27 am [info]: press CTRL+C to stop
```

#### run in cli mode
```
$ yarn motd
yarn run v1.22.22
$ node ./motd.js

   motd 0.0.5 - Message of the Day service for Gridlinks

   USAGE

     motd <command> [options]

   COMMANDS

     update               generate a build number
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

#### build
```
$ yarn build
yarn run v1.22.22
$ node ./motd.js update
sun 2024-08-04 10:49:02 am [info]: running motd cli v0.0.5 build 240802516
sun 2024-08-04 10:49:02 am [info]: data directory set to /Users/marc/cmc/gridsvcs/motd/data
sun 2024-08-04 10:49:02 am [info]: build number 240804324
✨  Done in 0.96s.
```

#### refresh
```
$ yarn motd refresh -h
yarn run v1.22.22
$ node ./motd.js  refresh -h
sun 2024-08-04 11:12:31 am [info]: running motd cli v0.0.5 build 240804324

   motd 0.0.5 - Message of the Day service for Gridlinks

   USAGE

     motd refresh [topic]

   ARGUMENTS

     [topic]      topic to refresh      optional

   OPTIONS

     -l, --list        topics                    optional      default: false
     -t, --topics      refresh topics list       optional      default: false
     -f, --force       force a cache update      optional      default: false

   GLOBAL OPTIONS

     -h, --help         Display help
     -V, --version      Display version
     --no-color         Disable colors
     --quiet            Quiet mode - only displays warn and error messages
     -v, --verbose      Verbose mode - will also output debug messages

✨  Done in 0.98s.

```

#### topics
```
$ yarn motd refresh -l
$ node ./motd.js  refresh -l
sun 2024-08-04 11:02:48 am [info]: running motd cli v0.0.5 build 240804324
sun 2024-08-04 11:02:48 am [info]: data directory set to /Users/marc/cmc/gridsvcs/motd/data

topics:
        general
        trump
        politics
        elon
        kamala
✨  Done in 0.99s.

$ yarn motd refresh trump
yarn run v1.22.22
$ node ./motd.js  refresh trump
sun 2024-08-04 11:10:39 am [info]: running motd cli v0.0.5 build 240804324
sun 2024-08-04 11:10:39 am [info]: data directory set to /Users/marc/cmc/gridsvcs/motd/data
sun 2024-08-04 11:10:39 am [info]: refreshing quotes
sun 2024-08-04 11:10:39 am [info]: refreshing quotes completes
sun 2024-08-04 11:10:39 am [info]: quotes file age is 1 days
✨  Done in 0.95s.

```

#### to build and test in a local container
```
$ docker compose build .
docker compose build
[+] Building 33.8s (12/12) FINISHED

$ docker compose run cli motd

   motd 0.0.5 - Message of the Day service for Gridlinks

   USAGE

     motd <command> [options]

   COMMANDS

     update               generate a build number
     refresh [topic]      updates all cached data
     server               start the service
     help <command>       Display help for a specific command

   GLOBAL OPTIONS

     -h, --help         Display help
     -V, --version      Display version
     --no-color         Disable colors
     --quiet            Quiet mode - only displays warn and error messages
     -v, --verbose      Verbose mode - will also output debug messages



Politics

To calculate the cost of 1652 tokens when 1 million tokens cost 5 dollars, you can use the following formula:

ChatGPT 4o Cost = (Total Tokens / 1000000)* 5
politics: (1652 tokens / 1000000) * 5 = 0.00826 dollars

ChatGPT 4o Mini Cost = (Total Tokens / 1000000)* 0.15
politics: (1279 tokens / 1000000) * 0.15 = 0.00019185 dollars

By the way, for transparency, I start this project with a $10 budget and adter a month I am at $9.53 (so super low volume...)
