export const SL: Record<string, string> = {
  varejo: 'Varejo', construcao: 'Construção', saude: 'Saúde',
  educacao: 'Educação', agro: 'Agro', servicos: 'Serviços'
}

export const DL: Record<string, string> = {
  custo: 'Custo c/ intermediários', inadimplencia: 'Inadimplência',
  caixa: 'Capital de giro', retencao: 'Retenção', receita: 'Novas receitas'
}

export const OL: Record<string, string> = {
  reduzir: 'Reduzir custos', credito: 'Lançar crédito',
  pagamentos: 'Conta/pagamentos', plataforma: 'Virar plataforma', explorar: 'Explorando'
}

export const ML: Record<string, string> = {
  basico: 'Básica', medio: 'Média', avancado: 'Avançada'
}

export const SLBL = ['', 'Não recomendaria', 'Talvez recomendaria', 'Recomendaria', 'Recomendaria muito', 'Com certeza!']

export const INT_LBL = ['', 'Exploratório', 'Interesse médio', 'Alto interesse']

export interface Op {
  n: string
  w: string
  p: string
}

export const OPS: Record<string, Op[]> = {
  varejo: [
    { n: 'Crédito Embarcado (BNPL)', w: 'Cliente já parcela — você não captura o spread. Com crédito próprio, 3-8% de cada venda fica com você.', p: 'Alto impacto · Rápido de testar' },
    { n: 'Subcredenciamento / IP Próprio', w: 'MDR que vai ao adquirente pode ficar na operação. R$25M+/ano já justifica estruturar.', p: 'Receita sobre volume existente' },
    { n: 'Carteira Digital de Fidelidade', w: 'Conta digital da sua marca aumenta recorrência e gera dados proprietários.', p: 'LTV + dados + receita' }
  ],
  construcao: [
    { n: 'Gestão de Float Financeiro', w: 'Capital de terceiros na operação pode render antes de ser utilizado.', p: 'Baixo risco · Alta margem' },
    { n: 'Financiamento de Compradores', w: 'Crédito próprio remove dependência bancária e gera receita recorrente.', p: 'Alto impacto · Prazo médio' },
    { n: 'Conta Digital Corporativa', w: 'Centralizar fluxo de fornecedores reduz custo bancário.', p: 'Eficiência + dados' }
  ],
  saude: [
    { n: 'Antecipação de Recebíveis', w: 'Faturamentos a prazo viram caixa imediato. Baixa complexidade regulatória.', p: 'Implantação em até 60 dias' },
    { n: 'Crédito B2B Setorial', w: 'Crédito direto para hospitais aumenta ticket e captura spread.', p: 'Alta fidelização · Alta margem' },
    { n: 'BaaS de Nicho', w: 'Com volume, escale a infraestrutura para outras empresas do setor.', p: 'Plataforma de longo prazo' }
  ],
  educacao: [
    { n: 'Crédito Estudantil Próprio', w: 'Parceiros ruins causam inadimplência. Com crédito próprio você controla tudo.', p: 'Controle total do risco' },
    { n: 'Antecipação de Mensalidades', w: 'Recebíveis futuros viram capital de giro hoje sem banco.', p: 'Caixa imediato' },
    { n: 'Conta Digital do Aluno', w: 'Wallet na instituição aumenta permanência e gera receita recorrente.', p: 'LTV + receita' }
  ],
  agro: [
    { n: 'Crédito de Insumos', w: 'Quem financia o insumo fideliza o produtor por safras. Spread de 4-12%/ano.', p: 'Alta margem · Alta fidelização' },
    { n: 'Antecipação sobre Contratos', w: 'Contratos de safra viram capital de giro. Alta demanda, pouca oferta.', p: 'Alta demanda · Pouca oferta' },
    { n: 'Conta Digital do Produtor', w: 'Centralizar pagamentos de insumos cria dados exclusivos.', p: 'Plataforma vertical' }
  ],
  servicos: [
    { n: 'Conta de Pagamento Corporativa', w: 'Centralizar recebimentos reduz custo bancário e cria float remunerável.', p: 'Eficiência operacional' },
    { n: 'Crédito para Clientes B2B', w: 'Crédito para clientes aumenta ticket e constrói barreira competitiva.', p: 'Crescimento de receita' },
    { n: 'Solução Financeira Vertical', w: 'Com conhecimento do nicho, crie o produto que nenhum banco calibra.', p: 'Vantagem competitiva única' }
  ]
}

