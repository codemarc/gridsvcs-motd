#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# Please note this script has specifically omitted the hash-bang bin/bash or 
# bin/ash directive with the intent to run in any *ash compatible shell.
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# This script is used to start motd from the container environment. It is
# intended to be run from the root of the project directory.
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

# set my name and version
version=$(jq -r '.version' package.json)
service=$(jq -r '.name' package.json)
vscript="grid start $service v$version"
echo
echo "$vscript"
echo

# Check for -d flag
dev_mode=false
while getopts "d" opt; do
  case $opt in
    d)
      dev_mode=true
      ;;
    *)
      ;;
  esac
done


if [ "$dev_mode" = true ]; then
  echo "starting in development mode..."
  if [ -f .env.development ]; then
     echo "loading .env.development environment variables..."
     node --env-file=.env.development ./motd.js $2 $3 $4 $5 $6 $7 $8 $9
  else
     echo "using default environment..."
     NODE_ENV=development node ./motd.js $2 $3 $4 $5 $6 $7 $8 $9
  fi
else
  echo "starting in production mode..."
  if [ -f .env.production ]; then
     echo "loading .env.production environment variables..."
     NODE_ENV=production node --no-warnings --env-file=.env.production ./motd.js "$@"
  else
     echo "using default environment..."
     NODE_ENV=production node --no-warnings ./motd.js "$@"
  fi
fi

