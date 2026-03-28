'use client'

import { useState, useEffect, useCallback } from 'react'
import { fmt } from '@/data/constants'

interface Lead {
  id: number
  nome: string
  cargo: string
  empresa: string
  email: string
  setor: string
  faturamento: string
  fluxo: string
  dor: string
  maturidade: string
  objetivo: string
  nps: number
  interesse: string
  potencial: number
  created_at: string
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(false)

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin', {
        headers: { 'x-admin-password': 'finscale2026' }
      })
      const data = await res.json()
      if (data.leads) setLeads(data.leads)
    } catch (e) {
      console.warn('Fetch error:', e)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!authenticated) return
    fetchLeads()
    const interval = setInterval(fetchLeads, 15000)
    return () => clearInterval(interval)
  }, [authenticated, fetchLeads])

  const handleLogin = () => {
    if (password === 'finscale2026') {
      setAuthenticated(true)
      setError(false)
    } else {
      setError(true)
      setPassword('')
    }
  }

  const exportCSV = () => {
    if (!leads.length) { alert('Nenhuma resposta ainda.'); return }
    const headers = ['#','Nome','Cargo','Empresa','E-mail','Setor','Faturamento','Fluxo','Dor','Maturidade','Objetivo','NPS','Interesse','Potencial(R$)','Horário']
    const rows = leads.map((r, i) =>
      [i+1, r.nome, r.cargo, r.empresa, r.email, r.setor, r.faturamento, r.fluxo, r.dor, r.maturidade, r.objetivo, r.nps||'', r.interesse, r.potencial, r.created_at]
        .map(v => `"${String(v || '').replace(/"/g, '""')}"`)
        .join(',')
    )
    const blob = new Blob(['\uFEFF' + [headers.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `finscale-leads-${new Date().toISOString().slice(0,10)}.csv`
    a.click()
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-surface-0 flex items-center justify-center p-5">
        <div className="glass glass-border rounded-lg p-7 w-full max-w-[320px] flex flex-col gap-4">
          <h3 className="font-extrabold text-[13px] text-white uppercase tracking-wider">Acesso restrito</h3>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="Senha"
            className="bg-transparent border-b border-border-3 text-white text-lg font-bold py-2.5 outline-none tracking-wider placeholder:text-gray-700 placeholder:text-sm placeholder:font-normal"
          />
          {error && <p className="text-[12px] text-red-400">Senha incorreta.</p>}
          <button onClick={handleLogin} className="w-full py-3.5 bg-gradient-to-r from-accent to-accent-dark text-white font-bold text-[11px] tracking-[0.2em] uppercase rounded-lg">
            Entrar →
          </button>
        </div>
      </div>
    )
  }

  const avgPot = leads.length ? leads.reduce((s, r) => s + (r.potencial || 0), 0) / leads.length : 0
  const npsArr = leads.map(r => r.nps || 0).filter(n => n > 0)
  const avgNps = npsArr.length ? (npsArr.reduce((a, b) => a + b, 0) / npsArr.length).toFixed(1) : '—'
  const altoInt = leads.filter(r => r.interesse === 'Alto interesse').length

  return (
    <div className="min-h-screen bg-surface-0 p-4">
      <div className="glass glass-border rounded-lg p-5 max-w-[1100px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start gap-3 mb-5 pb-4 border-b border-border-1 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-[10px] text-gray-500 tracking-wider uppercase mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
              Ao vivo
            </div>
            <h3 className="font-black text-sm text-white uppercase tracking-wide">Backoffice · Leads</h3>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={fetchLeads} className="px-3 py-2 border border-border-2 text-gray-500 text-[10px] tracking-wider uppercase rounded hover:border-accent/30 transition-colors">
              {loading ? '...' : '↻ Atualizar'}
            </button>
            <button onClick={exportCSV} className="px-4 py-2 bg-white text-black font-extrabold text-[10px] tracking-wider uppercase rounded">
              ↓ CSV
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
          {[
            { v: String(leads.length), l: 'Respostas' },
            { v: avgPot ? fmt(avgPot) : '—', l: 'Potencial médio' },
            { v: avgNps !== '—' ? avgNps + '★' : '—', l: 'NPS médio ★' },
            { v: String(altoInt), l: 'Alto interesse' },
          ].map(({ v, l }) => (
            <div key={l} className="bg-surface-2 border border-border-1 rounded p-3">
              <div className="font-black text-xl text-white tracking-tight">{v}</div>
              <div className="text-[9px] text-gray-500 uppercase tracking-wider mt-1 font-semibold">{l}</div>
            </div>
          ))}
        </div>

        {/* Lead Cards (mobile) */}
        <div className="flex flex-col gap-2 mb-4 lg:hidden">
          {leads.length === 0 && <div className="text-center py-8 text-gray-600 text-[13px]">Nenhuma resposta ainda.</div>}
          {leads.map((r, i) => {
            const intColor = r.interesse === 'Alto interesse' ? 'bg-emerald-500/10 text-emerald-400' :
              r.interesse === 'Interesse médio' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-white/5 text-gray-500'
            return (
              <div key={i} className="bg-surface-2 border border-border-1 rounded p-3 grid grid-cols-[1fr_auto] gap-2 items-start">
                <div>
                  <div className="font-bold text-[13px] text-white">{r.nome}</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">{r.cargo} · {r.empresa}</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">{r.email}</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="text-[9px] font-semibold tracking-wider uppercase px-2 py-0.5 border border-border-2 rounded-full text-gray-400">{r.setor}</span>
                    <span className="text-[9px] font-semibold tracking-wider uppercase px-2 py-0.5 border border-border-2 rounded-full text-gray-500">{r.faturamento}</span>
                    <span className="text-[9px] font-semibold tracking-wider uppercase px-2 py-0.5 border border-border-2 rounded-full text-gray-500">{r.dor}</span>
                  </div>
                  <div className="mt-1">
                    <span className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${intColor}`}>{r.interesse}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-[15px] text-white">{fmt(r.potencial)}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{r.nps ? r.nps + '★' : '—'}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Table (desktop) */}
        <div className="hidden lg:block overflow-x-auto mb-4">
          <table className="w-full border-collapse text-[11px]">
            <thead>
              <tr>
                {['#','Nome','Cargo','Empresa','E-mail','Setor','Fat.','Dor','Obj.','Mat.','NPS','Interesse','Potencial','Horário'].map(h => (
                  <th key={h} className="bg-surface-2 text-gray-500 text-[9px] tracking-wider uppercase p-2 text-left border-b border-border-1 whitespace-nowrap font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((r, i) => {
                const intColor = r.interesse === 'Alto interesse' ? '#00C864' : r.interesse === 'Interesse médio' ? '#C8A000' : '#606060'
                return (
                  <tr key={i}>
                    <td className="p-2 border-b border-border-1 text-gray-400">{i+1}</td>
                    <td className="p-2 border-b border-border-1 text-white font-bold">{r.nome}</td>
                    <td className="p-2 border-b border-border-1 text-gray-400">{r.cargo}</td>
                    <td className="p-2 border-b border-border-1 text-gray-400">{r.empresa}</td>
                    <td className="p-2 border-b border-border-1 text-gray-400">{r.email}</td>
                    <td className="p-2 border-b border-border-1 text-gray-400">{r.setor}</td>
                    <td className="p-2 border-b border-border-1 text-gray-400">{r.faturamento}</td>
                    <td className="p-2 border-b border-border-1 text-gray-400">{r.dor}</td>
                    <td className="p-2 border-b border-border-1 text-gray-400">{r.objetivo}</td>
                    <td className="p-2 border-b border-border-1 text-gray-400">{r.maturidade}</td>
                    <td className="p-2 border-b border-border-1 text-gray-400">{r.nps ? r.nps+'★' : '—'}</td>
                    <td className="p-2 border-b border-border-1"><span style={{ color: intColor }} className="font-bold text-[10px]">{r.interesse}</span></td>
                    <td className="p-2 border-b border-border-1 text-white font-bold">{fmt(r.potencial)}</td>
                    <td className="p-2 border-b border-border-1 text-gray-600 text-[10px]">{new Date(r.created_at).toLocaleString('pt-BR')}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {leads.length === 0 && <div className="text-center py-8 text-gray-600 text-[13px]">Nenhuma resposta ainda.</div>}
        </div>
      </div>
    </div>
  )
}
