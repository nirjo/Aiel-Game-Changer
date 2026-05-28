import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendContactConfirmation } from '@/lib/resend';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error: dbError } = await supabase
      .from('contact_submissions')
      .insert([
        {
          name,
          email,
          phone,
          message,
        }
      ]);

    if (dbError) {
      console.error('Supabase error inserting contact submission:', dbError);
      return NextResponse.json(
        { error: 'Failed to submit contact form' },
        { status: 500 }
      );
    }

    // Send auto-reply confirmation email (non-blocking)
    try {
      await sendContactConfirmation(email, name, message);
    } catch (emailError) {
      console.error('Failed to send contact confirmation email:', emailError);
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
