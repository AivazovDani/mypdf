import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Import the report generation and metrics services
import { generateReport } from './reportGenerator.js';
import { fetchMetrics } from './metricsService.js';

// Determine __dirname in ES module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the front‑end directory
const frontendDir = path.join(__dirname, '..', '..', 'frontend');
app.use(express.static(frontendDir));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Report generation route
app.post('/api/report', async (req, res) => {
  try {
    const { since, until, platform, profileUrl } = req.body;
    // Fetch metrics for the specified date range and platform
    const metrics = await fetchMetrics(since, until, platform, profileUrl);
    // Generate PDF buffer
    const pdfBuffer = await generateReport(metrics, { since, until });
    // Send PDF as response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="report.pdf"');
    res.send(pdfBuffer);
  } catch (err) {
    console.error('Error generating report:', err);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

// Fallback: serve index.html for any unmatched route (client‑side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});