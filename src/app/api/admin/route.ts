import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const password = req.headers.get('x-admin-password')
  if (password !== 'finscale2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase
    .from('imersao_leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ leads: data })
}
