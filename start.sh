if [ "$1" == "dev" ]; then
  if [ ! -f ./.env.local ]; then
    node --no-warnings ./smash -k motd ./.env.local
  fi
  node --no-warnings --env-file=./.env.local ./motd.js server
else
  if [ ! -f ./.env ]; then
    node --no-warnings ./smash -k motd ./.env
  fi
  node --no-warnings --env-file=./.env ./motd.js server
fi