export interface Case {
  co: string
  res: string
  src: string
  url: string
}

export const CASES: Record<string, Case[]> = {
  varejo: [
    { co: 'Mercado Pago (Mercado Livre)', res: 'Braço financeiro representa ~50% da receita líquida do grupo. Processou R$580B em pagamentos no Brasil em 2023.', src: 'Relatório Anual MercadoLibre 2023', url: 'https://investor.mercadolibre.com/annual-reports' },
    { co: 'Midway Financeira (Riachuelo)', res: '15M+ clientes de crédito. Midway responde por ~30% do EBITDA do grupo Guararapes com ROE acima de 20%.', src: 'RI Guararapes 2023', url: 'https://ri.guararapes.com.br' },
    { co: 'BanQi (Casas Bahia)', res: '5M contas abertas em 18 meses. Receita financeira compensou queda no varejo físico durante reestruturação.', src: 'Release Via Varejo 2022', url: 'https://ri.casasbahia.com.br' }
  ],
  construcao: [
    { co: 'Cyrela / Lev', res: 'Plataforma de crédito própria reduziu distratos em ~25% com score interno do comprador.', src: 'Cyrela RI 2023', url: 'https://ri.cyrela.com.br' },
    { co: 'MRV / Luggo', res: 'Diversificação para locação com gestão financeira integrada reduziu dependência de FGTS.', src: 'MRV RI 2023', url: 'https://ri.mrv.com.br' },
    { co: 'Even Construtora', res: 'Float de obra via conta de pagamento reduziu custo de capital operacional em ~15%.', src: 'Case Fintechlab 2023', url: 'https://fintechlab.com.br' }
  ],
  saude: [
    { co: 'RaiaDrogasil', res: 'Fidelidade com crédito: 30M+ usuários ativos. Receita de serviços financeiros cresceu 40% em 2023.', src: 'RD Saúde RI 2023', url: 'https://ri.raiadrogasil.com.br' },
    { co: 'HapVida / NDI', res: 'Verticalização financeira reduziu custo assistencial em ~28% vs operadoras não verticalizadas.', src: 'HapVida RI 2022', url: 'https://ri.hapvida.com.br' },
    { co: 'Saúde ID (Fleury)', res: 'Conta digital para médicos parceiros reduziu inadimplência B2B e aumentou retenção de credenciados.', src: 'Fintechlab 2023', url: 'https://fintechlab.com.br' }
  ],
  educacao: [
    { co: 'Pravaler (Cogna)', res: 'Financiou R$10B+ em mensalidades. Reduziu dependência do FIES em 60%.', src: 'Cogna RI 2023', url: 'https://ri.cogna.com.br' },
    { co: 'Anima Educação', res: 'Antecipação de recebíveis melhorou capital de giro em R$180M e reduziu custo de funding.', src: 'Anima RI 2022', url: 'https://ri.animaeducacao.com.br' },
    { co: 'Yduqs / Estácio', res: 'Financiamento próprio captura spread de 4-6% vs ceder essa margem para fintech parceira.', src: 'Yduqs RI 2023', url: 'https://ri.yduqs.com.br' }
  ],
  agro: [
    { co: 'Lavoro (NYSE: LVRO)', res: 'Crédito rural próprio responde por +25% da receita. Maior distribuidora de agroquímicos da América Latina.', src: 'Lavoro RI 2023', url: 'https://ir.lavoro.com.br' },
    { co: 'Coop (Cooperativa SP)', res: 'Braço financeiro processa R$2B+/ano com spread médio 3,5% — receita antes destinada a bancos.', src: 'Relatório Anual Coop 2022', url: 'https://www.coop.com.br/institucional' },
    { co: 'BrasilAgro', res: 'Antecipação de recebíveis de safra gerou R$120M em capital de giro com custo 40% menor que linha bancária.', src: 'BrasilAgro RI 2023', url: 'https://ri.brasil-agro.com.br' }
  ],
  servicos: [
    { co: 'Totvs Financial Services', res: 'Vertical financeira cresce 60% a.a. e representa 12% da receita total da Totvs.', src: 'Totvs RI 2023', url: 'https://ri.totvs.com' },
    { co: 'iFood', res: 'Conta digital + crédito para restaurantes: 100K+ estabelecimentos, R$50B+ processados/ano.', src: 'iFood Blog Corporativo 2023', url: 'https://blog.ifood.com.br/noticias' },
    { co: 'Localiza&Co', res: 'Estrutura financeira para frotistas captura spread antes repassado a financeiras. ROE supera varejo de veículos.', src: 'Localiza RI 2023', url: 'https://ri.localiza.com' }
  ]
}

