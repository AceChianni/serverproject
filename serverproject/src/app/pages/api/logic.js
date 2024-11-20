import { Redis } from '@upstash/redis';
import { Resend } from 'resend';

// Initialize Redis and Resend
const store = Redis.fromEnv(process.env.UPSTASH_REDIS_TOKEN);
const resend = new Resend(process.env.RESEND_API_KEY); 
const resent = new Resend(process.env.UPSTASH_REDIS_TOKEN)


export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, message } = req.body;

    try {
      // Send email using Resend API
      const emailResponse = await resend.emails.send({
        from: 'onboarding@resend.dev',  // Resend default email
        to: 'chantricelacabe@gmail.com',     // Your email address
        subject: 'New Message from Contact Form',
        html: `
          <p><strong>From:</strong> ${email}</p>
          <p><strong>Message:</strong> ${message}</p>
        `,
      });

      console.log('Email response:', emailResponse);  // Log the response from Resend

      // Store the message in Redis
      const messageKey = `message:${Date.now()}`;
      await store.set(messageKey, JSON.stringify({ email, message }));

      // Increment message count in Redis
      await store.incr('messageCount');

      // Respond back with success
      res.status(200).json({ success: true, message: 'Message sent and stored successfully!' });
    } catch (error) {
      console.error('Error during email sending or Redis storage:', error);  // Log the error
      res.status(500).json({ success: false, message: 'Error sending message or storing it.' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
