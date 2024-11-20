import { Redis } from '@upstash/redis';
import { Resend } from 'resend';

const store = Redis.fromEnv();
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, message } = req.body;

    try {
      // Send email logic using Resend
      const emailResponse = await resend.emails.send({
        from: 'youremail@example.com', 
        to: 'youremail@example.com',
        subject: 'New Message from Contact Form',
        html: `
          <p><strong>From:</strong> ${email}</p>
          <p><strong>Message:</strong> ${message}</p>
        `,
      });

      // Store message in Redis
      const messageKey = `message:${Date.now()}`;
      await store.set(messageKey, JSON.stringify({ email, message }));

      // Increment message count
      await store.incr('messageCount');

      // Respond back
      res.status(200).json({ success: true, message: 'Message sent and stored successfully!' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, message: 'Error sending message or storing it.' });
    }
  } else {
    // Method Not Allowed
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
