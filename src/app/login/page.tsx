import { LoginForm } from '@/components/login-form';

export default function LoginPage() {
  return (
    <div className="container flex min-h-[calc(100vh-140px)] flex-col items-center justify-center gap-8">
      <h1 className="text-center font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
        ACESSO ANTECIPADO
      </h1>
      <LoginForm />
    </div>
  );
}
