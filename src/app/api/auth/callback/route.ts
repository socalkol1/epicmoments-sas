import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/portal';

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const user = data.user;
      const metadata = user.user_metadata;

      // Extract name from Google OAuth metadata
      // Google provides: full_name, name, given_name, family_name
      const fullName = metadata?.full_name || metadata?.name ||
        (metadata?.given_name && metadata?.family_name
          ? `${metadata.given_name} ${metadata.family_name}`
          : null);

      // Update profile with name if we have it and profile exists
      if (fullName) {
        // Only update if full_name is not already set
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();

        if (existingProfile && !existingProfile.full_name) {
          await supabase
            .from('profiles')
            .update({ full_name: fullName as string })
            .eq('id', user.id);
        }
      }

      // Check if user has a profile with missing info (for profile completion flow)
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, tenant_id')
        .eq('id', user.id)
        .single<Pick<Profile, 'full_name' | 'tenant_id'>>();

      // If profile is incomplete and user came from OAuth (not signup), redirect to complete profile
      if (profile && !profile.full_name && !profile.tenant_id && next === '/portal') {
        return NextResponse.redirect(`${origin}/complete-profile`);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
