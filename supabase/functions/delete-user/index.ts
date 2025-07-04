import { serve } from 'https://deno.land/std/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

serve(async (req) => {
  const authHeader = req.headers.get('Authorization') || '';
  const token = authHeader.replace('Bearer ', '');

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const adminClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const { error } = await adminClient.auth.admin.deleteUser(userData.user.id);
  if (error) {
    return new Response('Erreur lors de la suppression', { status: 500 });
  }

  return new Response('Compte supprimé avec succès', { status: 200 });
});
