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

  # Manually add Yarn to PATH
  export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"
fi

# Confirm Yarn installation
echo "✅ Yarn version:"
yarn -v || echo "❌ Yarn installation failed."

# Force Yarn to use the correct Node.js version
echo "🔄 Configuring Yarn..."
yarn config set ignore-engines true || echo "❌ Failed to configure Yarn."

echo "✅ Pre-install script completed successfully!"
