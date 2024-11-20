// pages/api/send-email/index.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, message } = req.body;

    try {
      // Send email via Resend
      await resend.sendEmail({
        from: 'your-email@example.com',
        to: email,
        subject: 'Message Received',
        html: `<p>You received a new message: <strong>${message}</strong></p>`,
      });

      res.status(200).json({ success: true, message: 'Email sent!' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ success: false, message: 'Error sending email!' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
