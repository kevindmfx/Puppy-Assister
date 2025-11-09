import { VisionWeaverForm } from '@/components/vision-weaver-form';

export default function Home() {
  return (
    <div className="container py-12">
      <div className="mb-12 flex flex-col items-center text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Tecelão de Visão
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
