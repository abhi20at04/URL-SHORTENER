
import express from 'express'
import urlRoutes from './routes/urlRoutes.js'
import { limiter } from './middleware/rateLimiter.js';
import { redirectUrl } from './controllers/urlController.js';
import path from 'path';



const app = express();
// Trust proxy when behind a reverse proxy so req.protocol and X-Forwarded-* headers are respected.
// Enable by setting TRUST_PROXY=true or running with NODE_ENV=production.
if (process.env.TRUST_PROXY === 'true' || process.env.NODE_ENV === 'production') {
	app.set('trust proxy', true);
}
app.use(express.json());
app.use(express.static(path.resolve('public')));
app.use('/api', urlRoutes);
app.get('/:code', redirectUrl);

export default app