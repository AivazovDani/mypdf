import { generateReport } from './reportGenerator.js';
import fs from 'fs';
async function run() {
  const metrics = {
    followerHistory: Array.from({ length: 15 }, (_, i) => {
      return { date: new Date(Date.now() - (14 - i) * 24*60*60*1000).toISOString(), count: 1000 + i * 50 };
    }),
    topPosts: [
      { title: 'Post about new product features', likes: 1200, comments: 140 },
      { title: 'Behind the scenes of the office renovation', likes: 980, comments: 90 },
      { title: 'How we grew our business', likes: 750, comments: 100 }
    ]
  };
  const buffer = await generateReport(metrics, { since: new Date(Date.now()-14*24*60*60*1000).toISOString(), until: new Date().toISOString() });
  fs.writeFileSync('/home/oai/share/test-report-latest.pdf', buffer);
}
run().catch(err => console.error(err));
