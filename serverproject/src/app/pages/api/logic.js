// /pages/api/logic.js

import { Redis } from '@upstash/redis';
import { Resend } from 'resend';

// Initialize Redis client
const store = Redis.fromEnv();
// Initialize Resend client with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, message } = req.body;

    try {
      // Send email via Resend
      const emailResponse = await resend.emails.send({
        from: 'youremail@example.com',  // Replace with your 'from' email address
        to: 'acechianni@gmail.com',     // Your requested email address
        subject: 'New Message from Contact Form',
        html: `
          <p><strong>From:</strong> ${email}</p>
          <p><strong>Message:</strong> ${message}</p>
        `,
      });

      // Store the message in Redis with a unique key
      const messageKey = `message:${Date.now()}`;
      await store.set(messageKey, JSON.stringify({ email, message }));

      // Increment message count in Redis
      await store.incr('messageCount');

      // Respond back with a success message
      res.status(200).json({ success: true, message: 'Message sent and stored successfully!' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, message: 'Error sending message or storing it.' });
    }
  } else {
    // If the request is not POST, return Method Not Allowed
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
