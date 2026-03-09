import { NextResponse } from 'next/server';
import { getStoragePath } from '@/lib/storage-paths';
import fs from 'fs/promises';
import path from 'path';
import nodemailer from 'nodemailer';

const MAX_MESSAGE_LENGTH = 4000;
const CONTACT_RECIPIENTS = (process.env.CONTACT_EMAIL_RECIPIENTS ?? 'chinesechurch.lr@gmail.com')
  .split(',')
  .map((value) => value.trim())
  .filter((value) => value);

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

async function sendNotification(payload: {
  name: string;
  email: string;
  message: string;
  receivedAt: string;
}) {
  const host = process.env.EMAIL_SMTP_HOST;
  const port = Number(process.env.EMAIL_SMTP_PORT ?? '587');
  const secure = process.env.EMAIL_SMTP_SECURE === 'true';
  const user = process.env.EMAIL_SMTP_USER;
  const pass = process.env.EMAIL_SMTP_PASS;

  if (!host || !user || !pass || CONTACT_RECIPIENTS.length === 0) {
    console.warn('Email notification skipped because SMTP settings are missing or recipient list is empty.');
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  const htmlBody = `<p><strong>Name:</strong> ${payload.name}</p>
<p><strong>Email:</strong> ${payload.email}</p>
<p><strong>Received At:</strong> ${payload.receivedAt}</p>
<p><strong>Message:</strong></p>
<p style="white-space: pre-wrap;">${payload.message}</p>`;

  await transporter.sendMail({
    from: `LRICBC Website <${user}>`,
    to: CONTACT_RECIPIENTS,
    subject: `New message from ${payload.name}`,
    text: `Name: ${payload.name}\nEmail: ${payload.email}\nReceived At: ${payload.receivedAt}\n\n${payload.message}`,
    html: htmlBody,
  });
}

export async function POST(request: Request) {
  let body: { name?: string; email?: string; message?: string };
  try {
    body = await request.json();
  } catch (error) {
    console.error('Failed to parse contact payload', error);
    return NextResponse.json({ error: 'Unable to understand the submitted data.' }, { status: 400 });
  }

  const name = (body.name ?? '').trim();
  const email = (body.email ?? '').trim();
  const message = (body.message ?? '').trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Name, email, and a message are required.' }, { status: 400 });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ error: 'Message is too long. Please shorten it.' }, { status: 400 });
  }

  const payload = {
    name,
    email,
    message,
    receivedAt: new Date().toISOString(),
    ip: request.headers.get('x-forwarded-for') || 'unknown',
  };

  try {
    const storageDir = getStoragePath('contact-messages');
    await fs.mkdir(storageDir, { recursive: true });

    const identifier = slugify(`${name}-${email}`) || 'contact';
    const fileName = `${Date.now()}-${identifier}.json`;
    const filePath = path.join(storageDir, fileName);

    await fs.writeFile(filePath, JSON.stringify(payload, null, 2), 'utf8');

    try {
      await sendNotification(payload);
    } catch (emailError) {
      console.error('Failed to send contact notification email', emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save contact message', error);
    return NextResponse.json({ error: 'Unable to store your message right now. Please try again later.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Use POST to send a contact message.' },
    { status: 405, headers: { Allow: 'POST' } }
  );
}
