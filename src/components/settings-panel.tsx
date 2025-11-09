
"use client";

import React, { useState, useEffect } from 'react';
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
import { Option, FormOption } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
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

export function SettingsPanel() {
  const { promptOptions, sceneOptions, setPromptOptions, setSceneOptions, isLoaded } = useOptions();
  const { toast } = useToast();
  
  const [localPromptOptions, setLocalPromptOptions] = useState<FormOption[]>([]);
  const [localSceneOptions, setLocalSceneOptions] = useState<FormOption[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setLocalPromptOptions(JSON.parse(JSON.stringify(promptOptions)));
      setLocalSceneOptions(JSON.parse(JSON.stringify(sceneOptions)));
    }
  }, [isLoaded, promptOptions, sceneOptions]);
  
  const handleSave = () => {
    try {
        const validateAndFilter = (options: FormOption[]) => {
            return options
                .filter(field => field.key && field.label) // Remove fields with empty key or label
                .map(field => ({
                    ...field,
                    options: field.options.filter(opt => opt.value && opt.label) // Remove options with empty value or label
                }));
        }

        const finalPromptOptions = validateAndFilter(localPromptOptions);
        const finalSceneOptions = validateAndFilter(localSceneOptions);

        setPromptOptions(finalPromptOptions);
        setSceneOptions(finalSceneOptions);

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

  const renderOptionsEditor = (
    type: 'prompt' | 'scene'
  ) => {
    const isPrompt = type === 'prompt';
    const localData = isPrompt ? localPromptOptions : localSceneOptions;
    const setLocalData = isPrompt ? setLocalPromptOptions : setLocalSceneOptions;

    const handleFieldChange = (index: number, field: 'key' | 'label', value: string) => {
        const updatedFields = [...localData];
        updatedFields[index] = { ...updatedFields[index], [field]: value };
        setLocalData(updatedFields);
    }

    const handleOptionChange = (fieldIndex: number, optionIndex: number, field: 'value' | 'label', value: string) => {
        const updatedFields = [...localData];
        const updatedOptions = [...updatedFields[fieldIndex].options];
        updatedOptions[optionIndex] = { ...updatedOptions[optionIndex], [field]: value };
        updatedFields[fieldIndex].options = updatedOptions;
        setLocalData(updatedFields);
    };

    const handleAddOption = (fieldIndex: number) => {
        const updatedFields = [...localData];
        updatedFields[fieldIndex].options.push({ value: '', label: '' });
        setLocalData(updatedFields);
    };

    const handleRemoveOption = (fieldIndex: number, optionIndex: number) => {
        const updatedFields = [...localData];
        updatedFields[fieldIndex].options.splice(optionIndex, 1);
        setLocalData(updatedFields);
    };

    const handleAddField = () => {
        setLocalData([...localData, { key: '', label: '', options: [{ value: 'off', label: 'OFF' }] }]);
    }

    const handleRemoveField = (fieldIndex: number) => {
        const updatedFields = [...localData];
        updatedFields.splice(fieldIndex, 1);
        setLocalData(updatedFields);
    }

    return (
      <div className="space-y-4 py-6">
        <p className="text-sm text-muted-foreground">
            Adicione, edite ou remova campos de seleção e suas respectivas opções.
        </p>
        {localData.map((field, fieldIndex) => (
          <div key={fieldIndex} className="space-y-3 rounded-md border p-4">
            <div className="flex items-end gap-2">
                <div className='flex-1 space-y-1'>
                    <Label htmlFor={`field-label-${type}-${fieldIndex}`} className="text-base font-medium">Rótulo do Campo</Label>
                    <Input
                        id={`field-label-${type}-${fieldIndex}`}
                        placeholder="Ex: Proporção"
                        value={field.label}
                        onChange={(e) => handleFieldChange(fieldIndex, 'label', e.target.value)}
                        className="w-full"
                    />
                </div>
                 <div className='flex-1 space-y-1'>
                    <Label htmlFor={`field-key-${type}-${fieldIndex}`} className="text-base font-medium">ID Único</Label>
                    <Input
                        id={`field-key-${type}-${fieldIndex}`}
                        placeholder="Ex: aspectRatio"
                        value={field.key}
                        onChange={(e) => handleFieldChange(fieldIndex, 'key', e.target.value)}
                        className="w-full"
                    />
                </div>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                            <Trash2 className="h-4 w-4" />
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

            <Label className='text-sm'>Opções</Label>
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
        ))}
        <Button variant="outline" className="w-full" onClick={handleAddField}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Novo Campo de Seleção
        </Button>
      </div>
    );
  }

  if (!mounted || !isLoaded) {
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
        <Tabs defaultValue="prompt" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="prompt">Gerador de Prompt</TabsTrigger>
                <TabsTrigger value="scene">Gerador de Cenas</TabsTrigger>
            </TabsList>
            <ScrollArea className="h-[calc(100vh-200px)] pr-4">
                <TabsContent value="prompt">
                    {renderOptionsEditor('prompt')}
                </TabsContent>
                <TabsContent value="scene">
                    {renderOptionsEditor('scene')}
                </TabsContent>
            </ScrollArea>
        </Tabs>
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
