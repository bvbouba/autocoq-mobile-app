#!/bin/bash

echo "Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

echo "Setting default Node.js version..."
export PATH="/usr/bin:$PATH"
node -v
npm -v

echo "Ensuring Yarn uses the correct Node version..."
corepack enable
yarn config set nodeLinker node-modules
