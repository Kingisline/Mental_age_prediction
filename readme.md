# 🧠 Mental Age Detection App

A comprehensive mental age assessment tool with integrated payment gateway and ad-based monetization.

## ✨ Features

- **12 comprehensive questions** with 4 options each
- **Advanced scoring system** (A=3, B=2, C=1, D=0 points)
- **Real payment integration** with Razorpay (₹1 payment)
- **Ad-based alternative** (30-second ad watching)
- **Ad blocker detection** with user guidance
- **Responsive design** for all devices
- **Payment verification** and security
- **24-hour access** after payment/ad completion

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- Razorpay account and API keys

### Installation

1. **Clone or download the project files**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Razorpay credentials**
   
   Create a `.env` file in the root directory:
   ```env
   RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
   RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
   ```
   
   Or update the keys directly in `server.js`:
   ```javascript
   const razorpay = new Razorpay({
     key_id: 'rzp_test_YOUR_KEY_ID',
     key_secret: 'YOUR_KEY_SECRET'
   });
   ```

4. **Update frontend keys**
   
   In `script.js`, update the Razorpay key:
   ```javascript
   const RAZORPAY_KEY_ID = 'rzp_test_YOUR_KEY_ID';
   ```

5. **Start the server**
   ```bash
   npm start
   ```

6. **Access the app**
   
   Open your browser and go to: `http://localhost:3000`

## 🔧 Razorpay Setup

### 1. Create Razorpay Account
- Visit [Razorpay Dashboard](https://dashboard.razorpay.com/)
- Sign up for a free account
- Complete KYC verification

### 2. Get API Keys
- Go to Settings → API Keys
- Generate a new key pair
- Copy the Key ID and Key Secret

### 3. Test Mode vs Live Mode
- **Test Mode**: Use `rzp_test_` keys for development
- **Live Mode**: Use `rzp_live_` keys for production

### 4. Webhook Setup (Optional)
For production, set up webhooks to handle payment events:
```
https://yourdomain.com/api/webhook
```

## 📊 Mental Age Scoring

| Score Range | Mental Age | Personality Type |
|-------------|------------|------------------|
| 30-36 pts | 50+ years | Wise, patient, strategic |
| 24-29 pts | 30-49 years | Balanced, pragmatic |
| 18-23 pts | 18-29 years | Youthful, curious |
| 0-17 pts | <18 years | Free-spirited, impulsive |

## 💰 Payment Flow

1. **User completes test** → Payment modal appears
2. **Two options**:
   - **Pay ₹1**: Redirects to Razorpay payment gateway
   - **Watch Ad**: 30-second ad timer
3. **Payment verification** → Results displayed
4. **24-hour access** granted after payment/ad

## 🛡️ Security Features

- **Payment signature verification**
- **Server-side order creation**
- **Secure payment processing**
- **Ad blocker detection**
- **Local storage for session management**

## 📱 Responsive Design

- **Mobile-first approach**
- **Touch-friendly interface**
- **Cross-browser compatibility**
- **Progressive enhancement**

## 🔄 API Endpoints

### Create Order
```
POST /api/create-order
Content-Type: application/json

{
  "amount": 100,
  "currency": "INR",
  "receipt": "mental_age_test_1234567890",
  "notes": {
    "test_type": "mental_age_detection"
  }
}
```

### Verify Payment
```
POST /api/verify-payment
Content-Type: application/json

{
  "paymentId": "pay_xxx",
  "orderId": "order_xxx",
  "signature": "xxx"
}
```

### Get Payment Status
```
GET /api/payment-status/:orderId
```

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production Deployment
```bash
npm start
```

### Environment Variables
```env
PORT=3000
RAZORPAY_KEY_ID=rzp_live_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_LIVE_KEY_SECRET
NODE_ENV=production
```

## 📝 Customization

### Questions
Edit questions in `index.html`:
```html
<div class="question">
  <p>Your question here?</p>
  <label><input type="radio" name="q1" value="3"> A) Option A</label>
  <label><input type="radio" name="q1" value="2"> B) Option B</label>
  <label><input type="radio" name="q1" value="1"> C) Option C</label>
  <label><input type="radio" name="q1" value="0"> D) Option D</label>
</div>
```

### Styling
Customize appearance in `styles.css`

### Payment Amount
Update amount in `script.js`:
```javascript
amount: 100, // 100 paise = ₹1
```

## 🐛 Troubleshooting

### Payment Issues
- Verify Razorpay API keys
- Check network connectivity
- Ensure proper CORS setup
- Verify payment signature

### Ad Blocker Detection
- Test with different ad blockers
- Check browser console for errors
- Verify ad detection logic

### Server Issues
- Check Node.js version
- Verify all dependencies installed
- Check port availability
- Review server logs

## 📄 License

MIT License - feel free to use and modify as needed.

## 🤝 Support

For issues and questions:
- Check the troubleshooting section
- Review Razorpay documentation
- Test with different browsers
- Verify API credentials

---

**Note**: This is a demo implementation. For production use, ensure proper security measures, SSL certificates, and compliance with payment regulations.