export const DIAG: Record<string, string> = {
  varejo: 'No varejo, uma parcela relevante da receita que passa pela sua operação hoje vai direto para o bolso de terceiros — adquirentes, financeiras parceiras, bancos de crédito. Cada venda parcelada, cada transação no cartão, cada cliente que precisou de crédito para comprar: alguém capturou esse valor no lugar da sua empresa. Você entregou o relacionamento financeiro com o seu próprio cliente para um concorrente invisível.',
  construcao: 'Na construção, o dinheiro de terceiros que transita pela sua operação antes de ser utilizado fica parado, sem trabalhar. Cada comprador financiado por banco, cada fornecedor pago por conta bancária cara, cada obra gerenciada sem estrutura financeira própria representa uma oportunidade que outra empresa do setor já está capturando. O fluxo financeiro da sua operação é um ativo — que hoje está sendo explorado por outros.',
  saude: 'Na saúde, os recebíveis a prazo representam capital imobilizado e caro. Financeiras parceiras capturam spread sobre o faturamento dos seus clientes, enquanto você financia o capital de giro com linhas bancárias caras. Distribuidoras e operadoras do seu setor que estruturaram um braço financeiro próprio passaram a controlar o relacionamento, os dados e a margem que antes iam embora.',
  educacao: 'Em educação, o crédito estudantil que vai para parceiros externos entrega junto a margem, o relacionamento e os dados do aluno. A inadimplência alta que muitas IES enfrentam não é destino — é consequência de depender de modelos de risco genéricos que não conhecem o perfil específico de quem estuda na sua instituição. Quem controla o crédito controla a permanência.',
  agro: 'No agronegócio, quem financia o insumo define o relacionamento com o produtor. O crédito que vai para bancos e distribuidoras financeiras leva junto a fidelização, os dados de safra e a margem de spread que poderia compor a sua receita. Cada safra que passa sem estrutura financeira própria é mais um ciclo de relacionamento entregue para terceiros.',
  servicos: 'Empresas de serviço com faturamento recorrente têm um dos melhores ativos para embedded finance: previsibilidade. Esse ativo hoje financia empréstimos bancários caros, quando poderia ser transformado em capital remunerado, crédito para clientes e novas linhas de receita. O mercado financeiro já percebeu o valor dos seus dados — a pergunta é quem vai capturar esse valor primeiro.'
}

