import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, fullName, email, whatsapp, license, pincode, vehicleType, avgKm } = body;

    if (!userId || !fullName || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, fullName, email' },
        { status: 400 }
      );
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY === 'your_copied_service_role_key_here') {
      return NextResponse.json(
        { error: 'Server configuration error: Missing Supabase Service Role Key.' },
        { status: 500 }
      );
    }

    const { error } = await supabaseAdmin
      .from('users')
      .insert([
        {
          id: userId,
          full_name: fullName,
          email: email,
          whatsapp_number: whatsapp,
          driving_license: license,
          pincode: pincode,
          vehicle_type: vehicleType,
          avg_km_per_day: avgKm,
        },
      ]);

    if (error) {
      console.error('Profile creation error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('API error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
