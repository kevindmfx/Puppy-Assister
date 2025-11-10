
"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Settings, Save, PlusCircle, X, Trash2 } from 'lucide-react';
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
import { FormOption } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from './ui/scroll-area';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

export function SettingsPanel() {
  const { promptOptions, sceneOptions, setPromptOptions, setSceneOptions, isLoaded } = useOptions();
  const { toast } = useToast();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [localOptions, setLocalOptions] = useState<FormOption[]>([]);
  
  const isSceneGenerator = pathname === '/scene-generator';
  const currentOptions = isSceneGenerator ? sceneOptions : promptOptions;
  const setCurrentOptions = isSceneGenerator ? setSceneOptions : setPromptOptions;
  const panelTitle = isSceneGenerator ? "Gerador de Cenas" : "Gerador de Prompts para Imagens";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setLocalOptions(JSON.parse(JSON.stringify(currentOptions)));
    }
  }, [isLoaded, currentOptions]);
  
  const handleSave = () => {
    try {
        const validateAndFilter = (options: FormOption[]) => {
            return options
                .filter(field => field.key && field.label) 
                .map(field => ({
                    ...field,
                    options: field.options.filter(opt => opt.value && opt.label) 
                }));
        }

        const finalOptions = validateAndFilter(localOptions);
        setCurrentOptions(finalOptions);

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

  const handleFieldChange = (index: number, field: 'key' | 'label', value: string) => {
      const updatedFields = [...localOptions];
      updatedFields[index] = { ...updatedFields[index], [field]: value };
      setLocalOptions(updatedFields);
  }

  const handleOptionChange = (fieldIndex: number, optionIndex: number, field: 'value' | 'label', value: string) => {
      const updatedFields = [...localOptions];
      const updatedOptions = [...updatedFields[fieldIndex].options];
      updatedOptions[optionIndex] = { ...updatedOptions[optionIndex], [field]: value };
      updatedFields[fieldIndex].options = updatedOptions;
      setLocalOptions(updatedFields);
  };

  const handleAddOption = (fieldIndex: number) => {
      const updatedFields = [...localOptions];
      updatedFields[fieldIndex].options.push({ value: '', label: '' });
      setLocalOptions(updatedFields);
  };

  const handleRemoveOption = (fieldIndex: number, optionIndex: number) => {
      const updatedFields = [...localOptions];
      updatedFields[fieldIndex].options.splice(optionIndex, 1);
      setLocalOptions(updatedFields);
  };

  const handleAddField = () => {
      setLocalOptions([...localOptions, { key: '', label: '', options: [{ value: 'off', label: 'OFF' }], description: '' }]);
  }

  const handleRemoveField = (fieldIndex: number) => {
      const updatedFields = [...localOptions];
      updatedFields.splice(fieldIndex, 1);
      setLocalOptions(updatedFields);
  }

  const renderOptionsEditor = () => {
    return (
      <div className="space-y-4 py-6">
        <p className="text-sm text-muted-foreground">
            Adicione, edite ou remova campos de seleção e suas respectivas opções.
        </p>
        <Accordion type="multiple" className="w-full space-y-4">
        {localOptions.map((field, fieldIndex) => (
          <AccordionItem key={fieldIndex} value={`field-${fieldIndex}`} className="rounded-lg border bg-card px-4 shadow-sm">
            <div className="flex items-center">
              <AccordionTrigger className="flex-1 text-base font-medium">
                  {field.label || `Novo Campo ${fieldIndex + 1}`}
              </AccordionTrigger>
              <AlertDialog>
                  <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                      <AlertDialogHeader>
                      <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                      <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Isso excluirá permanentemente este campo de seleção e todas as suas opções.
                      </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleRemoveField(fieldIndex)}>Continuar</AlertDialogAction>
                      </AlertDialogFooter>
                  </AlertDialogContent>
              </AlertDialog>
            </div>
            <AccordionContent className="pt-4">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className='space-y-1'>
                            <Label htmlFor={`field-label-${fieldIndex}`}>Rótulo do Campo</Label>
                            <Input
                                id={`field-label-${fieldIndex}`}
                                placeholder="Ex: Proporção"
                                value={field.label}
                                onChange={(e) => handleFieldChange(fieldIndex, 'label', e.target.value)}
                            />
                        </div>
                        <div className='space-y-1'>
                            <Label htmlFor={`field-key-${fieldIndex}`}>ID Único</Label>
                            <Input
                                id={`field-key-${fieldIndex}`}
                                placeholder="Ex: aspectRatio"
                                value={field.key}
                                onChange={(e) => handleFieldChange(fieldIndex, 'key', e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <Label className='text-sm font-medium'>Opções</Label>
                    <div className="space-y-2">
                    {(field.options || []).map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-2">
                        <Input
                            placeholder="Valor"
                            value={option.value}
                            onChange={(e) => handleOptionChange(fieldIndex, optionIndex, 'value', e.target.value)}
                            className="flex-1"
                        />
                        <Input
                            placeholder="Rótulo"
                            value={option.label}
                            onChange={(e) => handleOptionChange(fieldIndex, optionIndex, 'label', e.target.value)}
                            className="flex-1"
                        />
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveOption(fieldIndex, optionIndex)}>
                            <X className="h-4 w-4 text-destructive" />
                        </Button>
                        </div>
                    ))}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleAddOption(fieldIndex)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Opção
                    </Button>
                </div>
            </AccordionContent>
          </AccordionItem>
        ))}
        </Accordion>

        <Button variant="outline" className="w-full" onClick={handleAddField}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Novo Campo de Seleção
        </Button>
      </div>
    );
  }

  if (!mounted) {
    return (
        <Button variant="ghost" size="icon" disabled>
            <Settings className="h-5 w-5" />
        </Button>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" disabled={!isLoaded}>
          <Settings className={cn("h-5 w-5", !isLoaded && "animate-spin")} />
          <span className="sr-only">Abrir Configurações</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[640px]">
        <SheetHeader>
          <SheetTitle>Opções - {panelTitle}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-140px)] pr-4">
            {isLoaded ? renderOptionsEditor() : <p>Carregando...</p>}
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
