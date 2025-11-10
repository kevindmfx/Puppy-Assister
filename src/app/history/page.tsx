"use client";

import Link from "next/link";
import { useHistory, HistoryItem } from "@/context/history-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wand2, Film, History as HistoryIcon, HelpCircle } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";


export default function HistoryPage() {
  const { history, getPromptSnippet } = useHistory();

  const formatHistoryDate = (date: string) => {
    return new Date(date).toLocaleString('pt-BR', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const truncateText = (text: string, length = 100) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  }

  return (
    <div className="container py-12 w-full max-w-5xl">
        <div className="mb-12 flex flex-col items-center text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl flex items-center gap-3">
                <HistoryIcon className="h-10 w-10" />
                Histórico de Gerações
            </h1>
            <p className="mt-4 max-w-[700px] text-muted-foreground md:text-xl flex items-center gap-2">
                Aqui estão suas últimas gerações.
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <HelpCircle className="h-5 w-5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="max-w-xs text-sm">Este histórico é salvo apenas no seu navegador e não é compartilhado.</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </p>
        </div>

        {history.length === 0 ? (
            <div className="text-center text-muted-foreground">
                <p>Nenhum item no histórico ainda.</p>
                <p>Comece a gerar prompts ou cenas para vê-los aqui.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {history.map((item) => {
                    const isPrompt = item.type === 'prompt';
                    const Icon = isPrompt ? Wand2 : Film;
                    const title = isPrompt ? "Prompt" : "Cena";
                    const snippet = getPromptSnippet(item);

                    return (
                        <Card key={item.id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <Icon className="h-6 w-6 text-primary" />
                                    <CardTitle className="font-headline text-2xl">{title}</CardTitle>
                                </div>
                                <CardDescription>
                                    Gerado em: {formatHistoryDate(item.timestamp)}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                               <p className="text-sm text-muted-foreground italic">"{truncateText(snippet)}"</p>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full">
                                    <Link href={`/history/${item.id}`}>
                                        Ver Detalhes
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
        )}
    </div>
  );
}
