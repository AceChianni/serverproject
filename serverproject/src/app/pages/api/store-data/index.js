// pages/api/store-data/index.js
import { Redis } from '@upstash/redis';

const store = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { message } = req.body;

    try {
      // Increment a counter each time this route is hit
      await store.incr('messageCount');

      // Store the message in Upstash with a unique key
      await store.set(`message:${Date.now()}`, message);

      // Respond with success
      res.status(200).json({
        success: true,
        message: 'Message stored and counter incremented!',
      });
    } catch (error) {
      console.error('Error storing message or incrementing counter:', error);
      res.status(500).json({
        success: false,
        message: 'Error storing message or incrementing counter.',
      });
    }
  } else {
    // Respond with Method Not Allowed if the request isn't POST
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
