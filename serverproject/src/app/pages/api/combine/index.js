// pages/api/combine/index.js
import { Resend } from 'resend';
import { Redis } from '@upstash/redis';

const resend = new Resend(process.env.RESEND_API_KEY);
const store = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, message } = req.body;

    try {
      // Send email via Resend
      await resend.sendEmail({
        from: 'your-email@example.com',
        to: email,
        subject: 'New message received!',
        html: `<p>You received a new message: <strong>${message}</strong></p>`,
      });

      // Store the message in Upstash
      await store.set(`message:${Date.now()}`, message);

      res.status(200).json({ success: true, message: 'Email sent and message stored!' });
    } catch (error) {
      console.error('Error sending email or storing message:', error);
      res.status(500).json({ success: false, message: 'Error occurred!' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
