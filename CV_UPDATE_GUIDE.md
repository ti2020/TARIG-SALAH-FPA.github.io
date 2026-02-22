# CV Update Guide

This guide explains how to easily update your CV links across your FPA portfolio website.

## Overview

Your CV links are now centrally managed through a configuration file (`cv-config.json`). This means you can update all CV links on your website from a single location without editing HTML files.

## How to Update Your CV

### Step 1: Update the CV Configuration File

Open the `cv-config.json` file in your repository. It looks like this:

```json
{
  "cv": {
    "default": "https://read.litera-reader.com/?source=...",
    "about": "https://read.litera-reader.com/?source=...",
    "vimeo": "https://read.litera-reader.com/?source=..."
  },
  "metadata": {
    "lastUpdated": "2026-02-22",
    "version": "1.0"
  }
}
```

### Step 2: Replace the CV URLs

Update the URLs in the `cv` object:

- **`default`**: Used on the main `index.html` page (Terminal)
- **`about`**: Used on the `about.html` page (Strategy)
- **`vimeo`**: Used on the `about_vimeo.html` page

Simply replace the long Litera Reader URL with your new CV URL.

### Step 3: Update Metadata (Optional)

Update the `lastUpdated` date and increment the version number if desired:

```json
"metadata": {
  "lastUpdated": "2026-02-23",
  "version": "1.1"
}
```

### Step 4: Commit and Push

Commit your changes to GitHub:

```bash
git add cv-config.json
git commit -m "Update CV links - version 1.1"
git push origin main
```

## How It Works

The system uses two files to manage CV links:

1. **`cv-config.json`**: Stores all CV URLs in one place
2. **`cv-loader.js`**: A JavaScript utility that loads the configuration and updates all CV links on your pages

When your website loads, the `cv-loader.js` script automatically:
- Fetches the `cv-config.json` file
- Finds all links with the `data-cv-type` attribute
- Updates their `href` with the corresponding CV URL from the config

## Updated HTML Structure

Your HTML links now use a simple attribute instead of hardcoded URLs:

```html
<!-- Before -->
<a href="https://read.litera-reader.com/?source=...">📄 CV</a>

<!-- After -->
<a href="#" data-cv-type="default" target="_blank">📄 CV</a>
```

The `data-cv-type` attribute tells the loader which CV URL to use from the config file.

## Benefits

✅ **Single Source of Truth**: Update CV links in one file  
✅ **Easy Maintenance**: No need to edit HTML files  
✅ **Version Control**: Track CV changes in Git history  
✅ **Multiple Formats**: Support different CV versions for different pages  
✅ **Future-Proof**: Easy to add new CV types or pages  

## Troubleshooting

### CV Links Not Working?

1. **Check the browser console** (F12) for any error messages
2. **Verify `cv-config.json` is valid JSON** - use a JSON validator if unsure
3. **Ensure the CV URLs are correct** - test them in a new browser tab
4. **Clear browser cache** - sometimes old versions are cached

### Adding a New CV Type

To add a new CV type (e.g., for a new page):

1. Add it to `cv-config.json`:
```json
"newpage": "https://your-new-cv-url"
```

2. Use it in your HTML:
```html
<a href="#" data-cv-type="newpage" target="_blank">CV</a>
```

## Questions or Issues?

If you encounter any problems or need to modify the system further, refer to the `cv-loader.js` file for the implementation details.

---

**Last Updated**: February 22, 2026  
**System Version**: 1.0
