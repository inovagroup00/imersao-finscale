'use client'

import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import {
  SL, DL, OL, ML, SLBL, INT_LBL, OPS, CASES, DIAG, JOGO,
  fmt, calcPot, calcInteresse
} from '@/data/constants'

type Screen = 's0' | 's1' | 's2' | 's3' | 's4' | 's5' | 's6' | 's7' | 'sres'

const SCREEN_NUM: Record<string, number> = {
  s1: 1, s2: 2, s3: 3, s4: 4, s5: 5, s6: 6, s7: 7
}

export default function DiagnosticoApp() {
  const [screen, setScreen] = useState<Screen>('s0')
  const [nome, setNome] = useState('')
  const [cargo, setCargo] = useState('')
  const [empresa, setEmpresa] = useState('')
  const [email, setEmail] = useState('')
  const [setor, setSetor] = useState('')
  const [fat, setFat] = useState(0)
  const [fatLbl, setFatLbl] = useState('')
  const [fluxo, setFluxo] = useState<string[]>([])
  const [dor, setDor] = useState('')
  const [mat, setMat] = useState('')
  const [obj, setObj] = useState('')
  const [stars, setStars] = useState(0)
  const [resultado, setResultado] = useState<{ pot: number; int: number } | null>(null)
  const [showAnalise, setShowAnalise] = useState(false)

  const currentStep = SCREEN_NUM[screen] || 0

  const go = useCallback((id: Screen) => {
    setScreen(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const toggleFluxo = (v: string) => {
    setFluxo(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])
  }

  const handleStar = (n: number) => {
    setStars(n)
  }

  const gerar = async () => {
    const pot = calcPot(fat, dor, obj, setor, mat)
    const int = calcInteresse(obj, fatLbl, mat, dor)
    setResultado({ pot, int })
    go('sres')

    // Show analysis after a brief delay
    setTimeout(() => setShowAnalise(true), 1500)

    // Save to Supabase
    try {
      await supabase.from('imersao_leads').insert({
        nome, cargo, empresa, email,
        setor: SL[setor] || setor,
        faturamento: fatLbl,
        fluxo: fluxo.join('+'),
        dor: DL[dor] || dor,
        maturidade: ML[mat] || mat,
        objetivo: OL[obj] || obj,
        nps: stars,
        interesse: INT_LBL[int],
        potencial: pot,
      })
    } catch (e) {
      console.warn('Supabase save error:', e)
    }
  }

  const reiniciar = () => {
    setNome(''); setCargo(''); setEmpresa(''); setEmail('')
    setSetor(''); setFat(0); setFatLbl(''); setFluxo([])
    setDor(''); setMat(''); setObj(''); setStars(0)
    setResultado(null); setShowAnalise(false)
    go('s0')
  }

  const s1Valid = nome.trim() && cargo.trim() && empresa.trim() && email.trim()
  const s2Valid = setor && fat > 0

  const ops = OPS[setor] || OPS['servicos']
  const cases = CASES[setor] || CASES['servicos']
  const diagText = DIAG[setor] || DIAG['servicos']
  const jogoText = JOGO[setor] || JOGO['servicos']

  return (
    <div className="min-h-screen bg-surface-0">
      {/* HEADER */}
      <header className="sticky top-0 z-50 glass border-b border-border-1 px-5 py-3 flex items-center justify-between">
        <div className="text-white font-bold text-lg tracking-tight">Finscale</div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {[1,2,3,4,5,6,7].map(i => (
              <div key={i} className={`w-3 h-0.5 rounded-full transition-all duration-300 ${
                i < currentStep ? 'bg-accent/40' : i === currentStep ? 'bg-accent' : 'bg-border-2'
              }`} />
            ))}
          </div>
          <span className="text-[10px] text-gray-500 tracking-[0.16em] uppercase font-semibold">
            {currentStep > 0 && currentStep <= 7 ? `0${currentStep}/07` : currentStep > 7 ? '✓' : '—'}
          </span>
        </div>
      </header>

      {/* SCREENS */}
      <div className="max-w-[480px] mx-auto w-full px-5">

        {/* S0 - INTRO */}
        {screen === 's0' && (
          <div className="min-h-[calc(100vh-53px)] flex flex-col justify-center animate-fade-up py-9">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-4">
              Diagnóstico · Embedded Finance
            </span>
            <h1 className="font-black text-[clamp(32px,9vw,52px)] leading-[0.97] text-white tracking-tight uppercase mb-5">
              Seu negócio<br />tem dinheiro<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-light to-accent">escondido</span>
              <br />nele.
            </h1>
            <div className="w-6 h-px bg-border-3 mb-5" />
            <p className="text-base text-gray-400 leading-relaxed max-w-[400px] mb-9">
              7 perguntas. Resultado imediato com análise personalizada, roadmap e cases reais do seu setor.
            </p>
            <button onClick={() => go('s1')} className="w-full py-4 px-8 bg-gradient-to-r from-accent to-accent-dark text-white font-bold text-[11px] tracking-[0.2em] uppercase rounded-lg hover:opacity-90 transition-opacity">
              Iniciar diagnóstico →
            </button>
          </div>
        )}

        {/* S1 - INFO PESSOAL */}
        {screen === 's1' && (
          <div className="min-h-[calc(100vh-53px)] flex flex-col justify-center animate-fade-up py-9">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">01 / 07</span>
            <h2 className="font-extrabold text-[clamp(20px,5.5vw,30px)] leading-tight text-white tracking-tight uppercase mb-2">
              Quem é você<br />e o que opera?
            </h2>
            <p className="text-[15px] text-gray-400 mb-6 leading-relaxed">Só para personalizar seu resultado.</p>

            <div className="space-y-3 mb-4">
              {[
                { val: nome, set: setNome, ph: 'Seu nome completo', type: 'text' },
                { val: cargo, set: setCargo, ph: 'Cargo / função', type: 'text' },
                { val: empresa, set: setEmpresa, ph: 'Nome da empresa', type: 'text' },
                { val: email, set: setEmail, ph: 'Seu melhor e-mail', type: 'email' },
              ].map(({ val, set, ph, type }) => (
                <div key={ph} className="border-b border-border-2 focus-within:border-accent/50 transition-colors">
                  <input
                    type={type}
                    value={val}
                    onChange={e => set(e.target.value)}
                    placeholder={ph}
                    className="w-full bg-transparent text-white text-[17px] py-3.5 outline-none placeholder:text-gray-700"
                  />
                </div>
              ))}
            </div>
            <p className="text-[13px] text-gray-500 mb-6">Confidencial — não compartilhamos seus dados.</p>
            <button
              disabled={!s1Valid}
              onClick={() => go('s2')}
              className="w-full py-4 px-8 bg-gradient-to-r from-accent to-accent-dark text-white font-bold text-[11px] tracking-[0.2em] uppercase rounded-lg hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Próxima →
            </button>
          </div>
        )}

        {/* S2 - SETOR E FATURAMENTO */}
        {screen === 's2' && (
          <div className="min-h-[calc(100vh-53px)] flex flex-col justify-center animate-fade-up py-9">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">02 / 07</span>
            <h2 className="font-extrabold text-[clamp(20px,5.5vw,30px)] leading-tight text-white tracking-tight uppercase mb-2">
              Setor e<br />faturamento
            </h2>
            <p className="text-[15px] text-gray-400 mb-6 leading-relaxed">Setor e porte do negócio.</p>

            <div className="flex flex-col gap-1.5 mb-6">
              {[
                { k: 'varejo', l: 'A', t: 'Varejo / Moda / Alimentação / Franquias' },
                { k: 'construcao', l: 'B', t: 'Construção / Incorporação / Imóveis' },
                { k: 'saude', l: 'C', t: 'Saúde / Equipamentos / Farmácia' },
                { k: 'educacao', l: 'D', t: 'Educação / Faculdades / Cursos' },
                { k: 'agro', l: 'E', t: 'Agronegócio / Distribuição / Indústria' },
                { k: 'servicos', l: 'F', t: 'Serviços / Tecnologia / Mobilidade' },
              ].map(({ k, l, t }) => (
                <OptionBtn key={k} selected={setor === k} label={l} text={t} onClick={() => setSetor(k)} />
              ))}
            </div>

            <div className="flex flex-col gap-1.5 mb-6">
              {[
                { k: '15-50', n: 32500000, l: '1', t: 'R$ 15 mi – R$ 50 mi / ano' },
                { k: '50-150', n: 100000000, l: '2', t: 'R$ 50 mi – R$ 150 mi / ano' },
                { k: '150-500', n: 325000000, l: '3', t: 'R$ 150 mi – R$ 500 mi / ano' },
              ].map(({ k, n, l, t }) => (
                <OptionBtn key={k} selected={fatLbl === k} label={l} text={t} onClick={() => { setFat(n); setFatLbl(k) }} />
              ))}
            </div>

            <button
              disabled={!s2Valid}
              onClick={() => go('s3')}
              className="w-full py-4 px-8 bg-gradient-to-r from-accent to-accent-dark text-white font-bold text-[11px] tracking-[0.2em] uppercase rounded-lg hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Próxima →
            </button>
          </div>
        )}

        {/* S3 - FLUXO DE PAGAMENTO */}
        {screen === 's3' && (
          <div className="min-h-[calc(100vh-53px)] flex flex-col justify-center animate-fade-up py-9">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">03 / 07</span>
            <h2 className="font-extrabold text-[clamp(20px,5.5vw,30px)] leading-tight text-white tracking-tight uppercase mb-2">
              Como o dinheiro<br />flui hoje?
            </h2>
            <p className="text-[15px] text-gray-400 mb-6 leading-relaxed">Selecione todos que se aplicam.</p>

            <div className="flex flex-col gap-1.5 mb-6">
              {[
                { k: 'cartao', l: 'A', t: 'Cartão via adquirente', d: 'Cielo, Stone, Rede…' },
                { k: 'boleto', l: 'B', t: 'Boleto bancário', d: '' },
                { k: 'pix', l: 'C', t: 'Pix', d: '' },
                { k: 'crediario', l: 'D', t: 'Crediário ou parcelamento próprio', d: '' },
                { k: 'financeira', l: 'E', t: 'Financeira ou banco parceiro', d: 'CDC, consórcio, crédito via terceiros' },
                { k: 'b2b', l: 'F', t: 'Faturamento a prazo B2B', d: '' },
              ].map(({ k, l, t, d }) => (
                <OptionBtn key={k} selected={fluxo.includes(k)} label={l} text={t} desc={d} onClick={() => toggleFluxo(k)} />
              ))}
            </div>

            <button
              disabled={fluxo.length === 0}
              onClick={() => go('s4')}
              className="w-full py-4 px-8 bg-gradient-to-r from-accent to-accent-dark text-white font-bold text-[11px] tracking-[0.2em] uppercase rounded-lg hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Próxima →
            </button>
          </div>
        )}

        {/* S4 - DOR */}
        {screen === 's4' && (
          <div className="min-h-[calc(100vh-53px)] flex flex-col justify-center animate-fade-up py-9">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">04 / 07</span>
            <h2 className="font-extrabold text-[clamp(20px,5.5vw,30px)] leading-tight text-white tracking-tight uppercase mb-2">
              Maior dor<br />financeira hoje?
            </h2>
            <p className="text-[15px] text-gray-400 mb-6 leading-relaxed">Escolha a que mais incomoda.</p>

            <div className="flex flex-col gap-1.5 mb-6">
              {[
                { k: 'custo', l: 'A', t: 'Custo alto com intermediários', d: 'MDR, IOF, spread capturáveis internamente' },
                { k: 'inadimplencia', l: 'B', t: 'Inadimplência e risco de crédito', d: 'Parceiros ruins, perda de margem' },
                { k: 'caixa', l: 'C', t: 'Capital de giro e caixa', d: 'Dificuldade em antecipar recebíveis' },
                { k: 'retencao', l: 'D', t: 'Baixa recorrência e retenção', d: 'Cliente compra uma vez — falta vínculo' },
                { k: 'receita', l: 'E', t: 'Falta de novas receitas', d: 'Crescer sem aumentar custo proporcionalmente' },
              ].map(({ k, l, t, d }) => (
                <OptionBtn key={k} selected={dor === k} label={l} text={t} desc={d} onClick={() => setDor(k)} />
              ))}
            </div>

            <button
              disabled={!dor}
              onClick={() => go('s5')}
              className="w-full py-4 px-8 bg-gradient-to-r from-accent to-accent-dark text-white font-bold text-[11px] tracking-[0.2em] uppercase rounded-lg hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Próxima →
            </button>
          </div>
        )}

        {/* S5 - MATURIDADE */}
        {screen === 's5' && (
          <div className="min-h-[calc(100vh-53px)] flex flex-col justify-center animate-fade-up py-9">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">05 / 07</span>
            <h2 className="font-extrabold text-[clamp(20px,5.5vw,30px)] leading-tight text-white tracking-tight uppercase mb-2">
              Maturidade<br />digital
            </h2>
            <p className="text-[15px] text-gray-400 mb-6 leading-relaxed">Honesto — define qual caminho faz sentido.</p>

            <div className="flex flex-col gap-1.5 mb-6">
              {[
                { k: 'basico', l: 'A', t: 'Básico', d: 'Processos manuais, ERP simples ou planilhas' },
                { k: 'medio', l: 'B', t: 'Médio', d: 'ERP + CRM, dados de clientes disponíveis' },
                { k: 'avancado', l: 'C', t: 'Avançado', d: 'APIs, dados comportamentais, time de tech' },
              ].map(({ k, l, t, d }) => (
                <OptionBtn key={k} selected={mat === k} label={l} text={t} desc={d} onClick={() => setMat(k)} />
              ))}
            </div>

            <button
              disabled={!mat}
              onClick={() => go('s6')}
              className="w-full py-4 px-8 bg-gradient-to-r from-accent to-accent-dark text-white font-bold text-[11px] tracking-[0.2em] uppercase rounded-lg hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Próxima →
            </button>
          </div>
        )}

        {/* S6 - OBJETIVO */}
        {screen === 's6' && (
          <div className="min-h-[calc(100vh-53px)] flex flex-col justify-center animate-fade-up py-9">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">06 / 07</span>
            <h2 className="font-extrabold text-[clamp(20px,5.5vw,30px)] leading-tight text-white tracking-tight uppercase mb-2">
              O que construir<br />nos próximos<br />12 meses?
            </h2>
            <p className="text-[15px] text-gray-400 mb-6 leading-relaxed">Define a prioridade das recomendações.</p>

            <div className="flex flex-col gap-1.5 mb-6">
              {[
                { k: 'reduzir', l: 'A', t: 'Reduzir custo com intermediários' },
                { k: 'credito', l: 'B', t: 'Lançar ou escalar crédito para clientes' },
                { k: 'pagamentos', l: 'C', t: 'Conta digital e pagamentos próprios' },
                { k: 'plataforma', l: 'D', t: 'Virar plataforma — escalar para terceiros' },
                { k: 'explorar', l: 'E', t: 'Ainda explorando as opções' },
              ].map(({ k, l, t }) => (
                <OptionBtn key={k} selected={obj === k} label={l} text={t} onClick={() => setObj(k)} />
              ))}
            </div>

            <button
              disabled={!obj}
              onClick={() => go('s7')}
              className="w-full py-4 px-8 bg-gradient-to-r from-accent to-accent-dark text-white font-bold text-[11px] tracking-[0.2em] uppercase rounded-lg hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Próxima →
            </button>
          </div>
        )}

        {/* S7 - NPS */}
        {screen === 's7' && (
          <div className="min-h-[calc(100vh-53px)] flex flex-col justify-center animate-fade-up py-9">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">07 / 07</span>
            <h2 className="font-extrabold text-[clamp(20px,5.5vw,30px)] leading-tight text-white tracking-tight uppercase mb-2">
              Última pergunta
            </h2>
            <p className="text-[15px] text-gray-400 mb-6 leading-relaxed">
              Pelo que viu até agora, o quanto você recomendaria um evento da Finscale?
            </p>

            <div className="flex gap-3 mb-3">
              {[1,2,3,4,5].map(n => (
                <span
                  key={n}
                  onClick={() => handleStar(n)}
                  className={`text-4xl cursor-pointer transition-all duration-200 ${
                    n <= stars ? 'opacity-100 text-yellow-400 scale-110' : 'opacity-25 text-white'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <p className="text-[15px] text-gray-400 min-h-[20px] mb-7">{SLBL[stars]}</p>

            <button
              disabled={!stars}
              onClick={gerar}
              className="w-full py-4 px-8 bg-gradient-to-r from-accent to-accent-dark text-white font-bold text-[11px] tracking-[0.2em] uppercase rounded-lg hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Ver meu diagnóstico →
            </button>
          </div>
        )}

        {/* RESULTADO */}
        {screen === 'sres' && resultado && (
          <div className="min-h-[calc(100vh-53px)] flex flex-col animate-fade-up py-9">

            {/* Header */}
            <div className="pb-6 mb-6 border-b border-border-1">
              <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-gray-500 block mb-2">
                Diagnóstico Finscale · Embedded Finance
              </span>
              <p className="text-[13px] text-gray-400 uppercase tracking-wider font-medium">
                {nome} · {empresa} · {SL[setor] || setor}
              </p>
            </div>

            {/* Interest Badge */}
            <div className="mb-4">
              <span className={`inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.14em] uppercase px-3 py-1.5 rounded-full ${
                resultado.int === 3 ? 'bg-emerald-500/10 text-emerald-400' :
                resultado.int === 2 ? 'bg-yellow-500/10 text-yellow-500' :
                'bg-white/5 text-gray-500'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  resultado.int === 3 ? 'bg-emerald-400' :
                  resultado.int === 2 ? 'bg-yellow-500' :
                  'bg-gray-500'
                }`} />
                {INT_LBL[resultado.int]}
              </span>
            </div>

            {/* Diagnóstico do negócio */}
            <div className="mb-7">
              <div className="text-[11px] font-bold tracking-[0.18em] uppercase text-gray-500 mb-3 pb-3 border-b border-border-1">
                Diagnóstico do seu negócio
              </div>

              {!showAnalise ? (
                <div className="flex items-center gap-3 py-4 text-[13px] text-gray-500">
                  <div className="flex gap-1">
                    <span className="w-1 h-1 rounded-full bg-gray-500 animate-pulse" />
                    <span className="w-1 h-1 rounded-full bg-gray-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <span className="w-1 h-1 rounded-full bg-gray-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                  Analisando o seu perfil...
                </div>
              ) : (
                <div className="glass glass-border rounded-lg p-5 space-y-4">
                  <div className="text-[15px] text-gray-200 leading-[1.8]">{diagText}</div>
                  <div className="bg-surface-2 p-4 rounded-lg border border-border-1">
                    <div className="text-[15px] text-gray-200 leading-[1.8]">{jogoText}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Oportunidades */}
            <div className="mb-7">
              <div className="text-[11px] font-bold tracking-[0.18em] uppercase text-gray-500 mb-3 pb-3 border-b border-border-1">
                Oportunidades de receita identificadas
              </div>
              <div className="space-y-0">
                {ops.map((o, i) => (
                  <div key={i} className="flex gap-3 py-4 border-b border-border-1 last:border-b-0">
                    <span className={`font-black text-[11px] tracking-wider shrink-0 min-w-[24px] pt-0.5 ${
                      i === 0 ? 'text-white' : i === 1 ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      0{i + 1}
                    </span>
                    <div>
                      <div className={`font-bold text-[15px] uppercase tracking-wide mb-1 ${
                        i === 0 ? 'text-white' : i === 1 ? 'text-gray-200' : 'text-gray-400'
                      }`}>
                        {o.n}
                      </div>
                      <div className="text-[14px] text-gray-400 leading-relaxed">{o.w}</div>
                      <span className="inline-block mt-2 text-[11px] font-bold tracking-wider uppercase px-2 py-1 border border-border-2 rounded text-gray-500">
                        {o.p}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cases */}
            <div className="mb-7">
              <div className="text-[11px] font-bold tracking-[0.18em] uppercase text-gray-500 mb-3 pb-3 border-b border-border-1">
                Empresas do seu setor que já fizeram — e o resultado
              </div>
              <div className="space-y-0">
                {cases.map((c, i) => (
                  <div key={i} className="py-4 border-b border-border-1 last:border-b-0">
                    <div className="font-bold text-[14px] uppercase tracking-wider text-white mb-1">{c.co}</div>
                    <div className="text-[14px] text-gray-200 leading-relaxed mb-1">{c.res}</div>
                    <div className="text-[13px] text-gray-500 italic">
                      Fonte: <a href={c.url} target="_blank" rel="noopener" className="text-gray-500 underline decoration-border-2 hover:text-accent-light transition-colors">{c.src}</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="glass glass-border rounded-lg p-6 mb-5">
              <h3 className="font-extrabold text-base text-white uppercase tracking-tight mb-2">
                Quer entender como isso se aplica ao seu negócio?
              </h3>
              <p className="text-[15px] text-gray-400 leading-relaxed mb-5">
                A Finscale trabalha com empresas da economia real para estruturar, lançar e escalar produtos financeiros. Cada caminho é único — e começa com uma conversa.
              </p>
              <a
                href={`https://wa.me/5511936203969?text=${encodeURIComponent('Olá! Acabei de fazer o diagnóstico de embedded finance da Finscale e quero conversar sobre as oportunidades para o meu negócio.')}`}
                target="_blank"
                rel="noopener"
                className="block"
              >
                <button className="w-full py-4 px-8 bg-gradient-to-r from-accent to-accent-dark text-white font-bold text-[11px] tracking-[0.2em] uppercase rounded-lg hover:opacity-90 transition-opacity">
                  Conversar em particular com a Finscale sobre o meu negócio →
                </button>
              </a>
            </div>

            <button
              onClick={reiniciar}
              className="w-full mt-2 py-3 px-5 bg-transparent border border-border-3 text-gray-500 font-medium text-[11px] tracking-wider uppercase rounded-lg hover:border-accent/30 hover:text-gray-300 transition-all"
            >
              ↩ Refazer
            </button>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="border-t border-border-1 py-5 text-center text-[10px] text-gray-700 tracking-wider uppercase">
        Finscale © 2026
      </footer>
    </div>
  )
}

function OptionBtn({ selected, label, text, desc, onClick }: {
  selected: boolean; label: string; text: string; desc?: string; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex items-start gap-3 px-4 py-3.5 rounded-lg border transition-all duration-200 ${
        selected
          ? 'border-accent/60 bg-accent/10'
          : 'border-border-1 bg-transparent hover:border-border-2'
      }`}
    >
      <span className={`w-[22px] h-[22px] shrink-0 flex items-center justify-center rounded text-[10px] font-bold mt-0.5 transition-all ${
        selected
          ? 'bg-accent text-white border-accent'
          : 'border border-border-3 text-gray-500'
      }`}>
        {selected ? '✓' : label}
      </span>
      <div>
        <div className={`text-[15px] font-medium leading-snug ${selected ? 'text-white' : 'text-gray-200'}`}>
          {text}
        </div>
        {desc && <div className="text-[13px] text-gray-500 mt-1">{desc}</div>}
      </div>
    </button>
  )
}
