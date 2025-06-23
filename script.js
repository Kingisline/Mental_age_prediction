const questions = Array.from(document.querySelectorAll('.question'));
const form = document.getElementById('mental-age-form');
const resultDiv = document.getElementById('result');
const paymentModal = document.getElementById('payment-modal');
const adContainer = document.getElementById('ad-container');

let current = 0;
const total = questions.length;
let answers = Array(total).fill(null);
let resultsReady = false;
let adBlockerDetected = false;

// Razorpay configuration - will be loaded from server
let RAZORPAY_KEY_ID = null;

// Function to get Razorpay key from server
async function getRazorpayKey() {
  try {
    const response = await fetch('/api/razorpay-key');
    if (response.ok) {
      const data = await response.json();
      RAZORPAY_KEY_ID = data.key_id;
    } else {
      console.error('Failed to get Razorpay key');
    }
  } catch (error) {
    console.error('Error fetching Razorpay key:', error);
  }
}

// Ad blocker detection
function detectAdBlocker() {
  const testAd = document.createElement('div');
  testAd.innerHTML = '&nbsp;';
  testAd.className = 'adsbox';
  document.body.appendChild(testAd);
  
  setTimeout(() => {
    if (testAd.offsetHeight === 0) {
      adBlockerDetected = true;
    }
    document.body.removeChild(testAd);
  }, 100);
}

function showQuestion(idx) {
  questions.forEach((q, i) => {
    q.style.display = i === idx ? 'block' : 'none';
  });
  
  // Update navigation buttons
  document.getElementById('prev-btn').style.display = idx === 0 ? 'none' : 'inline-block';
  document.getElementById('next-btn').style.display = idx === total - 1 ? 'none' : 'inline-block';
  document.getElementById('submit-btn').style.display = idx === total - 1 ? 'inline-block' : 'none';
  
  // Update progress indicator
  document.getElementById('progress').textContent = `Question ${idx + 1} of ${total}`;
}

function saveAnswer() {
  const radios = questions[current].querySelectorAll('input[type="radio"]');
  radios.forEach((radio) => {
    if (radio.checked) {
      answers[current] = parseInt(radio.value, 10);
    }
  });
}

function restoreAnswer() {
  const radios = questions[current].querySelectorAll('input[type="radio"]');
  radios.forEach((radio) => {
    radio.checked = (parseInt(radio.value, 10) === answers[current]);
  });
}

function nextQuestion() {
  saveAnswer();
  if (answers[current] === null) {
    alert('Please select an answer to continue.');
    return;
  }
  if (current < total - 1) {
    current++;
    showQuestion(current);
    restoreAnswer();
  }
}

function prevQuestion() {
  saveAnswer();
  if (current > 0) {
    current--;
    showQuestion(current);
    restoreAnswer();
  }
}

function calculateMentalAge(score) {
  // Updated scoring ranges based on user's specifications
  if (score >= 30) return "50+ years (Wise, patient, strategic)";
  else if (score >= 24) return "30-49 years (Balanced, pragmatic)";
  else if (score >= 18) return "18-29 years (Youthful, curious)";
  else return "<18 years (Free-spirited, impulsive)";
}

function getPersonalityType(score) {
  if (score >= 30) return "Wise & Strategic";
  else if (score >= 24) return "Balanced & Pragmatic";
  else if (score >= 18) return "Youthful & Curious";
  else return "Free-spirited & Impulsive";
}

function showPaymentModal() {
  paymentModal.style.display = 'flex';
  if (adBlockerDetected) {
    alert('⚠️ Ad blocker detected! Please turn off your ad blocker and refresh the page to watch ads for free results.');
  }
}

function hidePaymentModal() {
  paymentModal.style.display = 'none';
}

function showResults() {
  // Calculate score using new scoring system
  const score = answers.reduce((a, b) => a + b, 0);
  const mentalAge = calculateMentalAge(score);
  const personalityType = getPersonalityType(score);
  
  // Hide form and show results
  form.style.display = 'none';
  
  resultDiv.innerHTML = `
    <div class="result-container">
      <h2>🎯 Your Mental Age Results</h2>
      <div class="score-display">
        <div class="score-item">
          <span class="label">Total Score:</span>
          <span class="value">${score}/36</span>
        </div>
        <div class="score-item">
          <span class="label">Mental Age:</span>
          <span class="value">${mentalAge}</span>
        </div>
        <div class="score-item">
          <span class="label">Personality Type:</span>
          <span class="value">${personalityType}</span>
        </div>
      </div>
      <button onclick="location.reload()" class="restart-btn">Take Test Again</button>
    </div>
  `;
}

// Create order on your server (you'll need a backend for this)
async function createOrder() {
  try {
    const orderData = {
      amount: 100, // Amount in paise (₹1 = 100 paise)
      currency: 'INR',
      receipt: 'mental_age_test_' + Date.now(),
      notes: {
        test_type: 'mental_age_detection'
      }
    };
    
    // Make API call to your server
    const response = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create order');
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to create order');
    }
    
    return result.order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

// Verify payment on your server
async function verifyPayment(paymentId, orderId, signature) {
  try {
    const response = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId, orderId, signature })
    });
    
    if (!response.ok) {
      throw new Error('Failed to verify payment');
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Payment verification failed');
    }
    
    return result;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
}

