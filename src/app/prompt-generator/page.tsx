"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { VisionWeaverForm } from '@/components/vision-weaver-form';

export default function PromptGeneratorPage() {
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
          Gerador de Prompts para Imagens
        </h1>
        <p className="mt-4 max-w-[700px] text-muted-foreground md:text-xl">
          Use o formulário abaixo para criar o prompt perfeito para sua
          obra-prima gerada por IA. Descreva, selecione e refine até que sua
          imagem esteja pronta para ser renderizada.
        </p>
      </div>
      <VisionWeaverForm />
    </div>
  );
}
