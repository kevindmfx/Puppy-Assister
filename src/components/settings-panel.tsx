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
import { FormOptionKey, SceneFormOptionKey } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

type Option = { value: string; label: string };

const PROMPT_OPTION_KEYS: FormOptionKey[] = ['aspectRatio', 'chaos', 'quality', 'style', 'stylize', 'version', 'camera'];
const SCENE_OPTION_KEYS: SceneFormOptionKey[] = ['cameraType', 'lens', 'timeOfDay', 'feeling', 'color', 'sceneQuality', 'sceneStyle', 'framing', 'texture', 'cameraMovement', 'fps'];

const PROMPT_OPTION_LABELS: Record<FormOptionKey, string> = {
    aspectRatio: "Proporção (Aspect Ratio)",
    chaos: "Caos (Chaos)",
    quality: "Qualidade",
    style: "Estilo",
    stylize: "Estilização (Stylize)",
    version: "Versão do Midjourney",
    camera: "Câmera / Lente",
}

const SCENE_OPTION_LABELS: Record<SceneFormOptionKey, string> = {
    cameraType: "Tipo de Câmera",
    lens: "Lente",
    timeOfDay: "Horário do Dia",
    feeling: "Sentimento",
    color: "Coloração",
    sceneQuality: "Qualidade da Cena",
    sceneStyle: "Estilo da Cena",
    framing: "Enquadramento",
    texture: "Textura",
    cameraMovement: "Movimento da Câmera",
    fps: "FPS",
};

export function SettingsPanel() {
  const { promptOptions, sceneOptions, updatePromptOptions, updateSceneOptions, isLoaded } = useOptions();
  const { toast } = useToast();
  
  const [localPromptOptions, setLocalPromptOptions] = useState<Record<FormOptionKey, Option[]>>({} as Record<FormOptionKey, Option[]>);
  const [localSceneOptions, setLocalSceneOptions] = useState<Record<SceneFormOptionKey, Option[]>>({} as Record<SceneFormOptionKey, Option[]>);

  useEffect(() => {
    if (isLoaded) {
      setLocalPromptOptions(promptOptions);
      setLocalSceneOptions(sceneOptions);
    }
  }, [isLoaded, promptOptions, sceneOptions]);

  const handleInputChange = (type: 'prompt' | 'scene', key: string, index: number, field: 'value' | 'label', value: string) => {
    if (type === 'prompt') {
        const updatedOptions = [...(localPromptOptions[key as FormOptionKey] || [])];
        if (updatedOptions[index]) {
          updatedOptions[index] = { ...updatedOptions[index], [field]: value };
          setLocalPromptOptions(prev => ({...prev, [key as FormOptionKey]: updatedOptions}));
        }
    } else {
        const updatedOptions = [...(localSceneOptions[key as SceneFormOptionKey] || [])];
        if (updatedOptions[index]) {
            updatedOptions[index] = { ...updatedOptions[index], [field]: value };
            setLocalSceneOptions(prev => ({...prev, [key as SceneFormOptionKey]: updatedOptions}));
        }
    }
  };
  
  const handleAddOption = (type: 'prompt' | 'scene', key: string) => {
    if (type === 'prompt') {
        const newOptions = [...(localPromptOptions[key as FormOptionKey] || []), { value: '', label: '' }];
        setLocalPromptOptions(prev => ({...prev, [key as FormOptionKey]: newOptions}));
    } else {
        const newOptions = [...(localSceneOptions[key as SceneFormOptionKey] || []), { value: '', label: '' }];
        setLocalSceneOptions(prev => ({...prev, [key as SceneFormOptionKey]: newOptions}));
    }
  };
  
  const handleRemoveOption = (type: 'prompt' | 'scene', key: string, index: number) => {
    if (type === 'prompt') {
        const newOptions = [...(localPromptOptions[key as FormOptionKey] || [])];
        newOptions.splice(index, 1);
        setLocalPromptOptions(prev => ({...prev, [key as FormOptionKey]: newOptions}));
    } else {
        const newOptions = [...(localSceneOptions[key as SceneFormOptionKey] || [])];
        newOptions.splice(index, 1);
        setLocalSceneOptions(prev => ({...prev, [key as SceneFormOptionKey]: newOptions}));
    }
  };

  const handleSave = () => {
    try {
        Object.entries(localPromptOptions).forEach(([key, value]) => {
            const validOptions = value.filter(opt => opt.value && opt.label);
            updatePromptOptions(key as FormOptionKey, validOptions);
        });

        Object.entries(localSceneOptions).forEach(([key, value]) => {
            const validOptions = value.filter(opt => opt.value && opt.label);
            updateSceneOptions(key as SceneFormOptionKey, validOptions);
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

  const renderOptionsEditor = (
    type: 'prompt' | 'scene',
    keys: string[],
    labels: Record<string, string>,
    options: Record<string, Option[]>
  ) => (
    <div className="space-y-6 py-6">
      <p className="text-sm text-muted-foreground">
        Adicione, edite ou remova as opções para cada campo do formulário.
      </p>
      {keys.map(key => (
        <div key={key} className="space-y-3 rounded-md border p-4">
          <Label className="text-base font-medium">{labels[key]}</Label>
          <div className="space-y-2">
            {(options[key] || []).map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder="Valor"
                  value={option.value}
                  onChange={(e) => handleInputChange(type, key, index, 'value', e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Rótulo"
                  value={option.label}
                  onChange={(e) => handleInputChange(type, key, index, 'label', e.target.value)}
                  className="flex-1"
                />
                <Button variant="ghost" size="icon" onClick={() => handleRemoveOption(type, key, index)}>
                  <X className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={() => handleAddOption(type, key)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Opção
          </Button>
        </div>
      ))}
    </div>
  );

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
        <Tabs defaultValue="prompt" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="prompt">Gerador de Prompt</TabsTrigger>
                <TabsTrigger value="scene">Gerador de Cenas</TabsTrigger>
            </TabsList>
            <ScrollArea className="h-[calc(100vh-200px)] pr-4">
                <TabsContent value="prompt">
                    {renderOptionsEditor('prompt', PROMPT_OPTION_KEYS, PROMPT_OPTION_LABELS, localPromptOptions)}
                </TabsContent>
                <TabsContent value="scene">
                    {renderOptionsEditor('scene', SCENE_OPTION_KEYS, SCENE_OPTION_LABELS, localSceneOptions)}
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