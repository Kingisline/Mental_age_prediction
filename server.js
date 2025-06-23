// Load environment variables
require('dotenv').config({ path: './config.env' });

const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
}));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Razorpay configuration
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Serve Razorpay key to frontend
app.get('/api/razorpay-key', (req, res) => {
  res.json({
    key_id: process.env.RAZORPAY_KEY_ID
  });
});

// Create order endpoint
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, currency, receipt, notes } = req.body;
    
    const options = {
      amount: amount, // Amount in paise
      currency: currency || 'INR',
      receipt: receipt,
      notes: notes || {}
    };
    
    const order = await razorpay.orders.create(options);
    
    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create order'
    });
  }
});

// Verify payment endpoint
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { paymentId, orderId, signature } = req.body;
    
    // Verify the payment signature
    const text = orderId + '|' + paymentId;
    const signature_expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');
    
    if (signature === signature_expected) {
      // Payment is verified
      res.json({
        success: true,
        message: 'Payment verified successfully'
      });
    } else {
      // Payment verification failed
      res.status(400).json({
        success: false,
        error: 'Payment verification failed'
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify payment'
    });
  }
});

// Get payment status endpoint
app.get('/api/payment-status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const payment = await razorpay.payments.fetch(orderId);
    
    res.json({
      success: true,
      payment: {
        id: payment.id,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        method: payment.method
      }
    });
  } catch (error) {
    console.error('Error fetching payment status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payment status'
    });
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Visit http://localhost:${PORT} to access the app`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💰 Razorpay Key: ${process.env.RAZORPAY_KEY_ID ? 'Configured' : 'Not configured'}`);
});

module.exports = app; 