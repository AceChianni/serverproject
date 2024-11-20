import { NextResponse } from 'next/server';
import { Resend } from '@resend/node';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req) {
  try {
    const email = await resend.sendEmail({
      from: 'your-email@example.com', // Replace with your email
      to: 'your-email@example.com',   // Replace with your email
      subject: 'Test Email from Next.js',
      html: '<h1>Hello from Next.js!</h1>',
    });

    return NextResponse.json({ message: 'Email sent!' });
  } catch (error) {
    return NextResponse.json({ message: 'Error sending email!' });
  }
}
