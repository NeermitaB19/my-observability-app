import client from 'prom-client';

// Enable default metrics collection (includes memory, CPU, event loop lag)
client.collectDefaultMetrics();

// Histogram: HTTP request durations
export const httpRequestDurationSeconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 1, 1.5, 2, 5] // in seconds
});

// Counter: total number of HTTP requests
export const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

// Gauge: currently active HTTP requests
export const httpActiveRequests = new client.Gauge({
  name: 'http_active_requests',
  help: 'Number of in-flight (active) HTTP requests',
  labelNames: ['method', 'route']
});

// Histogram: response sizes
export const httpResponseSizeBytes = new client.Histogram({
  name: 'http_response_size_bytes',
  help: 'Size of HTTP responses in bytes',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [512, 1024, 2048, 4096, 8192, 16384, 65536, 131072]
});

// Gauge: heap used memory
export const heapUsedMemory = new client.Gauge({
  name: 'nodejs_heap_used_bytes_custom',
  help: 'Heap used memory in bytes'
});

// Gauge: external memory
export const externalMemory = new client.Gauge({
  name: 'nodejs_external_memory_bytes_custom',
  help: 'External memory used by the process'
});

// Track custom memory usage periodically
setInterval(() => {
  const memUsage = process.memoryUsage();
  heapUsedMemory.set(memUsage.heapUsed);
  externalMemory.set(memUsage.external);
}, 5000);

// Export register for Prometheus scraping
export const register = client.register;

