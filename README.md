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

* [OrbStack](https://docs.orbstack.dev/) (alternative to Docker Desktop)
https://cli.gridsvcs-motd.orb.local is localhost:3000  
so try https://cli.gridsvcs-motd.orb.local/v1/motd/api-docs  
When OrbStack is running, you can visit [orb.local](http://orb.local/) in your browser for links to all running containers.



## build and run

You can inspect, build and run the service with the following commands:

#### install dependencies
```bash
$ yarn install
```

#### ver:show
```bash
$ yarn ver:show
cat package.json | jq .version
"0.0.10"
```

#### ver:update
```bash
$ yarn ver:update
yarn version --patch
info Current version: "0.0.10"
info New version: "0.0.11"
```

#### build:show
```bash
$ yarn build:show
cat build.num && buildnumgen $(cat build.num)
241030292
Wed Oct 30 2024 09:44
```

#### build:update
```bash
$ yarn build:update
npx buildnumgen > build.num && cat build.num
```

### start script 
The start script is a wrapper to run ./motd.js (the service). It sets the environment and invokes node passing thru any arguments, if any. By default it runs in development mode.
```bash
$ ./start

grid start motd v0.0.10

starting in development mode...
using default environment...
(node:50085) ExperimentalWarning: Importing JSON modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
wed 2024-10-30 10:39:56 am [info]: running motd cli v0.0.10 (241030314)
wed 2024-10-30 10:39:56 am [info]: no command issued

   motd 0.0.10 - Message of the Day service for Gridlinks

   USAGE

     motd <command> [options]

   COMMANDS

     env                  display environment                
     refresh [topic]      updates all cached data            
     server               start the service                  
     help <command>       Display help for a specific command
```
To run in production mode use the -p flag.
```bash
$ ./start -p

grid start motd v0.0.10

starting in production mode...
loading .env.prod environment variables...
wed 2024-10-30 10:44:20 am [info]: running motd cli v0.0.10 (241030314)
wed 2024-10-30 10:44:20 am [info]: no command issued

   motd 0.0.10 - Message of the Day service for Gridlinks

   USAGE

     motd <command> [options]

   COMMANDS

     env                  display environment                
     refresh [topic]      updates all cached data            
     server               start the service                  
     help <command>       Display help for a specific command
```

#### lets try the env command in development mode
There is an expectation that your environment variables are set.
The file .env.sample contains the environment variables that are used by the service.
```bash
# .env.sample

#server config
GS_DATA=data
GS_LOGS=logs
GS_PORT=3000

# App config
GS_TOPICS_CACHE_TTL=7200
GS_QUOTES_CACHE_TTL=86400
GS_QUOTES_MAX_DAYS=30

# supabase project <supabase project name>
# https://supabase.com/dashboard/project/<projectid>
# GS_SUPAURL ovverides GS_SUPAPRJ if both are set
GS_SUPAPRJ=<projectid>
GS_SUPAURL=https://<projectid>.supabase.co
GA_SUPANON=<supabase anon token>
GS_SUPASVC=<supabase service token>

# OpenAI Api Key
# https://platform.openai.com/api-keys#xxxx
GS_OPENAI_API_KEY=<motd openai api-key>
```

The start script will load the environment variables from the .env.dev or the 
.env.prod file depending on mode. If not file is available it will use the default environment. Running the env command will display the environment variables. .env.dev is used by defined in the illustration below

```log
$ ./start env
grid start motd v0.0.10


starting in development mode...
loading .env.dev environment variables...
(node:51861) ExperimentalWarning: Importing JSON modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
wed 2024-10-30 10:59:24 am [info]: running motd cli v0.0.10 (241030314)
wed 2024-10-30 10:59:24 am [info]: =============================================================================
wed 2024-10-30 10:59:24 am [info]: NODE_ENV....................[development]
wed 2024-10-30 10:59:24 am [info]: GS_DATA.....................[data]
wed 2024-10-30 10:59:24 am [info]: GS_LOGS.....................[logs]
wed 2024-10-30 10:59:24 am [info]: GS_PORT.....................[3000]
wed 2024-10-30 10:59:24 am [info]: GS_OPENAI_API_KEY...........[sk-p••••••••••••••••••••••••••••••••NfAA]
wed 2024-10-30 10:59:24 am [info]: GS_OPENAI_MODEL.............[gpt-3.5-turbo]
wed 2024-10-30 10:59:24 am [info]: GS_SUPAURL..................[https://bcxmxwbowkwaajudjerb.supabase.co]
wed 2024-10-30 10:59:24 am [info]: GA_SUPANON..................[eyJh••••••••••••••••••••••••••••••••NYQs]
wed 2024-10-30 10:59:24 am [info]: GA_SUPSVC...................[eyJh••••••••••••••••••••••••••••••••P4XU]
wed 2024-10-30 10:59:24 am [info]: GS_TOPICS_CACHE_TTL.........[7200]
wed 2024-10-30 10:59:24 am [info]: GS_QUOTES_CACHE_TTL.........[86400]
wed 2024-10-30 10:59:24 am [info]: GS_QUOTES_MAX_DAYS..........[30]
wed 2024-10-30 10:59:24 am [info]: =============================================================================
wed 2024-10-30 10:59:24 am [info]: data directory resolves to /Users/marc/cmc/grid/gridsvcs-motd/data
```

#### try the refresh command
```bash
$ ./start refresh -h

 motd 0.0.10 - Message of the Day service for Gridlinks

   USAGE

     motd refresh [topic]

   ARGUMENTS

     [topic]      topic to refresh      optional      

   OPTIONS

     -l, --list          topics                    optional      default: false
     -t, --topics        refresh topics list       optional      default: false
     -f, --force         force a cache update      optional      default: false
     -d, --database      use database              optional      default: false
```

Based on the help output we can see that the refresh command has a few options. The -l option will list the topics in the cache. The -t option will refresh the topics list. The -f option will force a cache update. The -d option will use the database to refresh the cache. 

What about no options?

if no options are specified the refresh command will refresh the topics list (if neccessary) and the general quotes cache.

### Run the service

```bash
$ ./start server

grid start motd v0.0.10

starting in development mode...
loading .env.dev environment variables...
(node:67777) ExperimentalWarning: Importing JSON modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
wed 2024-10-30 02:04:08 pm [info]: running motd cli v0.0.10 (241030314)
wed 2024-10-30 02:04:08 pm [info]: starting server
wed 2024-10-30 02:04:08 pm [info]: =============================================================================
wed 2024-10-30 02:04:08 pm [info]: NODE_ENV....................[development]
wed 2024-10-30 02:04:08 pm [info]: GS_DATA.....................[data/dev]
wed 2024-10-30 02:04:08 pm [info]: GS_LOGS.....................[logs/dev]
wed 2024-10-30 02:04:08 pm [info]: GS_PORT.....................[3000]
wed 2024-10-30 02:04:08 pm [info]: GS_OPENAI_API_KEY...........[sk-p••••••••••••••••••••••••••••••••NfAA]
wed 2024-10-30 02:04:08 pm [info]: GS_OPENAI_MODEL.............[gpt-3.5-turbo]
wed 2024-10-30 02:04:08 pm [info]: GS_SUPAURL..................[https://bcxmxwbowkwaajudjerb.supabase.co]
wed 2024-10-30 02:04:08 pm [info]: GA_SUPANON..................[eyJh••••••••••••••••••••••••••••••••NYQs]
wed 2024-10-30 02:04:08 pm [info]: GA_SUPSVC...................[eyJh••••••••••••••••••••••••••••••••P4XU]
wed 2024-10-30 02:04:08 pm [info]: GS_TOPICS_CACHE_TTL.........[7200]
wed 2024-10-30 02:04:08 pm [info]: GS_QUOTES_CACHE_TTL.........[86400]
wed 2024-10-30 02:04:08 pm [info]: GS_QUOTES_MAX_DAYS..........[30]
wed 2024-10-30 02:04:08 pm [info]: =============================================================================
wed 2024-10-30 02:04:08 pm [info]: data directory resolves to /Users/marc/cmc/grid/gridsvcs-motd/data/dev
wed 2024-10-30 02:04:08 pm [info]: server is running on http://localhost:3000
wed 2024-10-30 02:04:08 pm [info]: try http://localhost:3000/v1/motd/api-docs
wed 2024-10-30 02:04:08 pm [info]: try http://localhost:3000/v1/motd/status
wed 2024-10-30 02:04:08 pm [info]: try http://localhost:3000/v1/motd/quotes
wed 2024-10-30 02:04:08 pm [info]: try http://localhost:3000/v1/motd/topics
wed 2024-10-30 02:04:08 pm [info]: press CTRL+C to stop
```

### Routes

The following routes are available in the service:

- `GET /v1/motd/api-docs`: Swagger documentation for the service.
- `GET /v1/motd/status`: Check the status of the service.
- `GET /v1/motd/quotes`: Retrieve the list of quotes.
- `GET /v1/motd/topics`: Retrieve the list of topics.

From your browser you can find the swaggerdoc -- at http://localhost:3000/v1/motd/api-docs. 
From here you can test the API directly or 
use the [openapi source definition for motd](http://localhost:3000/v1/motd/openapi.json) also known 
as swaggerdov to generate a client or 
import definition to Postman or Insomnia.

#### docker:build
```bash
$ yarn docker:build
```

#### docker:prod build
```bash
$ yarn docker:prod

$ yarn docker:prod server

$ https://cli.gridsvcs-motd.orb.local/v1/motd/

```
