#!/bin/bash

echo "🔧 Installing nvm..."
export NVM_DIR="$HOME/.nvm"

if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
else
  echo "❌ NVM is not installed. Exiting..."
  exit 1
fi

echo "🔄 Installing and using Node.js 20..."
nvm install 20
nvm use 20
nvm alias default 20

# Confirm the correct Node.js version
echo "✅ Node.js version:"
node -v
npm -v

# Install Yarn globally if not installed
if ! command -v yarn &> /dev/null; then
  echo "🔄 Yarn not found. Installing..."
  npm install -g yarn
fi

# Confirm Yarn installation
echo "✅ Yarn version:"
yarn -v

# Force Yarn to use the correct Node.js version
echo "🔄 Configuring Yarn..."
yarn config set ignore-engines true

echo "✅ Pre-install script completed successfully!"
