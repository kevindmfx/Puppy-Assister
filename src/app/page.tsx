import { VisionWeaverForm } from '@/components/vision-weaver-form';

export default function Home() {
  return (
    <div className="container py-12 md:py-24">
      <div className="mb-12 flex flex-col items-center text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Weave Your Vision into Reality
        </h1>
        <p className="mt-4 max-w-[700px] text-muted-foreground md:text-xl">
          Use the form below to craft the perfect prompt for your AI-generated
          masterpiece. Describe, select, and refine until your vision is ready
          to be rendered.
        </p>
      </div>
      <VisionWeaverForm />
    </div>
  );
}
