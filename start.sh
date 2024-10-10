# This script is used to manage different build and development tasks for the project.
# Usage: ./start.sh [build|dev|server]

# Check if the first argument is "build"
if [ "$1" == "build" ]; then
  # Run the build process using yarn
  yarn build

# Check if the first argument is "dev"
elif [ "$1" == "dev" ]; then
  # If the .env.local file does not exist, generate it using the smash command
  if [ ! -f ./.env.local ]; then
    node --no-warnings ./smash -k motd ./.env.local
  fi
  # Start the development server using yarn
  yarn dev

# If the first argument is neither "build" nor "dev"
else
  # If the .env file does not exist, generate it using the smash command
  if [ ! -f ./.env ]; then
    node --no-warnings ./smash -k motd ./.env
  fi
  # Start the server using yarn
  yarn server

fi
