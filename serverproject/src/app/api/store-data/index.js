import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const store = Redis.fromEnv();

export async function GET(req) {
  await store.incr('counter');
  const counter = await store.get('counter');
  return NextResponse.json({ counter });
}

export async function POST(req) {
  const { message } = await req.json();
  await store.set('message', message);
  return NextResponse.json({ message: 'Message stored!' });
}
