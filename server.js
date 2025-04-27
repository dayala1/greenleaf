import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import validator from 'validator';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';

const app = express();
const PORT = process.env.PORT || 4000;
const ENV = process.env.NODE_ENV || 'development';

// Middleware for security headers (only in production)
if (ENV === 'production') {
  app.use(helmet());
}

// Enable CORS
const corsOptions = {
  origin: ENV === 'production' ? 'https://your-production-domain.com' : '*', // Allow all origins in development
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));

// Logging (detailed logs in development, minimal in production)
if (ENV === 'development') {
  app.use(morgan('dev')); // Short logs for development
} else {
  app.use(morgan('combined')); // Detailed logs for production
}

// Parse JSON requests
app.use(express.json());

app.use(hpp());

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Routes
app.post('/api/contact', (req, res, next) => {
  try {
    const { firstname, lastname, email, message } = req.body;

    if (!firstname || !lastname || !email || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }

    if (validator.isEmpty(message.trim())) {
      return res.status(400).json({ success: false, message: 'Message cannot be empty.' });
    }

    // Process the request
    console.log(`Name: ${firstname} ${lastname}, Email: ${email}, Message: ${message}`);
    res.json({ success: true, message: 'Form submitted successfully!' });
  } catch (error) {
    next(error); // Pass to error handler
  }
});

// Catch 404s
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// Add global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: ENV === 'production' ? 'Internal server error' : err.message
  });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT} in ${ENV} mode`);
});