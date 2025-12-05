import './globals.css'; 

// Versi ini paling asas untuk mengelakkan sebarang konflik.
// Ia menyediakan struktur HTML asas untuk aplikasi anda.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ms">
      <body>
        {/* 'children' adalah kandungan dari app/page.tsx (iaitu Kalkulator Kereta) */}
        {children} 
      </body>
    </html>
  );
}