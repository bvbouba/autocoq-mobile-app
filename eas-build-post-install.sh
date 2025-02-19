#!/bin/bash

echo "🔄 Forcing Node.js 20 for dependency installation..."
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

nvm use 20
node -v
npm -v
yarn config set ignore-engines true
