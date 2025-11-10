"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { SceneGeneratorForm } from '@/components/scene-generator-form';


export default function SceneGeneratorPage() {
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
          Gerador de Cenas
        </h1>
        <p className="mt-4 max-w-[700px] text-muted-foreground md:text-xl">
          Crie uma sequência de até 8 cenas. Descreva cada uma, ajuste os parâmetros e gere um prompt JSON para sua animação ou vídeo.
        </p>
      </div>
      <SceneGeneratorForm />
    </div>
  );
}
