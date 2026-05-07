#!/bin/sh -ex

# This file is how Fly starts the server (configured in fly.toml). Before starting
# the server though, we need to run any prisma migrations that haven't yet been
# run, which is why this file exists in the first place.
# Learn more: https://community.fly.io/t/sqlite-not-getting-setup-properly/4386

# allocate swap space
fallocate -l 20GB /data/swapfile
chmod 0600 /data/swapfile
mkswap /data/swapfile
echo 10 > /proc/sys/vm/swappiness
swapon /data/swapfile
echo 1 > /proc/sys/vm/overcommit_memory

#setup FlyCTL
# Do we want to login here? Bad side is we commit a username&password, seems the more secure option is to have admin login when pushing to production...RUN flyctl auth login --email  --password
bash /myapp/public/scripts/setup_flyctl.sh
# Check every hour if we should extend storage, and if so, do it:
crontab -l | { cat; echo "0 * * * * /myapp/public/scripts/extend_storage.sh"; } | crontab -
# Clear the Uploads directory every hour.
crontab -l | { cat; echo "0 * * * * /myapp/public/scripts/clear_uploads.sh"; } | crontab -

npx prisma migrate deploy
mkdir /data/uploads
mkdir /data/generatedJsons

npm run start
