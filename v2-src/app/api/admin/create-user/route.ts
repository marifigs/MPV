import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Uses service_role key — only available server-side, never exposed to browser
function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(req: NextRequest) {
  const { email, password, full_name, role, store, caller_token } = await req.json();

  // Verify the caller is an authenticated admin
  const supabaseUser = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: { user }, error: authErr } = await supabaseUser.auth.getUser(caller_token);
  if (authErr || !user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const admin = adminClient();
  const { data: callerProfile } = await admin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (callerProfile?.role !== 'admin') {
    return NextResponse.json({ error: 'Solo administradores pueden crear usuarios' }, { status: 403 });
  }

  // Create the new user
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, role: role ?? 'vendor' },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Set store if provided
  if (store && data.user) {
    await admin.from('profiles').update({ store, invited_by: user.id }).eq('id', data.user.id);
  }

  return NextResponse.json({ success: true, userId: data.user?.id });
}
