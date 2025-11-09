import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
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

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable}`}
    >
      <head />
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
