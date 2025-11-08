# Nginx Configuration for 15MB File Uploads - URGENT FIX

## ⚠️ PROBLEM
You're getting a **413 error** and **"Unexpected token '<', "<html> <h"... is not valid JSON"** on https://tropicalbloom.lk

This is because **Nginx is blocking uploads before they reach Next.js**. The HTML error is Nginx's default 413 error page.

## ✅ SOLUTION - Update Nginx on Production Server

### Step 1: SSH into your production server
```bash
ssh your-user@tropicalbloom.lk
```

### Step 2: Find and edit your Nginx config
```bash
# Try to find your site config
sudo ls /etc/nginx/sites-available/

# Edit the config (replace 'tropicalbloom.lk' with your actual config filename)
sudo nano /etc/nginx/sites-available/tropicalbloom.lk
```

### Step 3: Add this line in your server block
```nginx
server {
    listen 80;
    server_name tropicalbloom.lk www.tropicalbloom.lk;

    # ADD THIS LINE - Set max upload to 15MB
    client_max_body_size 15M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Step 4: Test and reload Nginx
```bash
# Test config is valid
sudo nginx -t

# If OK, reload Nginx
sudo systemctl reload nginx

# OR restart if reload doesn't work
sudo systemctl restart nginx
```

### Step 5: Restart your Next.js app (if using PM2)
```bash
pm2 restart all
# OR
pm2 restart bloom
```

## 📝 ALTERNATIVE - Global Setting

If you want to apply 15MB limit to ALL sites on the server:
```bash
sudo nano /etc/nginx/nginx.conf
```

Add in the `http` block:
```nginx
http {
    client_max_body_size 15M;
    # ... rest of config
}
```

## ✅ What's Already Fixed in Your Code

All these files have been updated to support 15MB:
- ✅ `next.config.ts` - bodySizeLimit: '15mb'
- ✅ `src/app/api/uploads/route.ts` - 15MB max
- ✅ All client-side validations updated to 15MB
- ✅ All error messages now say "15MB"

## 🧪 Testing

After updating Nginx:
1. Go to https://tropicalbloom.lk/admin/packages/new
2. Try uploading a file up to 15MB
3. The 413 error should be gone

## 🆘 If Still Not Working

1. Check Nginx error logs:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

2. Check Next.js logs:
   ```bash
   pm2 logs
   ```

3. Verify Nginx config was applied:
   ```bash
   sudo nginx -T | grep client_max_body_size
   ```

