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

# Check for -prod flag
prod_mode=false
while getopts "p" opt; do
  case $opt in
    p)
      prod_mode=true
      ;;
    *)
      ;;
  esac
done

if [ "$prod_mode" = true ]; then
  echo "starting in production mode..."
  if [ -f .env.production ]; then
     echo "loading .env.production environment variables..."
     NODE_ENV=production node --no-warnings --env-file=.env.production ./motd.js "$@"
  else
     echo "using default environment..."
     NODE_ENV=production node --no-warnings ./motd.js "$@"
  fi
else
  echo "starting in development mode..."
  if [ -f .env.development ]; then
     echo "loading .env.development environment variables..."
     node --env-file=.env.development ./motd.js "$@"
  else
     echo "using default environment..."
     NODE_ENV=development node ./motd.js "$@"
  fi
fi