export const JOGO: Record<string, string> = {
  varejo: 'Estruturar um braço financeiro no varejo transforma a relação com o cliente: de transacional para recorrente. Crédito próprio, carteira digital, gestão de pagamentos — cada um desses produtos cria vínculo, gera dados e produz receita que hoje não existe no seu P&L. A Riachuelo, o Mercado Livre, as Casas Bahia fizeram essa escolha — e o braço financeiro virou o ativo mais valioso. O que falta para o seu negócio dar esse passo?',
  construcao: 'Construtoras e incorporadoras que estruturaram operações financeiras próprias passaram a controlar o ciclo de venda inteiro — da planta ao financiamento do comprador. Isso reduz distratos, aumenta conversão e cria uma linha de receita financeira que escala com o volume de obras. O seu negócio já tem o volume e o relacionamento. O que falta é a estrutura. Quer entender como isso se aplica à sua operação?',
  saude: 'Distribuidoras e operadoras de saúde que criaram braços financeiros próprios reduziram custo de capital, aumentaram fidelização e criaram receita financeira sobre o mesmo volume de negócios que já tinham. O fluxo financeiro que passa pela sua operação já justifica a análise. O próximo passo começa com uma conversa.',
  educacao: 'IES que controlam o crédito do aluno controlam a permanência, a inadimplência e a margem. Mais do que uma nova receita, é uma transformação na lógica do negócio — de escola para plataforma financeira de educação. Esse caminho já foi trilhado por grupos como Cogna e Anima. O que muda quando você aplica isso ao seu contexto específico?',
  agro: 'Distribuidoras e cooperativas que estruturaram crédito próprio para o produtor criaram um vínculo que vai além da safra. O produtor que financia pelo seu canal tende a comprar mais, renovar mais e recomendar mais. Isso é vantagem competitiva que nenhum desconto compra. Quer entender como estruturar isso no seu modelo?',
  servicos: 'Empresas de serviço que cruzaram para o embedded finance descobriram que os dados que já tinham eram o melhor ativo de crédito do mercado. Totvs, iFood, Localiza — todas usaram o que já sabiam sobre seus clientes para criar produtos financeiros que nenhum banco conseguia calibrar. O que você sabe sobre os seus clientes que um banco não sabe?'
}

export function fmt(v: number): string {
  if (v >= 1e9) return `R$${(v / 1e9).toFixed(1).replace('.', ',')}B`
  if (v >= 1e6) return `R$${Math.round(v / 1e6)}M`
  if (v >= 1e3) return `R$${Math.round(v / 1e3)}K`
  return `R$${Math.round(v)}`
}

export function calcPot(fat: number, dor: string, obj: string, setor: string, mat: string): number {
  const base = fat * 0.018
  const md: Record<string, number> = { custo: 1.35, inadimplencia: 1.15, caixa: 1.20, retencao: 1.25, receita: 1.30 }
  const mo: Record<string, number> = { reduzir: 1.05, credito: 1.40, pagamentos: 1.15, plataforma: 1.55, explorar: 1.0 }
  const ms: Record<string, number> = { varejo: 1.2, construcao: 1.15, saude: 1.1, educacao: 1.25, agro: 1.3, servicos: 1.1 }
  const mm: Record<string, number> = { basico: 0.85, medio: 1.0, avancado: 1.2 }
  return Math.round(base * (md[dor] || 1) * (mo[obj] || 1) * (ms[setor] || 1) * (mm[mat] || 1))
}

export function calcInteresse(obj: string, fat_lbl: string, mat: string, dor: string): number {
  let p = 0
  if (obj === 'credito' || obj === 'plataforma') p += 3
  else if (obj === 'pagamentos' || obj === 'reduzir') p += 2
  else p += 1
  if (fat_lbl === '150-500') p += 3
  else if (fat_lbl === '50-150') p += 2
  else p += 1
  if (mat === 'avancado') p += 2
  else if (mat === 'medio') p += 1
  if (dor === 'receita' || dor === 'custo') p += 2
  else p += 1
  return p >= 9 ? 3 : p >= 6 ? 2 : 1
}
