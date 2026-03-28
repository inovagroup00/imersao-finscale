CREATE TABLE IF NOT EXISTS public.imersao_leads (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  cargo TEXT,
  empresa TEXT,
  email TEXT,
  setor TEXT,
  faturamento TEXT,
  fluxo TEXT,
  dor TEXT,
  maturidade TEXT,
  objetivo TEXT,
  nps INTEGER DEFAULT 0,
  interesse TEXT,
  potencial INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.imersao_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert_imersao_leads" ON public.imersao_leads
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "service_all_imersao_leads" ON public.imersao_leads
  FOR ALL TO service_role USING (true) WITH CHECK (true);
