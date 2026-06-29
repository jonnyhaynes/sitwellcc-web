import type { APIRoute } from 'astro';
import sendgrid from '@sendgrid/mail';

export const prerender = false;

sendgrid.setApiKey(import.meta.env.SENDGRID_API_KEY || '');

const recipientFor = (query: string): string => {
  switch (query) {
    case 'Club Rides':
      return 'captain@sitwell.cc';
    case 'Go-Ride coaching':
      return 'coach@sitwell.cc';
    case 'Races':
      return 'racing@sitwell.cc';
    case 'Charity work':
      return 'community@sitwell.cc';
    case 'Membership':
      return 'membership@sitwell.cc';
    case 'Kit':
      return 'kit@sitwell.cc';
    case 'Welfare & Safeguarding':
      return 'welfare@sitwell.cc';
    default:
      return 'team@sitwell.cc';
  }
};

export const POST: APIRoute = async ({ request }) => {
  const { name, email, query, message } = await request.json();

  try {
    await sendgrid.send({
      to: recipientFor(query),
      from: 'noreply@sitwell.cc',
      replyTo: `${email}`,
      subject: `Website Enquiry : ${query}`,
      text: `Name: ${name}\nEmail: ${email}\nQuery: ${query}\nMessage: ${message}`,
    });
  } catch (error) {
    const e = error as { code?: number; message?: string };
    return new Response(JSON.stringify({ error: e.message || 'Send failed' }), {
      status: e.code || 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ error: '' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
