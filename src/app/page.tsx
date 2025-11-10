"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Wand2, Film } from 'lucide-react';

const tools = [
  {
    title: 'Gerador de Prompt',
    description: 'Crie prompts detalhados para IAs de geração de imagem. Refine parâmetros como proporção, estilo e qualidade para obter o resultado perfeito.',
    href: '/prompt-generator',
    icon: Wand2,
  },
  {
    title: 'Gerador de Cenas',
    description: 'Desenvolva sequências de cenas para vídeos ou animações. Descreva cada clipe, ajuste os parâmetros e exporte em formato JSON.',
    href: '/scene-generator',
    icon: Film,
  },
];

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="mb-12 flex flex-col items-center text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Bem-vindo ao Puppy Assister
        </h1>
        <p className="mt-4 max-w-[700px] text-muted-foreground md:text-xl">
          Sua caixa de ferramentas para acelerar e aprimorar seus projetos de IA. Escolha uma das ferramentas abaixo para começar.
        </p>
      </div>

      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
        {tools.map((tool) => (
          <Card key={tool.href} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <tool.icon className="h-7 w-7 text-primary" />
                <CardTitle className="font-headline text-2xl">{tool.title}</CardTitle>
              </div>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto">
              <Button asChild className="w-full">
                <Link href={tool.href}>
                  Acessar Ferramenta
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
