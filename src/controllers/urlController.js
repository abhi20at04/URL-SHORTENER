import { generateShortCode, saveUrl, getUrlByCode } from '../services/urlServices.js';
// const { generateShortCode, saveUrl, getUrlByCode } = require('../services/urlServices');


const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (err) {
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
  
      const code = await generateShortCode(); // make sure generateShortCode is async
      await saveUrl(code, originalUrl);
  
      console.log('Short URL saved');
      res.json({ shortUrl: `http://localhost:3000/${code}` });
    } catch (err) {
      console.error('Error in shortenUrl:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const redirectUrl = async (req, res) => {
  try {
    const { code } = req.params;
    const originalUrl = await getUrlByCode(code);

    if (originalUrl) {
      console.log(`Redirecting to: ${originalUrl}`);
      res.redirect(originalUrl);
    } else {
      res.status(404).json({ error: 'Short URL not found' });
    }
  } catch (err) {
    console.error('Error in redirectUrl:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


