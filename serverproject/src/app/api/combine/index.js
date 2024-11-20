import { NextResponse } from 'next/server';
import { Resend } from '@resend/node';
import { Redis } from '@upstash/redis';

const resend = new Resend(process.env.RESEND_API_KEY);
const store = Redis.fromEnv();

export async function POST(req) {
  const { message, email } = await req.json();

  try {
    await resend.sendEmail({
      from: 'your-email@example.com',
      to: email,
      subject: 'Message received',
      html: `<h1>${message}</h1>`,
    });

    await store.set(email, message);

    return NextResponse.json({ message: 'Email sent and data stored!' });
  } catch (error) {
    return NextResponse.json({ message: 'Error sending email or storing data!' });
  }
}
