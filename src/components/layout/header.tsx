"use client";

import Link from 'next/link';
import { Menu, Wand2, Film } from 'lucide-react';
import { ModeToggle } from '../mode-toggle';
import { SettingsPanel } from '../settings-panel';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex flex-1 items-center justify-start">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <Link href="/">
                  <Wand2 className="mr-2 h-4 w-4" />
                  <span>Gerador de Prompt</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/scene-generator">
                  <Film className="mr-2 h-4 w-4" />
                  <span>Gerador de Cenas</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-headline text-lg font-bold">
              Puppy Assister
            </span>
          </Link>
        </div>
        <div className="flex items-center justify-end gap-2">
          <SettingsPanel />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