async function handlePayment() {
  const payBtn = document.getElementById('pay-btn');
  payBtn.textContent = 'Processing...';
  payBtn.disabled = true;
  
  try {
    // Ensure we have the Razorpay key
    if (!RAZORPAY_KEY_ID) {
      await getRazorpayKey();
    }
    
    if (!RAZORPAY_KEY_ID) {
      throw new Error('Razorpay key not configured');
    }
    
    // Create order
    const order = await createOrder();
    
    // Configure Razorpay options
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Mental Age Detection',
      description: 'Unlock your mental age results',
      order_id: order.id,
      handler: async function(response) {
        try {
          // Verify payment
          const verification = await verifyPayment(
            response.razorpay_payment_id,
            response.razorpay_order_id,
            response.razorpay_signature
          );
          
          if (verification.success) {
            hidePaymentModal();
            showResults();
            // Store payment status in localStorage
            localStorage.setItem('payment_completed', 'true');
            localStorage.setItem('payment_timestamp', Date.now());
          } else {
            alert('Payment verification failed. Please try again.');
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          alert('Payment verification failed. Please try again.');
        }
      },
      prefill: {
        name: '',
        email: '',
        contact: ''
      },
      theme: {
        color: '#4f8cff'
      },
      modal: {
        ondismiss: function() {
          payBtn.textContent = 'Pay ₹1';
          payBtn.disabled = false;
        }
      }
    };
    
    // Initialize Razorpay
    const rzp = new Razorpay(options);
    rzp.open();
    
  } catch (error) {
    console.error('Payment error:', error);
    alert('Payment initialization failed. Please try again.');
    payBtn.textContent = 'Pay ₹1';
    payBtn.disabled = false;
  }
}

function handleWatchAd() {
  if (adBlockerDetected) {
    alert('⚠️ Ad blocker detected! Please turn off your ad blocker and refresh the page to watch ads for free results.');
    return;
  }
  
  hidePaymentModal();
  adContainer.style.display = 'flex';
  
  let timeLeft = 30;
  const timerElement = document.getElementById('ad-timer');
  const progressBar = document.querySelector('.progress-bar');
  const skipBtn = document.getElementById('skip-ad-btn');
  
  const timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;
    progressBar.style.width = `${((30 - timeLeft) / 30) * 100}%`;
    
    if (timeLeft <= 0) {
      clearInterval(timer);
      adContainer.style.display = 'none';
      showResults();
      // Store ad completion status
      localStorage.setItem('ad_completed', 'true');
      localStorage.setItem('ad_timestamp', Date.now());
    }
  }, 1000);
  
  // Show skip button after 5 seconds
  setTimeout(() => {
    skipBtn.style.display = 'inline-block';
    skipBtn.onclick = () => {
      clearInterval(timer);
      adContainer.style.display = 'none';
      showResults();
      localStorage.setItem('ad_completed', 'true');
      localStorage.setItem('ad_timestamp', Date.now());
    };
  }, 5000);
}

// Check if user has already paid or watched ad
function checkPaymentStatus() {
  const paymentCompleted = localStorage.getItem('payment_completed');
  const adCompleted = localStorage.getItem('ad_completed');
  const paymentTimestamp = localStorage.getItem('payment_timestamp');
  const adTimestamp = localStorage.getItem('ad_timestamp');
  
  // Check if payment/ad was completed within last 24 hours
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  
  if (paymentCompleted && (now - paymentTimestamp < oneDay)) {
    return 'payment';
  } else if (adCompleted && (now - adTimestamp < oneDay)) {
    return 'ad';
  }
  
  return null;
}

form.addEventListener('submit', function(e) {
  e.preventDefault();
  saveAnswer();
  
  if (answers.includes(null)) {
    alert('Please answer all questions.');
    return;
  }
  
  // Check if user has already paid or watched ad
  const paymentStatus = checkPaymentStatus();
  if (paymentStatus) {
    // User has already paid or watched ad, show results directly
    showResults();
  } else {
    // Show payment/ad gate
    showPaymentModal();
  }
});

// Add navigation and progress elements
const navDiv = document.createElement('div');
navDiv.className = 'navigation';
navDiv.innerHTML = `
  <div class="progress-container">
    <span id="progress">Question 1 of ${total}</span>
  </div>
  <div class="nav-buttons">
    <button type="button" id="prev-btn" class="nav-btn">← Previous</button>
    <button type="button" id="next-btn" class="nav-btn">Next →</button>
    <button type="submit" id="submit-btn" class="submit-btn" style="display:none;">See My Mental Age</button>
  </div>
`;
form.appendChild(navDiv);

// Initial state
questions.forEach((q, i) => { q.style.display = 'none'; });
showQuestion(0);
restoreAnswer();

// Event listeners
document.getElementById('next-btn').onclick = nextQuestion;
document.getElementById('prev-btn').onclick = prevQuestion;

// Payment/Ad event listeners
document.getElementById('pay-btn').onclick = handlePayment;
document.getElementById('watch-ad-btn').onclick = handleWatchAd;

// Add radio button change listeners to enable next button
questions.forEach((question, index) => {
  const radios = question.querySelectorAll('input[type="radio"]');
  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      answers[index] = parseInt(radio.value, 10);
    });
  });
});

// Initialize on page load
detectAdBlocker();
getRazorpayKey(); 