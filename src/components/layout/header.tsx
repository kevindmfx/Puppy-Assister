"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wand2, Film, LogOut, HelpCircle, Menu, BrainCircuit, History } from 'lucide-react';
import { ModeToggle } from '../mode-toggle';
import { SettingsPanel } from '../settings-panel';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { useTutorial } from '@/context/tutorial-context';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Separator } from '../ui/separator';
import { useHistory } from '@/context/history-context';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

export function Header() {
  const { isAuthenticated, logout } = useAuth();
  const { showTutorial } = useTutorial();
  const { promptHistory, sceneHistory } = useHistory();
  const pathname = usePathname();

  const isGeneratorPage = pathname === '/prompt-generator' || pathname === '/scene-generator';

  const toolLinks = [
    { href: '/prompt-generator', label: 'Gerador de Prompt', icon: Wand2 },
    { href: '/scene-generator', label: 'Gerador de Cenas', icon: Film },
  ];

  const aiLinks: any[] = [
    // Futuros links de IA serão adicionados aqui
  ];

  const formatHistoryDate = (date: string) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
                  <SheetContent side="left" className="w-[300px] sm:w-[300px]">
                    <nav className="flex h-full flex-col gap-6 text-lg font-medium mt-6 px-2">
                      <Link
                        href="/"
                        className="flex items-center gap-2 text-lg font-semibold mb-4"
                      >
                        <span className="font-headline text-lg font-bold">
                          Puppy Assister
                        </span>
                      </Link>
                      
                      <div className="flex-1 space-y-4 overflow-y-auto">
                        <div>
                            <h3 className="mb-2 px-2 text-sm font-semibold text-muted-foreground tracking-wider uppercase">
                                Ferramentas
                            </h3>
                            <div className="grid gap-1">
                                {toolLinks.map((link) => (
                                <SheetClose asChild key={link.href}>
                                    <Link
                                        href={link.href}
                                        className={cn(
                                            "flex items-center gap-3 rounded-lg px-2 py-2 transition-all hover:bg-accent hover:text-foreground",
                                            pathname === link.href ? "bg-accent text-foreground" : "text-muted-foreground"
                                        )}
                                    >
                                        <link.icon className="h-5 w-5" />
                                        {link.label}
                                    </Link>
                                </SheetClose>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="mb-2 px-2 text-sm font-semibold text-muted-foreground tracking-wider uppercase">
                                Inteligências Artificiais
                            </h3>
                             <div className="grid gap-1">
                                {aiLinks.length > 0 ? aiLinks.map((link) => (
                                <SheetClose asChild key={link.href}>
                                    <Link
                                        href={link.href}
                                        className={cn(
                                            "flex items-center gap-3 rounded-lg px-2 py-2 transition-all hover:bg-accent hover:text-foreground",
                                            pathname === link.href ? "bg-accent text-foreground" : "text-muted-foreground"
                                        )}
                                    >
                                        <link.icon className="h-5 w-5" />
                                        {link.label}
                                    </Link>
                                </SheetClose>
                                )) : (
                                    <div className="flex items-center gap-3 rounded-lg px-2 py-2 text-muted-foreground">
                                        <BrainCircuit className="h-5 w-5" />
                                        <span>Em breve...</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <div className="flex items-center gap-2 mb-2 px-2">
                                <h3 className="text-sm font-semibold text-muted-foreground tracking-wider uppercase">
                                    Histórico
                                </h3>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="max-w-xs text-sm">Este histórico é salvo apenas no seu navegador.</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                             <div className="grid gap-1">
                                {promptHistory.length === 0 && sceneHistory.length === 0 ? (
                                    <div className="flex items-center gap-3 rounded-lg px-2 py-2 text-muted-foreground">
                                        <History className="h-5 w-5" />
                                        <span>Nenhuma geração.</span>
                                    </div>
                                ) : (
                                    <>
                                        {promptHistory.map((item) => (
                                            <SheetClose asChild key={item.id}>
                                                <Link
                                                    href={`/history/${item.id}`}
                                                    className="flex items-center gap-3 rounded-lg px-2 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
                                                >
                                                    <Wand2 className="h-5 w-5" />
                                                    <div className="flex flex-col text-sm">
                                                        <span>Prompt</span>
                                                        <span className="text-xs">{formatHistoryDate(item.timestamp)}</span>
                                                    </div>
                                                </Link>
                                            </SheetClose>
                                        ))}
                                        {sceneHistory.map((item) => (
                                            <SheetClose asChild key={item.id}>
                                                <Link
                                                    href={`/history/${item.id}`}
                                                    className="flex items-center gap-3 rounded-lg px-2 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
                                                >
                                                    <Film className="h-5 w-5" />
                                                    <div className="flex flex-col text-sm">
                                                        <span>Cena</span>
                                                        <span className="text-xs">{formatHistoryDate(item.timestamp)}</span>
                                                    </div>
                                                </Link>
                                            </SheetClose>
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>

                      </div>
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
                {isGeneratorPage && (
                  <>
                    <Button variant="ghost" size="icon" onClick={showTutorial}>
                      <HelpCircle className="h-5 w-5" />
                      <span className="sr-only">Ajuda</span>
                    </Button>
                    <SettingsPanel />
                  </>
                )}
                <ModeToggle />
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">Sair</span>
                </Button>
              </div>
            </>
          ) : (
            <div className="flex w-full items-center justify-center">
               <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <span className="font-headline text-lg font-bold">
                  Puppy Assister
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
