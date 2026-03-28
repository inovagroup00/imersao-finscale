import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Finscale · Diagnóstico',
  description: 'Diagnóstico de Embedded Finance — descubra o potencial financeiro escondido no seu negócio.',
  themeColor: '#0a0a0f',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
