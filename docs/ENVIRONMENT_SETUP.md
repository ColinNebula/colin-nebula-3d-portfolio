# Environment Variables Setup Guide

This guide explains how to configure environment variables for the Colin Nebula 3D Portfolio application.

## 📁 Environment Files Overview

- **`.env`** - Default configuration with example values (committed to git)
- **`.env.local`** - Your local development overrides (NOT committed to git)
- **`.env.production`** - Production-specific settings (committed to git)
- **`.env.local.example`** - Template for local environment setup

## 🚀 Quick Setup

### 1. For Local Development

1. Copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` with your actual credentials:
   ```bash
   # Your actual EmailJS credentials
   REACT_APP_EMAILJS_SERVICE_ID=your_actual_service_id
   REACT_APP_EMAILJS_TEMPLATE_ID=your_actual_template_id
   REACT_APP_EMAILJS_PUBLIC_KEY=your_actual_public_key
   ```

### 2. For Production Deployment

The production build will use values from `.env` and `.env.production`. Update these files with your production credentials before deployment.

## 🔧 Available Environment Variables

### EmailJS Configuration
```env
REACT_APP_EMAILJS_SERVICE_ID=service_id_here
REACT_APP_EMAILJS_TEMPLATE_ID=template_id_here
REACT_APP_EMAILJS_PUBLIC_KEY=public_key_here
```

### Website Configuration
```env
REACT_APP_WEBSITE_URL=https://your-website.com
REACT_APP_WEBSITE_NAME=Your Website Name
REACT_APP_HOMEPAGE=/your-homepage-path
```

### Development Configuration
```env
PORT=3000
BROWSER=true
GENERATE_SOURCEMAP=true
```

### Build Configuration
```env
ESLINT_NO_DEV_ERRORS=true
DISABLE_ESLINT_PLUGIN=false
```

## 📧 EmailJS Setup

1. Create an account at [EmailJS](https://www.emailjs.com/)
2. Create a new service (Gmail, Outlook, etc.)
3. Create an email template with these variables:
   - `{{user_name}}`
   - `{{user_email}}`
   - `{{website_name}}`
   - `{{thank_you_message}}`
   - `{{portfolio_link}}`
4. Get your Service ID, Template ID, and Public Key
5. Add them to your `.env.local` file

## 🔒 Security Notes

- **Never commit `.env.local`** - This file contains your sensitive credentials
- The `.env` file contains example/default values that are safe to commit
- Real credentials should only be in `.env.local` (development) or your deployment platform's environment variables (production)

## 🌍 Environment Priority

React loads environment variables in this order (highest priority first):

1. `.env.local` (local overrides, not committed)
2. `.env.production` (production-specific, committed)
3. `.env` (default values, committed)

## 🔧 Troubleshooting

### EmailJS Not Working?
1. Check that your environment variables are properly set
2. Verify your EmailJS credentials are correct
3. Make sure variables start with `REACT_APP_`
4. Restart your development server after changing environment variables

### Variables Not Loading?
1. Environment variables must start with `REACT_APP_` to be accessible in React
2. Restart your development server after adding new variables
3. Check that there are no syntax errors in your `.env` files

## 📝 Adding New Environment Variables

1. Add the variable to `.env` with a default/example value
2. Update this README with documentation
3. Add the variable to `.env.local.example` if it needs local customization
4. Import and use the variable in your code:
   ```javascript
   const myVariable = process.env.REACT_APP_MY_VARIABLE;
   ```

## 🚀 Deployment Platforms

### Netlify
Add environment variables in: Site Settings → Environment Variables

### Vercel
Add environment variables in: Project Settings → Environment Variables

### GitHub Pages
Use repository secrets: Settings → Secrets and Variables → Actions

### Heroku
Use the Heroku CLI or dashboard to set config vars:
```bash
heroku config:set REACT_APP_EMAILJS_SERVICE_ID=your_service_id
```