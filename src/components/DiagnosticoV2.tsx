'use client'

import { useState, useCallback } from 'react'
import { getSupabase } from '@/lib/supabase'
import {
  SL, DL, OL, ML, SLBL, INT_LBL, OPS, CASES, DIAG, JOGO,
  fmt, calcPot, calcInteresse
} from '@/data/constants'

type Screen = 's0' | 's1' | 's2' | 's3' | 's4' | 's5' | 's6' | 's7' | 'sres'

const SCREEN_NUM: Record<string, number> = {
  s1: 1, s2: 2, s3: 3, s4: 4, s5: 5, s6: 6, s7: 7
}

export default function DiagnosticoV2() {
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

    setTimeout(() => setShowAnalise(true), 1500)

    try {
      await getSupabase().from('imersao_leads').insert({
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
    <div className="min-h-screen bg-gray-50 text-gray-900" style={{ colorScheme: 'light' }}>
      {/* Override dark autofill from globals */}
      <style>{`
        .v2-input:-webkit-autofill,
        .v2-input:-webkit-autofill:hover,
        .v2-input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px #fff inset !important;
          -webkit-text-fill-color: #111827 !important;
          caret-color: #111827;
        }
      `}</style>
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between">
        <div className="text-gray-900 font-bold text-lg tracking-tight">Finscale</div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            {[1,2,3,4,5,6,7].map(i => (
              <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i < currentStep ? 'bg-gray-900' : i === currentStep ? 'bg-gray-900' : 'bg-gray-200'
              }`} />
            ))}
          </div>
          <span className="text-xs text-gray-400 font-medium">
            {currentStep > 0 && currentStep <= 7 ? `${currentStep}/7` : currentStep > 7 ? '\u2713' : ''}
          </span>
        </div>
      </header>

      {/* SCREENS */}
      <div className="max-w-xl mx-auto w-full px-4">

        {/* S0 - INTRO */}
        {screen === 's0' && (
          <div className="min-h-[calc(100vh-53px)] flex flex-col items-center justify-center py-12">
            <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-10">
              <span className="text-sm font-medium text-gray-400 mb-4 block">
                Diagnóstico · Embedded Finance
              </span>
              <h1 className="font-bold text-[clamp(28px,7vw,44px)] leading-[1.05] text-gray-900 tracking-tight mb-5">
                Seu negócio<br />tem dinheiro<br />
                <span className="underline decoration-gray-300 decoration-2 underline-offset-4">escondido</span>
                <br />nele.
              </h1>
              <div className="w-8 h-px bg-gray-200 mb-5" />
              <p className="text-sm text-gray-500 leading-relaxed max-w-[400px] mb-8">
                7 perguntas. Resultado imediato com análise personalizada, roadmap e cases reais do seu setor.
              </p>
              <button onClick={() => go('s1')} className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors">
                Iniciar diagnóstico →
              </button>
            </div>
          </div>
        )}

        {/* S1 - INFO PESSOAL */}
        {screen === 's1' && (
          <div className="min-h-[calc(100vh-53px)] flex flex-col justify-center py-8 md:py-12">
            <span className="text-sm font-medium text-gray-400 mb-3">01 / 07</span>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">
              Quem é você<br />e o que opera?
            </h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">Só para personalizar seu resultado.</p>

            <div className="space-y-3 mb-4">
              {[
                { val: nome, set: setNome, ph: 'Seu nome completo', type: 'text' },
                { val: cargo, set: setCargo, ph: 'Cargo / função', type: 'text' },
                { val: empresa, set: setEmpresa, ph: 'Nome da empresa', type: 'text' },
                { val: email, set: setEmail, ph: 'Seu melhor e-mail', type: 'email' },
              ].map(({ val, set, ph, type }) => (
                <input
                  key={ph}
                  type={type}
                  value={val}
                  onChange={e => set(e.target.value)}
                  placeholder={ph}
                  className="v2-input w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition placeholder:text-gray-400"
                />
              ))}
            </div>
            <p className="text-xs text-gray-400 mb-6">Confidencial — não compartilhamos seus dados.</p>
            <button
              disabled={!s1Valid}
              onClick={() => go('s2')}
              className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próxima →
            </button>
          </div>
        )}

        {/* S2 - SETOR E FATURAMENTO */}
        {screen === 's2' && (
          <div className="min-h-[calc(100vh-53px)] flex flex-col justify-center py-8 md:py-12">
            <span className="text-sm font-medium text-gray-400 mb-3">02 / 07</span>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">
              Setor e<br />faturamento
            </h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">Setor e porte do negócio.</p>

            <div className="flex flex-col gap-2 mb-6">
              {[
                { k: 'varejo', l: 'A', t: 'Varejo / Moda / Alimentação / Franquias' },
                { k: 'construcao', l: 'B', t: 'Construção / Incorporação / Imóveis' },
                { k: 'saude', l: 'C', t: 'Saúde / Equipamentos / Farmácia' },
                { k: 'educacao', l: 'D', t: 'Educação / Faculdades / Cursos' },
                { k: 'agro', l: 'E', t: 'Agronegócio / Distribuição / Indústria' },
                { k: 'servicos', l: 'F', t: 'Serviços / Tecnologia / Mobilidade' },
              ].map(({ k, l, t }) => (
                <V2OptionBtn key={k} selected={setor === k} label={l} text={t} onClick={() => setSetor(k)} />
              ))}
            </div>

            <div className="flex flex-col gap-2 mb-6">
              {[
                { k: '15-50', n: 32500000, l: '1', t: 'R$ 15 mi – R$ 50 mi / ano' },
                { k: '50-150', n: 100000000, l: '2', t: 'R$ 50 mi – R$ 150 mi / ano' },
                { k: '150-500', n: 325000000, l: '3', t: 'R$ 150 mi – R$ 500 mi / ano' },
              ].map(({ k, n, l, t }) => (
                <V2OptionBtn key={k} selected={fatLbl === k} label={l} text={t} onClick={() => { setFat(n); setFatLbl(k) }} />
              ))}
            </div>

            <button
              disabled={!s2Valid}
              onClick={() => go('s3')}
              className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próxima →
            </button>
          </div>
        )}

        {/* S3 - FLUXO DE PAGAMENTO */}
        {screen === 's3' && (
          <div className="min-h-[calc(100vh-53px)] flex flex-col justify-center py-8 md:py-12">
            <span className="text-sm font-medium text-gray-400 mb-3">03 / 07</span>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">
              Como o dinheiro<br />flui hoje?
            </h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">Selecione todos que se aplicam.</p>

            <div className="flex flex-col gap-2 mb-6">
              {[
                { k: 'cartao', l: 'A', t: 'Cartão via adquirente', d: 'Cielo, Stone, Rede…' },
                { k: 'boleto', l: 'B', t: 'Boleto bancário', d: '' },
                { k: 'pix', l: 'C', t: 'Pix', d: '' },
                { k: 'crediario', l: 'D', t: 'Crediário ou parcelamento próprio', d: '' },
                { k: 'financeira', l: 'E', t: 'Financeira ou banco parceiro', d: 'CDC, consórcio, crédito via terceiros' },
                { k: 'b2b', l: 'F', t: 'Faturamento a prazo B2B', d: '' },
              ].map(({ k, l, t, d }) => (
                <V2OptionBtn key={k} selected={fluxo.includes(k)} label={l} text={t} desc={d} onClick={() => toggleFluxo(k)} />
              ))}
            </div>

            <button
              disabled={fluxo.length === 0}
              onClick={() => go('s4')}
              className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próxima →
            </button>
          </div>
        )}

        {/* S4 - DOR */}
        {screen === 's4' && (
          <div className="min-h-[calc(100vh-53px)] flex flex-col justify-center py-8 md:py-12">
            <span className="text-sm font-medium text-gray-400 mb-3">04 / 07</span>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">
              Maior dor<br />financeira hoje?
            </h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">Escolha a que mais incomoda.</p>

            <div className="flex flex-col gap-2 mb-6">
              {[
                { k: 'custo', l: 'A', t: 'Custo alto com intermediários', d: 'MDR, IOF, spread capturáveis internamente' },
                { k: 'inadimplencia', l: 'B', t: 'Inadimplência e risco de crédito', d: 'Parceiros ruins, perda de margem' },
                { k: 'caixa', l: 'C', t: 'Capital de giro e caixa', d: 'Dificuldade em antecipar recebíveis' },
                { k: 'retencao', l: 'D', t: 'Baixa recorrência e retenção', d: 'Cliente compra uma vez — falta vínculo' },
                { k: 'receita', l: 'E', t: 'Falta de novas receitas', d: 'Crescer sem aumentar custo proporcionalmente' },
              ].map(({ k, l, t, d }) => (
                <V2OptionBtn key={k} selected={dor === k} label={l} text={t} desc={d} onClick={() => setDor(k)} />
              ))}
            </div>

            <button
              disabled={!dor}
              onClick={() => go('s5')}
              className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próxima →
            </button>
          </div>
        )}

        {/* S5 - MATURIDADE */}
        {screen === 's5' && (
          <div className="min-h-[calc(100vh-53px)] flex flex-col justify-center py-8 md:py-12">
            <span className="text-sm font-medium text-gray-400 mb-3">05 / 07</span>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">
              Maturidade<br />digital
            </h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">Honesto — define qual caminho faz sentido.</p>

            <div className="flex flex-col gap-2 mb-6">
              {[
                { k: 'basico', l: 'A', t: 'Básico', d: 'Processos manuais, ERP simples ou planilhas' },
                { k: 'medio', l: 'B', t: 'Médio', d: 'ERP + CRM, dados de clientes disponíveis' },
                { k: 'avancado', l: 'C', t: 'Avançado', d: 'APIs, dados comportamentais, time de tech' },
              ].map(({ k, l, t, d }) => (
                <V2OptionBtn key={k} selected={mat === k} label={l} text={t} desc={d} onClick={() => setMat(k)} />
              ))}
            </div>

            <button
              disabled={!mat}
              onClick={() => go('s6')}
              className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próxima →
            </button>
          </div>
        )}

        {/* S6 - OBJETIVO */}
        {screen === 's6' && (
          <div className="min-h-[calc(100vh-53px)] flex flex-col justify-center py-8 md:py-12">
            <span className="text-sm font-medium text-gray-400 mb-3">06 / 07</span>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">
              O que construir<br />nos próximos<br />12 meses?
            </h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">Define a prioridade das recomendações.</p>

            <div className="flex flex-col gap-2 mb-6">
              {[
                { k: 'reduzir', l: 'A', t: 'Reduzir custo com intermediários' },
                { k: 'credito', l: 'B', t: 'Lançar ou escalar crédito para clientes' },
                { k: 'pagamentos', l: 'C', t: 'Conta digital e pagamentos próprios' },
                { k: 'plataforma', l: 'D', t: 'Virar plataforma — escalar para terceiros' },
                { k: 'explorar', l: 'E', t: 'Ainda explorando as opções' },
              ].map(({ k, l, t }) => (
                <V2OptionBtn key={k} selected={obj === k} label={l} text={t} onClick={() => setObj(k)} />
              ))}
            </div>

            <button
              disabled={!obj}
              onClick={() => go('s7')}
              className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próxima →
            </button>
          </div>
        )}

        {/* S7 - NPS */}
        {screen === 's7' && (
          <div className="min-h-[calc(100vh-53px)] flex flex-col justify-center py-8 md:py-12">
            <span className="text-sm font-medium text-gray-400 mb-3">07 / 07</span>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">
              Última pergunta
            </h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Pelo que viu até agora, o quanto você recomendaria um evento da Finscale?
            </p>

            <div className="flex gap-3 mb-3">
              {[1,2,3,4,5].map(n => (
                <span
                  key={n}
                  onClick={() => handleStar(n)}
                  className={`text-4xl cursor-pointer transition-all duration-200 ${
                    n <= stars ? 'text-yellow-400 scale-110' : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-500 min-h-[20px] mb-7">{SLBL[stars]}</p>

            <button
              disabled={!stars}
              onClick={gerar}
              className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Ver meu diagnóstico →
            </button>
          </div>
        )}

        {/* RESULTADO */}
        {screen === 'sres' && resultado && (
          <div className="min-h-[calc(100vh-53px)] flex flex-col py-8 md:py-12">

            {/* Header */}
            <div className="pb-5 mb-6 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-400 block mb-1">
                Diagnóstico Finscale · Embedded Finance
              </span>
              <p className="text-sm text-gray-500 font-medium">
                {nome} · {empresa} · {SL[setor] || setor}
              </p>
            </div>

            {/* Interest Badge */}
            <div className="mb-5">
              <span className={`inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border ${
                resultado.int === 3 ? 'text-green-700 bg-green-50 border-green-200' :
                resultado.int === 2 ? 'text-yellow-700 bg-yellow-50 border-yellow-200' :
                'text-gray-500 bg-gray-50 border-gray-200'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  resultado.int === 3 ? 'bg-green-500' :
                  resultado.int === 2 ? 'bg-yellow-500' :
                  'bg-gray-400'
                }`} />
                {INT_LBL[resultado.int]}
              </span>
            </div>

            {/* Diagnóstico do negócio */}
            <div className="mb-6">
              <div className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-3 pb-3 border-b border-gray-200">
                Diagnóstico do seu negócio
              </div>

              {!showAnalise ? (
                <div className="flex items-center gap-3 py-4 text-sm text-gray-400">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                  Analisando o seu perfil...
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
                  <div className="text-sm text-gray-700 leading-[1.8]">{diagText}</div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="text-sm text-gray-700 leading-[1.8]">{jogoText}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Oportunidades */}
            <div className="mb-6">
              <div className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-3 pb-3 border-b border-gray-200">
                Oportunidades de receita identificadas
              </div>
              <div className="space-y-3">
                {ops.map((o, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                    <div className="flex items-start gap-3">
                      <span className={`text-xs font-bold tracking-wider shrink-0 min-w-[24px] pt-0.5 ${
                        i === 0 ? 'text-gray-900' : i === 1 ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        0{i + 1}
                      </span>
                      <div>
                        <div className={`font-semibold text-sm mb-1 ${
                          i === 0 ? 'text-gray-900' : i === 1 ? 'text-gray-700' : 'text-gray-500'
                        }`}>
                          {o.n}
                        </div>
                        <div className="text-sm text-gray-500 leading-relaxed">{o.w}</div>
                        <span className="inline-block mt-2 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                          {o.p}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cases */}
            <div className="mb-6">
              <div className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-3 pb-3 border-b border-gray-200">
                Empresas do seu setor que já fizeram — e o resultado
              </div>
              <div className="space-y-3">
                {cases.map((c, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                    <div className="font-semibold text-sm text-gray-900 mb-1">{c.co}</div>
                    <div className="text-sm text-gray-700 leading-relaxed mb-1">{c.res}</div>
                    <div className="text-xs text-gray-400">
                      Fonte: <a href={c.url} target="_blank" rel="noopener" className="text-gray-400 underline decoration-gray-300 hover:text-gray-600 transition-colors">{c.src}</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-4">
              <h3 className="font-bold text-base text-gray-900 mb-2">
                Quer entender como isso se aplica ao seu negócio?
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">
                A Finscale trabalha com empresas da economia real para estruturar, lançar e escalar produtos financeiros. Cada caminho é único — e começa com uma conversa.
              </p>
              <a
                href={`https://wa.me/5511936203969?text=${encodeURIComponent('Olá! Acabei de fazer o diagnóstico de embedded finance da Finscale e quero conversar sobre as oportunidades para o meu negócio.')}`}
                target="_blank"
                rel="noopener"
                className="block"
              >
                <button className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors">
                  Conversar em particular com a Finscale sobre o meu negócio →
                </button>
              </a>
            </div>

            <button
              onClick={reiniciar}
              className="w-full mt-2 py-3 px-5 border border-gray-200 text-gray-500 font-medium text-sm rounded-xl hover:border-gray-300 transition-all"
            >
              ↩ Refazer
            </button>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-5 text-center text-xs text-gray-400">
        Finscale © 2026
      </footer>
    </div>
  )
}

function V2OptionBtn({ selected, label, text, desc, onClick }: {
  selected: boolean; label: string; text: string; desc?: string; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex items-start gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
        selected
          ? 'border-gray-900 bg-gray-900 text-white'
          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
      }`}
    >
      <span className={`w-[22px] h-[22px] shrink-0 flex items-center justify-center rounded text-[10px] font-bold mt-0.5 transition-all ${
        selected
          ? 'bg-white text-gray-900'
          : 'border border-gray-300 text-gray-400 bg-gray-50'
      }`}>
        {selected ? '✓' : label}
      </span>
      <div>
        <div className={`text-sm font-medium leading-snug ${selected ? 'text-white' : 'text-gray-700'}`}>
          {text}
        </div>
        {desc && <div className={`text-xs mt-1 ${selected ? 'text-gray-300' : 'text-gray-400'}`}>{desc}</div>}
      </div>
    </button>
  )
}
