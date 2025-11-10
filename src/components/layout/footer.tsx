export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-border/40 py-6 md:py-8 text-center">
      <p className="text-sm text-muted-foreground">
        &copy; {currentYear} Puppy Assister. Todos os direitos reservados.
      </p>
    </footer>
  );
}
