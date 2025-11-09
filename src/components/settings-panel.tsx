"use client";

import React, { useState, useEffect } from 'react';
import { Settings, Save, PlusCircle, X } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { useOptions } from '@/context/options-context';
import { FORM_OPTIONS, FormOptionKey } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from './ui/scroll-area';

type Option = { value: string; label: string };

const OPTION_KEYS = Object.keys(FORM_OPTIONS) as FormOptionKey[];

const OPTION_LABELS: Record<FormOptionKey, string> = {
    aspectRatio: "Proporção (Aspect Ratio)",
    chaos: "Caos (Chaos)",
    quality: "Qualidade",
    style: "Estilo",
    stylize: "Estilização (Stylize)",
    version: "Versão do Midjourney",
    camera: "Câmera / Lente",
}

export function SettingsPanel() {
  const { options, updateOptions, isLoaded } = useOptions();
  const { toast } = useToast();
  const [localOptions, setLocalOptions] = useState<Record<FormOptionKey, Option[]>>({} as Record<FormOptionKey, Option[]>);

  useEffect(() => {
    if (isLoaded) {
      setLocalOptions(options);
    }
  }, [isLoaded, options]);

  const handleInputChange = (key: FormOptionKey, index: number, field: 'value' | 'label', value: string) => {
    const updatedOptions = [...(localOptions[key] || [])];
    if (updatedOptions[index]) {
      updatedOptions[index] = { ...updatedOptions[index], [field]: value };
      setLocalOptions(prev => ({...prev, [key]: updatedOptions}));
    }
  };
  
  const handleAddOption = (key: FormOptionKey) => {
    const newOptions = [...(localOptions[key] || []), { value: '', label: '' }];
    setLocalOptions(prev => ({...prev, [key]: newOptions}));
  };
  
  const handleRemoveOption = (key: FormOptionKey, index: number) => {
    const newOptions = [...(localOptions[key] || [])];
    newOptions.splice(index, 1);
    setLocalOptions(prev => ({...prev, [key]: newOptions}));
  };

  const handleSave = () => {
    try {
        Object.entries(localOptions).forEach(([key, value]) => {
            const validOptions = value.filter(opt => opt.value && opt.label);
            updateOptions(key as FormOptionKey, validOptions);
        });

        toast({
            title: "Configurações Salvas!",
            description: "Suas opções foram atualizadas com sucesso."
        });

    } catch (error) {
        toast({
            variant: "destructive",
            title: "Erro ao Salvar",
            description: "Não foi possível salvar as configurações."
        });
        console.error(error);
    }
  };

  if (!isLoaded) {
    return (
        <Button variant="ghost" size="icon" disabled>
            <Settings className="h-5 w-5 animate-spin" />
        </Button>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Abrir Configurações</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[640px]">
        <SheetHeader>
          <SheetTitle>Configurações de Opções</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-150px)] pr-4">
        <div className="space-y-6 py-6">
            <p className="text-sm text-muted-foreground">
                Adicione, edite ou remova as opções para cada campo do formulário.
            </p>
          {OPTION_KEYS.map(key => (
            <div key={key} className="space-y-3 rounded-md border p-4">
              <Label className="text-base font-medium">{OPTION_LABELS[key]}</Label>
              <div className="space-y-2">
                {(localOptions[key] || []).map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder="Valor"
                      value={option.value}
                      onChange={(e) => handleInputChange(key, index, 'value', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Rótulo"
                      value={option.label}
                      onChange={(e) => handleInputChange(key, index, 'label', e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveOption(key, index)}>
                      <X className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={() => handleAddOption(key)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Opção
              </Button>
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
