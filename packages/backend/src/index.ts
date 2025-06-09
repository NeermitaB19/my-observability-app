import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/tasks';
import dotenv from 'dotenv';
dotenv.config();

import {
  register,
  httpRequestDurationSeconds,
  httpRequestsTotal,
  httpActiveRequests,
  httpResponseSizeBytes
} from './utils/metrics';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Prometheus middleware to track metrics
app.use((req, res, next) => {
  // Normalize route to avoid label explosion and negative counts
  const rawRoute = req.originalUrl.split('?')[0]; // Remove query params
  const normalizedRoute = rawRoute.replace(/\/\d+/g, '/:id'); // Replace numeric IDs with ':id'

  const labels = {
    method: req.method,
    route: normalizedRoute
  };

  httpActiveRequests.inc(labels);
  const end = httpRequestDurationSeconds.startTimer();

  res.on('finish', () => {
    const statusLabels = {
      ...labels,
      status_code: res.statusCode.toString()
    };

    end(statusLabels);
    httpRequestsTotal.inc(statusLabels);
    httpActiveRequests.dec(labels);

    const contentLength = parseInt(res.get('Content-Length') || '0', 10);
    if (!isNaN(contentLength)) {
      httpResponseSizeBytes.observe(statusLabels, contentLength);
    }
  });

  res.on('close', () => {
    if (!res.writableEnded) {
      httpActiveRequests.dec(labels);
    }
  });

  next();
});

// Prometheus metrics endpoint
app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// API routes
app.use('/api/tasks', taskRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
