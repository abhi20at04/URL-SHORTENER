
import express from 'express'
import urlRoutes from './routes/urlRoutes.js'
import { limiter } from './middleware/rateLimiter.js';
import path from 'path'



const app = express();
app.use(express.json());
// app.use(express.static(path.resolve('public')));
app.use('/api', urlRoutes);

export default app