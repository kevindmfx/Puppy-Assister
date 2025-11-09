"use client";

import React, { useState } from 'react';
import { Settings, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useOptions } from '@/context/options-context';
import { FORM_OPTIONS, FormOptionKey } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from './ui/scroll-area';

const OPTION_KEYS = Object.keys(FORM_OPTIONS) as FormOptionKey[];

const OPTION_LABELS: Record<FormOptionKey, string> = {
    environment: "Ambiente",
    lighting: "Iluminação",
    subject: "Assunto Principal",
    mood: "Humor",
    imageSize: "Tamanho da Imagem",
    texture: "Textura / Nível de Detalhe",
    cameraAngle: "Ângulo da Câmera",
}

export function SettingsPanel() {
  const { updateOptions, getOptionsAsString } = useOptions();
  const { toast } = useToast();
  const [localOptions, setLocalOptions] = useState<Record<FormOptionKey, string>>(
    OPTION_KEYS.reduce((acc, key) => {
        acc[key] = getOptionsAsString(key);
        return acc;
    }, {} as Record<FormOptionKey, string>)
  );

  const handleInputChange = (key: FormOptionKey, value: string) => {
    setLocalOptions(prev => ({...prev, [key]: value}));
  }

  const handleSave = () => {
    try {
        OPTION_KEYS.forEach(key => {
            const newOptions = localOptions[key].split(';').map(item => {
                const parts = item.split(':');
                const value = parts[0]?.trim();
                const label = parts[1]?.trim() || value;
                return { value, label };
            }).filter(opt => opt.value);
            updateOptions(key, newOptions);
        });

        toast({
            title: "Configurações Salvas!",
            description: "Suas opções foram atualizadas com sucesso."
        });

    } catch (error) {
        toast({
            variant: "destructive",
            title: "Erro ao Salvar",
            description: "Não foi possível salvar as configurações. Verifique o formato."
        });
        console.error(error);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Abrir Configurações</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Configurações de Opções</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-150px)] pr-4">
        <div className="space-y-6 py-6">
            <p className="text-sm text-muted-foreground">
                Edite as opções para cada campo do formulário. Use o formato <code>valor:rótulo</code> e separe cada item com um ponto e vírgula (<code>;</code>).
            </p>
          {OPTION_KEYS.map(key => (
            <div key={key} className="space-y-2">
              <Label htmlFor={`options-${key}`}>{OPTION_LABELS[key]}</Label>
              <Textarea
                id={`options-${key}`}
                value={localOptions[key]}
                onChange={(e) => handleInputChange(key, e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          ))}
        </div>
        </ScrollArea>
        <SheetFooter>
          <SheetClose asChild>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
              </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
