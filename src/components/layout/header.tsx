"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wand2, Film, LogOut, HelpCircle, Menu } from 'lucide-react';
import { ModeToggle } from '../mode-toggle';
import { SettingsPanel } from '../settings-panel';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { useTutorial } from '@/context/tutorial-context';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';

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
              <div className="flex items-center gap-2">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Abrir Menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <nav className="grid gap-6 text-lg font-medium mt-6">
                      <Link
                        href="#"
                        className="flex items-center gap-2 text-lg font-semibold"
                      >
                        <span className="font-headline text-lg font-bold">
                          Puppy Assister
                        </span>
                      </Link>
                      {navLinks.map((link) => (
                         <SheetClose asChild key={link.href}>
                            <Link
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-4 px-2.5 transition-colors hover:text-foreground",
                                    pathname === link.href ? "text-foreground" : "text-muted-foreground"
                                )}
                            >
                                <link.icon className="h-5 w-5" />
                                {link.label}
                            </Link>
                        </SheetClose>
                      ))}
                    </nav>
                  </SheetContent>
                </Sheet>
                <Link href="/" className="flex items-center space-x-2">
                  <span className="hidden font-headline text-lg font-bold sm:inline-block">
                    Puppy Assister
                  </span>
                </Link>
              </div>

              <div className="flex items-center justify-end gap-2">
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
