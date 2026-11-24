import type { Metadata, Viewport } from 'next'
// フォントはリポジトリの依存（@fontsource-variable）から配る。next/font/google はビルドのたびに Google Fonts へ
// 取りに行き、2026-11-24 に Vercel のビルドがそこで失敗した。--font-* の値は globals.css の :root に置く
import '@fontsource-variable/inter/wght.css'
import '@fontsource-variable/noto-sans-jp/wght.css'
import '@fontsource-variable/jetbrains-mono/wght.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'PHYSIOS',
  // ホーム画面に足したときの名前とアイコン。start_url は書かない（選手は自分のリンク、トレーナーは開いていた画面から始まる）
  manifest: '/manifest.webmanifest',
  icons: { icon: '/icons/icon-192.png', apple: '/icons/icon-192.png' },
  appleWebApp: { capable: true, title: 'PHYSIOS', statusBarStyle: 'black' },
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#080E1F',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
