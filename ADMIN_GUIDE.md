# Admin Panel Guide

This guide explains how to use the admin panel to update your CV links directly from your website.

## Overview

The admin panel provides a secure, password-protected interface for updating your CV links. Only you (as the admin) can access this feature.

## Accessing the Admin Panel

### Step 1: Look for the Admin Button

On any page of your website, look for a **blue gear icon (⚙️)** in the bottom-right corner of the screen.

### Step 2: Click the Admin Button

Click the gear icon to open the admin login modal.

### Step 3: Enter Your Admin Password

The default admin password is: **`tarig2030`**

> **⚠️ IMPORTANT**: Change this password immediately in the `admin.js` file for security!

```javascript
// In admin.js, line 8:
const ADMIN_PASSWORD = 'tarig2030'; // Change this to a secure password
```

## Using the Admin Panel

Once authenticated, you'll see the CV Management Panel with three text fields:

1. **Default CV Link** - Used on the main Terminal page (index.html)
2. **About Page CV Link** - Used on the Strategy page (about.html)
3. **Vimeo Page CV Link** - Used on the Vimeo page (about_vimeo.html)

### Updating CV Links

1. **Paste your new CV URL** into the appropriate field(s)
2. Click **"💾 Save Configuration"** to save your changes
3. Click **"📋 Copy to Clipboard"** to copy the updated configuration
4. Go to your GitHub repository
5. Open the `cv-config.json` file
6. Click the Edit button (pencil icon)
7. Delete the current content and paste the new configuration
8. Commit the changes with a message like "Update CV links"

Your website will automatically use the new CV links!

## Features

### 🔒 Secure Authentication
- Password-protected access
- Session expires after 24 hours
- Stored securely in browser localStorage

### 💾 Easy Updates
- Update all CV links from one interface
- No need to edit HTML or JSON files directly
- Copy-to-clipboard functionality for easy GitHub updates

### 🔄 Session Management
- Click **"🚪 Logout"** to end your admin session
- Your session automatically expires after 24 hours of inactivity

## Changing Your Admin Password

To change your admin password:

1. Open the `admin.js` file in your repository
2. Find line 8: `const ADMIN_PASSWORD = 'tarig2030';`
3. Replace `'tarig2030'` with your new password
4. Commit the changes to GitHub

Example:
```javascript
const ADMIN_PASSWORD = 'MySecurePassword123!';
```

## Security Best Practices

⚠️ **Important Security Notes:**

1. **Change the default password immediately** - The default password is public knowledge
2. **Use a strong password** - Mix uppercase, lowercase, numbers, and special characters
3. **Don't share your password** - Only you should have access
4. **Clear your browser history** - If using a shared computer, clear your browser data after logging out
5. **Use HTTPS** - Always access your site over a secure connection

## Troubleshooting

### "Invalid password" error
- Double-check your password is correct
- Remember passwords are case-sensitive
- If you forgot your password, edit `admin.js` and change it

### Admin button not appearing
- Make sure you're on a page that has `admin.js` loaded (index.html, about.html, about_vimeo.html)
- Check your browser console (F12) for any error messages
- Clear your browser cache and reload

### Changes not applying
1. Make sure you clicked "Save Configuration"
2. Copy the configuration to your clipboard
3. Update `cv-config.json` in your GitHub repository
4. Commit the changes
5. Wait a few seconds for GitHub to update the file
6. Refresh your website

## Advanced Features

### Extending the Admin Panel

To add more CV types or pages:

1. **In `admin.js`**, add a new form group in the `adminPanel.innerHTML`:
```html
<div class="admin-form-group">
    <label class="admin-label">New Page CV Link</label>
    <textarea id="cvNewpage" class="admin-textarea" placeholder="Paste your CV URL here..."></textarea>
</div>
```

2. **In `admin.js`**, update the `saveCVConfig()` function to include the new field:
```javascript
newConfig.cv.newpage = document.getElementById('cvNewpage').value.trim();
```

3. **In `admin.js`**, update the `loadCVConfigToPanel()` function:
```javascript
document.getElementById('cvNewpage').value = config.cv.newpage || '';
```

4. **In `cv-config.json`**, add the new CV type:
```json
"newpage": "https://your-cv-url"
```

5. **In your HTML**, use the new CV type:
```html
<a href="#" data-cv-type="newpage" target="_blank">CV</a>
```

## Questions or Issues?

If you encounter any problems:

1. Check the browser console (F12 → Console tab) for error messages
2. Review this guide for troubleshooting steps
3. Verify that `admin.js` and `cv-loader.js` are properly loaded on your pages

---

**Last Updated**: February 22, 2026  
**Admin Panel Version**: 1.0
