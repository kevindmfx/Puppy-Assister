"use client";

import Link from "next/link";
import { useHistory } from "@/context/history-context";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wand2, Film, History as HistoryIcon, HelpCircle } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function HistoryPage() {
  const { history, getPromptSnippet } = useHistory();

  const formatHistoryDate = (date: string) => {
    return new Date(date).toLocaleString('pt-BR', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const truncateText = (text: string, length = 80) => {
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
            <div className="rounded-md border relative">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[120px]">Tipo</TableHead>
                            <TableHead>Prompt Inicial</TableHead>
                            <TableHead className="w-[180px]">Data</TableHead>
                            <TableHead className="w-[150px] text-right">Ação</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {history.map((item) => {
                            const isPrompt = item.type === 'prompt';
                            const Icon = isPrompt ? Wand2 : Film;
                            const title = isPrompt ? "Prompt" : "Cena";
                            const snippet = getPromptSnippet(item);

                            return (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2 font-medium">
                                            <Icon className="h-4 w-4 text-primary" />
                                            <span>{title}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-muted-foreground italic">"{truncateText(snippet)}"</span>
                                    </TableCell>
                                    <TableCell>
                                        {formatHistoryDate(item.timestamp)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`/history/${item.id}`}>
                                                Ver Detalhes
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        )}
    </div>
  );
}
