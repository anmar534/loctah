import express, { Application } from 'express';
import cors from 'cors';
import { config } from './config/env';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

// Initialize Express app
const app: Application = express();

// Middleware
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Loctah API Server',
    version: '1.0.0',
    endpoints: {
      health: '/api/v1/health',
      api: '/api/v1',
    },
  });
});

// API Routes
app.use('/api/v1', routes);

// Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Start Server
const PORT = config.port;

app.listen(PORT, () => {
  console.log('🚀 Server started successfully!');
  console.log(`📍 Environment: ${config.env}`);
  console.log(`🌐 Server running on: http://localhost:${PORT}`);
  console.log(`📊 API Endpoint: http://localhost:${PORT}/api/v1`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/api/v1/health`);
  console.log('\n📝 Available Routes:');
  console.log('   - POST /api/v1/auth/register');
  console.log('   - POST /api/v1/auth/login');
  console.log('   - GET  /api/v1/auth/me');
  console.log('   - GET  /api/v1/products');
  console.log('   - GET  /api/v1/categories');
  console.log('   - GET  /api/v1/stores');
  console.log('   - GET  /api/v1/offers');
  console.log('   - GET  /api/v1/favorites');
  console.log('\n✅ Ready to accept requests!');
});

export default app;
