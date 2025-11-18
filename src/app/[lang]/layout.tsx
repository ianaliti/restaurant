export async function generateStaticParams() {
  return [{ lang: 'en-US' }, { lang: 'fr' }]
}
 
export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ lang: 'en-US' | 'fr' }>
}>) {
  return (
    <html lang={(await params).lang}>
      <body>{children}</body>
    </html>
  )
}