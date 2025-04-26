import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

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

// Routes
app.post('/api/contact', (req, res) => {
  const { firstname, lastname, email, message } = req.body;

  // Basic validation
  if (!firstname || !lastname || !email || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  console.log(`Name: ${firstname} ${lastname}, Email: ${email}, Message: ${message}`);
  res.json({ success: true, message: 'Form submitted successfully!' });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT} in ${ENV} mode`);
});