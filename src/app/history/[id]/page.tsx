"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useHistory, HistoryItem } from "@/context/history-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clipboard, ClipboardCheck, Wand2, Film } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formatHistoryDate = (date: string) => {
    return new Date(date).toLocaleString('pt-BR', {
      dateStyle: 'long',
      timeStyle: 'short'
    });
  };

export default function HistoryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { getHistoryItem } = useHistory();
  const { toast } = useToast();

  const [item, setItem] = useState<HistoryItem | null>(null);
  const [hasCopied, setHasCopied] = useState(false);
  
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (id) {
      const historyItem = getHistoryItem(id);
      setItem(historyItem || null);
    }
  }, [id, getHistoryItem]);
  
  const handleCopy = useCallback(() => {
    if (!item) return;
    navigator.clipboard.writeText(item.content).then(() => {
      setHasCopied(true);
      toast({
        title: "Copiado!",
        description: "O conteúdo JSON foi copiado para a área de transferência.",
      });
      setTimeout(() => setHasCopied(false), 2000);
    });
  }, [item, toast]);

  if (!item) {
    return (
      <div className="container py-12 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4 mx-auto" />
        <h1 className="font-headline text-2xl font-bold">Carregando item...</h1>
        <p className="text-muted-foreground">Se o item não carregar, ele pode não existir.</p>
        <Button onClick={() => router.push('/history')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o Histórico
        </Button>
      </div>
    );
  }

  const isPrompt = item.type === 'prompt';
  const Icon = isPrompt ? Wand2 : Film;
  const title = isPrompt ? "Detalhe do Prompt" : "Detalhe da Cena";

  return (
    <div className="container py-12 w-full max-w-4xl">
      <div className="mb-4">
        <Button variant="ghost" onClick={() => router.push('/history')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o Histórico
        </Button>
      </div>
      <Card className="w-full shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline flex items-center gap-3 text-2xl">
                    <Icon className="h-6 w-6 text-primary" />
                    {title}
                </CardTitle>
                <CardDescription className="mt-2">
                    Gerado em: {formatHistoryDate(item.timestamp)}
                </CardDescription>
            </div>
            <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
            >
                {hasCopied ? (
                    <ClipboardCheck className="h-5 w-5 text-green-500" />
                ) : (
                    <Clipboard className="h-5 w-5" />
                )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <pre className="w-full overflow-auto rounded-md bg-muted p-4">
            <code className="text-muted-foreground whitespace-pre-wrap">
              {item.content}
            </code>
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
