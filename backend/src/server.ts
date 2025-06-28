import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import departmentRoutes from './routes/departments';

import express, { Request, Response, NextFunction } from 'express';

dotenv.config();

const app = express();

const allowedOrigins: (string | RegExp)[] = [
  'https://purchase-order-management.vercel.app',
  /^https:\/\/purchase-order-management.*\.vercel\.app$/
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    const isAllowed = allowedOrigins.some(pattern => {
      if (typeof pattern === 'string') return pattern === origin;
      return pattern.test(origin);
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      console.log(`❌ CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(helmet({ crossOriginEmbedderPolicy: false }));
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
app.use('/api/departments', departmentRoutes);

app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
