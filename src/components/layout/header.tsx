import Link from 'next/link';
import { Wand2 } from 'lucide-react';
import { ModeToggle } from '../mode-toggle';
import { SettingsPanel } from '../settings-panel';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex flex-1 items-center justify-start">
          <Link href="/" className="flex items-center space-x-2">
            <Wand2 className="h-6 w-6 text-primary" />
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
