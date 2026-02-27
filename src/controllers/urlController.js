import { generateShortCode, saveUrl, getUrlByCode } from '../services/urlServices.js';

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const shortenUrl = async (req, res) => {
  try {
    console.log('Received request:', req.body);
    const { originalUrl } = req.body;

    if (typeof originalUrl !== 'string') {
      return res.status(400).json({ error: 'Invalid input: originalUrl must be a string' });
    }

    if (!isValidUrl(originalUrl)) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    const code = await generateShortCode();
    await saveUrl(code, originalUrl);

    console.log('Short URL saved');

    const buildBaseUrl = () => {
      if (process.env.BASE_URL && typeof process.env.BASE_URL === 'string' && process.env.BASE_URL.trim() !== '') {
        return process.env.BASE_URL.replace(/\/$/, '');
      }
      const forwardedProto = req.get('X-Forwarded-Proto');
      const forwardedHost = req.get('X-Forwarded-Host') || req.get('host');
      const proto = forwardedProto || req.protocol;
      const host = forwardedHost;
      return `${proto}://${host}`;
    };

    const baseUrl = buildBaseUrl();
    const shortUrl = `${baseUrl}/${code}`;

    console.log('BASE_URL env:', process.env.BASE_URL, 'computed baseUrl:', baseUrl);

    res.json({ shortUrl });
  } catch (err) {
    console.error('Error in shortenUrl:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const redirectUrl = async (req, res) => {
  try {
    const { code } = req.params;
    if (!code) return res.status(400).send('Bad Request');

    const originalUrl = await getUrlByCode(code);
    if (!originalUrl) return res.status(404).send('Not Found');

    return res.redirect(originalUrl);
  } catch (err) {
    console.error('Error in redirectUrl:', err);
    return res.status(500).send('Internal Server Error');
  }
};
