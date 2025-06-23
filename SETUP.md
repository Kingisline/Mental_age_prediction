# 🚀 Setup Guide - Mental Age Detection App

## 📋 Prerequisites

- Node.js (v14 or higher)
- Razorpay account
- Basic knowledge of command line

## 🔧 Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Get Razorpay API Keys

1. **Sign up for Razorpay**
   - Visit [Razorpay Dashboard](https://dashboard.razorpay.com/)
   - Create a free account
   - Complete KYC verification

2. **Generate API Keys**
   - Go to Settings → API Keys
   - Click "Generate Key Pair"
   - Copy the Key ID and Key Secret

### 3. Configure Environment Variables

1. **Rename the config file**
   ```bash
   # Copy the example config
   cp config.env .env
   ```

2. **Edit the .env file**
   ```env
   # Razorpay API Configuration
   RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_KEY_ID
   RAZORPAY_KEY_SECRET=YOUR_ACTUAL_KEY_SECRET
   
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # App Configuration
   APP_NAME=Mental Age Detection
   APP_DESCRIPTION=Unlock your mental age results
   
   # Security
   CORS_ORIGIN=http://localhost:3000
   ```

### 4. Test Mode vs Live Mode

**For Development (Test Mode):**
- Use keys starting with `rzp_test_`
- No real money transactions
- Perfect for testing

**For Production (Live Mode):**
- Use keys starting with `rzp_live_`
- Real money transactions
- Requires completed KYC

### 5. Start the Application

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

### 6. Access the App

Open your browser and go to: `http://localhost:3000`

## 🔍 Verification Steps

### Check Server Status
When you start the server, you should see:
```
🚀 Server running on port 3000
📱 Visit http://localhost:3000 to access the app
🔧 Environment: development
💰 Razorpay Key: Configured
```

### Test Payment Flow
1. Complete the mental age test
2. Click "Pay ₹1"
3. Razorpay payment modal should open
4. Use test card: `4111 1111 1111 1111`
5. Any future expiry date
6. Any 3-digit CVV

## 🛠️ Troubleshooting

### Common Issues

**1. "Razorpay key not configured"**
- Check your `.env` file exists
- Verify API keys are correct
- Ensure no extra spaces in values

**2. "Failed to create order"**
- Check Razorpay dashboard for errors
- Verify account is active
- Check network connectivity

**3. "Payment verification failed"**
- Ensure both key_id and key_secret are set
- Check signature verification logic
- Verify payment was actually completed

**4. Server won't start**
- Check if port 3000 is available
- Verify Node.js version (v14+)
- Check all dependencies are installed

### Environment Variables Checklist

- [ ] `RAZORPAY_KEY_ID` is set
- [ ] `RAZORPAY_KEY_SECRET` is set
- [ ] Keys start with `rzp_test_` (development)
- [ ] No extra spaces or quotes in values
- [ ] File is named `.env` (not `.env.txt`)

### Security Best Practices

1. **Never commit `.env` files**
   - Add `.env` to `.gitignore`
   - Use `.env.example` for templates

2. **Use environment-specific keys**
   - Test keys for development
   - Live keys for production

3. **Regular key rotation**
   - Change keys periodically
   - Monitor for suspicious activity

## 📱 Production Deployment

### Environment Variables for Production
```env
NODE_ENV=production
RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_LIVE_KEY_SECRET
CORS_ORIGIN=https://yourdomain.com
```

### SSL Certificate
- Required for production
- Razorpay requires HTTPS
- Use Let's Encrypt or your hosting provider

### Webhook Setup (Optional)
For production, set up webhooks:
```
https://yourdomain.com/api/webhook
```

## 🆘 Support

If you encounter issues:

1. **Check the console logs** for error messages
2. **Verify your Razorpay account** is active
3. **Test with different browsers**
4. **Check network connectivity**
5. **Review Razorpay documentation**

### Useful Links
- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay Dashboard](https://dashboard.razorpay.com/)
- [Node.js Documentation](https://nodejs.org/docs/)

---

**Note**: This setup guide assumes you're running the app locally. For production deployment, additional steps may be required based on your hosting provider. 