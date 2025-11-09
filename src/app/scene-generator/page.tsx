import { SceneGeneratorForm } from '@/components/scene-generator-form';

export default function SceneGeneratorPage() {
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
