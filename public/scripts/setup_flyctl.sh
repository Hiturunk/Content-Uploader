#!/bin/bash

# Set the installation directory
FLYCTL_INSTALL="/root/.fly"

# Add or update the FLYCTL_INSTALL environment variable in the Bash profile
echo "export FLYCTL_INSTALL=\"$FLYCTL_INSTALL\"" >> ~/.bashrc

# Add or update the PATH in the Bash profile to include FLYCTL_INSTALL/bin
echo "export PATH=\"\$FLYCTL_INSTALL/bin:\$PATH\"" >> ~/.bashrc

# Apply the changes to the current shell session
export FLYCTL_INSTALL
export PATH="$FLYCTL_INSTALL/bin:$PATH"
