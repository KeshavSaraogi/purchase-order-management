import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();

const allowedOrigins: string[] = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://purchase-order-management.vercel.app',
  'https://purchase-order-management-fwzl.vercel.app',
  'https://purchase-order-management-git-main-keshavsaraogis-projects.vercel.app',
  'https://purchase-order-management-bhxci52jc-keshavsaraogis-projects.vercel.app'
];

const allowedOriginPatterns: RegExp[] = [
  /^https:\/\/purchase-order-management.*\.vercel\.app$/
];

const normalizeOrigin = (origin: string | undefined): string => {
  if (!origin) return '';
  return origin.replace(/\/+$/, '');
};

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    const normalizedOrigin = normalizeOrigin(origin);

    if (!origin) {
      callback(null, true);
      return;
    }

    const isAllowedOrigin = allowedOrigins.includes(normalizedOrigin);
    
    const isMatchingPattern = allowedOriginPatterns.some(pattern => 
      pattern.test(normalizedOrigin)
    );

    if (isAllowedOrigin || isMatchingPattern) {
      callback(null, true);
    } else {
      console.log(`❌ CORS blocked origin: ${normalizedOrigin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(helmet({
  crossOriginEmbedderPolicy: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.get('Origin') || 'none'}`);
  next();
});

app.get('/', (req, res) => {
  res.json({ 
    message: '✅ Backend API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use('/api', authRoutes);

app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Allowed origins:`, allowedOrigins);
  console.log(`🔗 Allowed patterns:`, allowedOriginPatterns);
});