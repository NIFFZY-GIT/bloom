#!/bin/bash

echo "========================================"
echo "Fixing file permissions for uploads..."
echo "========================================"

# Get the user running the Node.js process (usually the user who deployed)
# If you're using PM2, it's likely your regular user, not root
NODE_USER=$(whoami)

echo "Current user: $NODE_USER"
echo ""

# Fix ownership - change from root to the Node.js user
echo "1. Changing ownership of uploads directory..."
sudo chown -R $NODE_USER:$NODE_USER public/uploads

# Fix directory permissions (755 = rwxr-xr-x)
echo "2. Setting directory permissions to 755..."
find public/uploads -type d -exec chmod 755 {} \;

# Fix file permissions (644 = rw-r--r--)
echo "3. Setting file permissions to 644..."
find public/uploads -type f -exec chmod 644 {} \;

echo ""
echo "========================================"
echo "✅ Permissions fixed successfully!"
echo "========================================"
echo "Directory permissions: 755 (rwxr-xr-x)"
echo "File permissions: 644 (rw-r--r--)"
echo "Owner: $NODE_USER"
echo ""
echo "Checking current uploads:"
ls -la public/uploads/gallery/ 2>/dev/null || echo "Gallery folder empty or doesn't exist"
echo ""
echo "Now rebuild and restart your app:"
echo "  npm run build"
echo "  pm2 restart bloom-app"
