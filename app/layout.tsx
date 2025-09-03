import './globals.css'

export const metadata = {
  title: 'Magic UI Elite',
  description: 'AI-powered multi-agent UI generator with live previews',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-900 text-white">
        {children}
      </body>
    </html>
  )
}