import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import dotenv from 'dotenv';

import routes from './routes/index.js';
import { sequelize, User } from './models/index.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1);

// Simple CORS middleware - allow all origins
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

app.use(cors({
  origin: '*',
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// General API rate limiter - 1000 requests per 15 minutes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later.',
  skip: (req) => req.path.startsWith('/api/auth')
});

// Auth rate limiter - 50 requests per 15 minutes (more lenient for login/register)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many login attempts, please try again later.',
  keyGenerator: (req) => req.body?.email || req.ip
});

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Manufacturing & Quality Instruction Document Finder API',
    version: '1.0.1'
  });
});

app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter, routes);

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const seedAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({
      where: { email: 'melanie@admin.com' }
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }

    await User.create({
      firstName: 'Melanie',
      middleName: 'Chavaria',
      lastName: 'Birmingham',
      suffix: '',
      email: 'melanie@admin.com',
      password: "Ma'am123",
      role: 'admin',
      isVerified: true,
      photoUrl: 'https://via.placeholder.com/150?text=Melanie',
      photoPublicId: 'placeholder-admin'
    });

    console.log('✅ Admin user created successfully');
    console.log('📧 Email: melanie@admin.com');
    console.log('🔐 Password: Ma\'am123');
  } catch (error) {
    console.error('⚠️ Error seeding admin user:', error.message);
  }
};

const bootstrap = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    await sequelize.sync({ alter: true });
    await seedAdminUser();
    server.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

bootstrap();
