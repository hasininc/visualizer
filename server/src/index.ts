import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import workspacesRouter from './routes/workspaces.js';
import algorithmsRouter from './routes/algorithms.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS setup
app.use(cors({
  origin: '*', // Allow all in dev environment
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parser
app.use(express.json());

// Routes middleware
app.use('/api/workspaces', workspacesRouter);
app.use('/api/algorithms', algorithmsRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Start listening
app.listen(PORT, () => {
  console.log(`[Server] DSA Visualizer Backend listening on port ${PORT}`);
  console.log(`[Server] Workspace API: http://localhost:${PORT}/api/workspaces`);
  console.log(`[Server] Algorithms API: http://localhost:${PORT}/api/algorithms`);
});
