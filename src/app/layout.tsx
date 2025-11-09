import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { OptionsProvider } from '@/context/options-context';

export const metadata: Metadata = {
  title: 'Puppy Assister',
  description: 'Gere prompts JSON para criação de imagens com IA.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <OptionsProvider>
            <div className="relative flex min-h-dvh flex-col bg-background">
              <Header />
              <main className="flex flex-1 items-center justify-center">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </OptionsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
