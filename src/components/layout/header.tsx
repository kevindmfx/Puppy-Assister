"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wand2, Film, LogOut, HelpCircle } from 'lucide-react';
import { ModeToggle } from '../mode-toggle';
import { SettingsPanel } from '../settings-panel';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { useTutorial } from '@/context/tutorial-context';
import { cn } from '@/lib/utils';

export function Header() {
  const { isAuthenticated, logout } = useAuth();
  const { showTutorial } = useTutorial();
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Gerador de Prompt', icon: Wand2 },
    { href: '/scene-generator', label: 'Gerador de Cenas', icon: Film },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex flex-1 items-center justify-between">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-6">
                <Link href="/" className="flex items-center space-x-2">
                  <span className="font-headline text-lg font-bold">
                    Puppy Assister
                  </span>
                </Link>
                <nav className="hidden items-center gap-4 md:flex">
                    {navLinks.map((link) => (
                        <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                            pathname === link.href ? "text-primary" : "text-muted-foreground"
                        )}
                        >
                        <link.icon className="h-4 w-4" />
                        {link.label}
                        </Link>
                    ))}
                </nav>
              </div>

              <div className="flex items-center justify-end gap-2">
                 <div className="flex items-center gap-4 md:hidden">
                    {navLinks.map((link) => (
                        <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                            pathname === link.href ? "text-primary" : "text-muted-foreground"
                        )}
                        >
                         <Button variant="ghost" size="icon">
                            <link.icon className="h-5 w-5" />
                             <span className="sr-only">{link.label}</span>
                        </Button>
                        </Link>
                    ))}
                </div>
                <Button variant="ghost" size="icon" onClick={showTutorial}>
                  <HelpCircle className="h-5 w-5" />
                  <span className="sr-only">Ajuda</span>
                </Button>
                <SettingsPanel />
                <ModeToggle />
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">Sair</span>
                </Button>
              </div>
            </>
          ) : (
            <div className="flex w-full items-center justify-center">
              <span className="font-headline text-lg font-bold">
                Acesso Antecipado
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
