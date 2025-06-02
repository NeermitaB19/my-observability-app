import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/tasks';

import {
  register,
  httpRequestDurationSeconds,
  httpRequestsTotal,
  httpActiveRequests,
  httpResponseSizeBytes
} from './utils/metrics'; // Prometheus metrics

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Prometheus middleware to track metrics
app.use((req, res, next) => {
  const end = httpRequestDurationSeconds.startTimer();
  const routePath = req.path; // initial path, before route resolution
  httpActiveRequests.inc({ method: req.method, route: routePath });

  res.on('finish', () => {
    const route =
      req.route?.path || req.originalUrl || routePath; // fallback to original URL
    const labels = {
      method: req.method,
      route,
      status_code: res.statusCode
    };

    end(labels);
    httpRequestsTotal.inc(labels);
    httpActiveRequests.dec({ method: req.method, route });
    const contentLength = parseInt(res.get('Content-Length') || '0', 10);
    httpResponseSizeBytes.observe(labels, contentLength);
  });

  next();
});

//  Prometheus metrics endpoint
app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

//  API routes
app.use('/api/tasks', taskRoutes);

//  Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
