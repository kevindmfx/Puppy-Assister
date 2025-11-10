"use client";

import { useState, useMemo, memo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Clipboard, ClipboardCheck, Sparkles, PlusCircle, Trash2, FileText, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useOptions } from "@/context/options-context";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { TutorialDialog } from "./tutorial-dialog";
import { useHistory } from "@/context/history-context";

const DynamicSelectField = memo(({
  control,
  name,
  label,
  placeholder,
  options,
  description
}: {
  control: any;
  name: string;
  label: string;
  placeholder: string;
  options: { value: string; label: string }[];
  description?: string;
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center gap-2">
            <FormLabel>{label}</FormLabel>
            {description && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="focus:outline-none">
                      <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
});

DynamicSelectField.displayName = 'DynamicSelectField';

const fullPromptPrefix = `Estrutura e Ordem: O vídeo final deve seguir estritamente a ordem sequencial das chaves principais do JSON (ex: clip_01, scene_A, etc.).

Duração e Tempo: Respeite exatamente a duração especificada no campo de tempo (ex: duration_seconds) para cada clipe, garantindo a minutagem precisa do vídeo.

Fidelidade ao Script: Cada segmento de vídeo deve ser gerado utilizando o texto principal (prompt) em conjunto com todos os parâmetros técnicos definidos em sua respectiva seção de parameters. Considere os parâmetros como requisitos técnicos não negociáveis (e.g., câmeras, lentes, movimento, fps).

Análise e Estética da Imagem: Analise a imagem de referência fornecida a seguir. O modelo deve usar o estilo, a paleta de cores e a iluminação dessa imagem como guia estético primário para animar todas as cenas do script.

Qualidade: Garanta a mais alta qualidade técnica e visual possível, conforme especificado no campo de qualidade (ex: visual_quality).

Coerência: As transições entre os clipes devem ser suaves. Mantenha a coerência visual e tonal (e.g., feeling, timeOfDay) ao longo de toda a sequência, a menos que as especificações explícitas de um clipe exijam uma mudança.`;

const tutorialSteps = [
    {
      target: ".add-scene-button",
      content: "Bem-vindo ao Gerador de Cenas! Use este botão para adicionar novas cenas à sua sequência. Você pode ter até 8 cenas.",
    },
    {
      target: ".scene-accordion-item",
      content: "Cada cena é um item expansível. Clique para abrir e editar os detalhes.",
    },
    {
      target: ".scene-prompt-input",
      content: "Este é o prompt principal da cena. Descreva o que você quer ver acontecendo aqui.",
    },
    {
      target: ".scene-name-input",
      content: "Dê um nome à sua cena para facilitar a organização. Isso não afeta o resultado final.",
    },
    {
      target: ".scene-select-fields",
      content: "Use estes campos para refinar os detalhes técnicos e estéticos de cada cena, como câmera, iluminação e estilo.",
    },
    {
      target: ".generate-json-button",
      content: "Clique aqui para gerar um JSON estruturado com todas as suas cenas. Ideal para APIs e automação.",
    },
    {
      target: ".generate-full-prompt-button",
      content: "Ou clique aqui para gerar um prompt completo, com instruções detalhadas e o JSON, pronto para ser usado com IAs avançadas.",
    },
  ];

export function SceneGeneratorForm() {
  const { toast } = useToast();
  const { sceneOptions } = useOptions();
  const { addHistoryItem } = useHistory();
  const [jsonOutput, setJsonOutput] = useState("");
  const [fullPromptOutput, setFullPromptOutput] = useState("");
  const [hasCopiedJson, setHasCopiedJson] = useState(false);
  const [hasCopiedFullPrompt, setHasCopiedFullPrompt] = useState(false);

  const { sceneSchema, defaultSceneValues, formSchema } = useMemo(() => {
    const sceneSchemaObject: { [key: string]: z.ZodType<any, any> } = {
        sceneName: z.string().optional(),
        prompt: z.string().min(1, "O prompt da cena é obrigatório."),
    };
    const defaultSceneVals: { [key: string]: any } = {
        sceneName: "",
        prompt: "",
    };

    sceneOptions.forEach(option => {
      sceneSchemaObject[option.key] = z.string().optional();
      defaultSceneVals[option.key] = 'off';
    });

    const sceneSchema = z.object(sceneSchemaObject);
    const formSchema = z.object({
        scenes: z.array(sceneSchema).max(8, "Você pode adicionar no máximo 8 cenas."),
    });

    return {
      sceneSchema,
      defaultSceneValues: defaultSceneVals,
      formSchema,
    };
  }, [sceneOptions]);
  
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scenes: [defaultSceneValues],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "scenes",
  });
  
  const watchedScenes = form.watch("scenes");

  const isNotApplicable = (value: string | undefined) => !value || value === 'off';

  const generateJsonOutput = (values: FormValues) => {
    const scenesData: Record<string, any> = {};

    values.scenes.forEach((scene, index) => {
      const { prompt, sceneName, ...rest } = scene;
      const parameters: Record<string, string> = {};
      
      sceneOptions.forEach(option => {
        const key = option.key;
        const value = rest[key];
        if (!isNotApplicable(value)) {
            parameters[key] = value!;
        }
      });

      const clipNumber = (index + 1).toString().padStart(2, '0');
      scenesData[`clip_${clipNumber}`] = {
          prompt,
          parameters,
      };
    });
    
    return JSON.stringify(scenesData, null, 2);
  };

  const saveToHistory = (output: string) => {
    addHistoryItem({
      type: 'scene',
      content: output,
    });
  }

  function onJsonSubmit(values: FormValues) {
    const generatedOutput = generateJsonOutput(values);
    setJsonOutput(generatedOutput);
    setFullPromptOutput("");
    setHasCopiedJson(false);
    saveToHistory(generatedOutput);
  }

  function onFullPromptSubmit(values: FormValues) {
    const jsonString = generateJsonOutput(values);
    const fullPrompt = `${fullPromptPrefix}\n\n${jsonString}`;
    setFullPromptOutput(fullPrompt);
    setJsonOutput("");
    setHasCopiedFullPrompt(false);
    saveToHistory(jsonString);
  }

  const handleCopy = (type: 'json' | 'full') => {
    const textToCopy = type === 'json' ? jsonOutput : fullPromptOutput;
    navigator.clipboard.writeText(textToCopy).then(() => {
        if (type === 'json') {
            setHasCopiedJson(true);
            setTimeout(() => setHasCopiedJson(false), 2000);
        } else {
            setHasCopiedFullPrompt(true);
            setTimeout(() => setHasCopiedFullPrompt(false), 2000);
        }
        toast({
            title: "Copiado!",
            description: "O resultado foi copiado para a área de transferência.",
        });
    });
  };

  const addScene = () => {
    if (fields.length < 8) {
      append(defaultSceneValues);
    } else {
        toast({
            variant: 'destructive',
            title: "Limite Atingido",
            description: "Você só pode adicionar até 8 cenas."
        })
    }
  }

  return (
    <>
      <TutorialDialog pageKey="scene-generator" steps={tutorialSteps} />
      <Card className="mx-auto w-full max-w-7xl shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2 text-2xl scene-title">
            <Sparkles className="h-6 w-6 text-primary" />
            Crie sua Sequência
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-8">
              <Accordion type="multiple" defaultValue={['scene-0']} className="w-full space-y-4">
                {fields.map((field, index) => (
                  <AccordionItem key={field.id} value={`scene-${index}`} className="rounded-lg border bg-card px-4 shadow-sm scene-accordion-item">
                    <div className="flex items-center">
                        <AccordionTrigger className="flex-1 text-lg font-medium">
                            {watchedScenes[index]?.sceneName || `Cena ${index + 1}`}
                        </AccordionTrigger>
                        {fields.length > 1 && (
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                <Trash2 className="h-5 w-5 text-destructive" />
                            </Button>
                        )}
                    </div>
                    <AccordionContent className="pt-4">
                      <div className="space-y-6">
                        <FormField
                            control={form.control}
                            name={`scenes.${index}.sceneName`}
                            render={({ field: formField }) => (
                                <FormItem className="scene-name-input">
                                <div className="flex items-center gap-2">
                                    <FormLabel className="text-base">Nome da Cena (Opcional)</FormLabel>
                                    <TooltipProvider>
                                        <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button type="button" className="focus:outline-none">
                                            <HelpCircle className="h-4 w-4 cursor-help text-muted-foreground" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="max-w-xs">
                                            Dê um nome para esta cena para facilitar a organização. Não afeta o resultado final.
                                            </p>
                                        </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <FormControl>
                                    <Input
                                    placeholder={`Ex: Cena de Abertura`}
                                    {...formField}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                          control={form.control}
                          name={`scenes.${index}.prompt`}
                          render={({ field: formField }) => (
                            <FormItem className="scene-prompt-input">
                              <div className="flex items-center gap-2">
                                <FormLabel className="text-base">Prompt da Cena</FormLabel>
                                <TooltipProvider>
                                    <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button type="button" className="focus:outline-none">
                                        <HelpCircle className="h-4 w-4 cursor-help text-muted-foreground" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="max-w-xs">
                                        Descreva a ação principal e os elementos visuais para esta cena específica.
                                        </p>
                                    </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                              </div>
                              <FormControl>
                                <Textarea
                                  placeholder="Ex: um close-up de um relógio derretendo em uma paisagem desértica"
                                  className="min-h-[80px] resize-y"
                                  {...formField}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-1 gap-4 rounded-md border p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 scene-select-fields">
                            {sceneOptions.map(option => (
                                <DynamicSelectField
                                    key={option.key}
                                    control={form.control}
                                    name={`scenes.${index}.${option.key}`}
                                    label={option.label}
                                    placeholder="OFF"
                                    options={option.options}
                                    description={option.description}
                                />
                            ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              <div className="flex flex-col items-center justify-between gap-4 pt-4 md:flex-row">
                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" onClick={addScene} className="add-scene-button">
                      <PlusCircle className="mr-2 h-5 w-5" />
                      Adicionar Cena
                  </Button>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button" className="focus:outline-none">
                          <HelpCircle className="h-4 w-4 cursor-help text-muted-foreground" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Adiciona uma nova cena à sua sequência (máximo de 8).</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="flex flex-col items-center gap-4 sm:flex-row">
                    <div className="flex items-center gap-2">
                        <Button type="button" size="lg" onClick={form.handleSubmit(onJsonSubmit)} className="generate-json-button">
                            <Sparkles className="mr-2 h-5 w-5" />
                            Gerar JSON das Cenas
                        </Button>
                         <TooltipProvider>
                            <Tooltip>
                            <TooltipTrigger asChild>
                                <button type="button" className="focus:outline-none">
                                <HelpCircle className="h-4 w-4 cursor-help text-muted-foreground" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="max-w-xs">Gera um arquivo JSON estruturado com todas as cenas, ideal para ser usado com APIs.</p>
                            </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button type="button" size="lg" variant="secondary" onClick={form.handleSubmit(onFullPromptSubmit)} className="generate-full-prompt-button">
                            <FileText className="mr-2 h-5 w-5" />
                            Gerar Prompt Completo
                        </Button>
                        <TooltipProvider>
                            <Tooltip>
                            <TooltipTrigger asChild>
                                <button type="button" className="focus:outline-none">
                                <HelpCircle className="h-4 w-4 cursor-help text-muted-foreground" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="max-w-xs">Gera um prompt de texto único e detalhado contendo todas as cenas e instruções, pronto para IAs avançadas.</p>
                            </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
              </div>

            </form>
          </Form>
        </CardContent>
      </Card>
      
      {jsonOutput && (
        <Card className="mx-auto mt-8 w-full max-w-7xl shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline text-2xl">
                    Seu JSON Gerado
                </CardTitle>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy('json')}
                    >
                    {hasCopiedJson ? (
                        <ClipboardCheck className="h-5 w-5 text-green-500" />
                    ) : (
                        <Clipboard className="h-5 w-5" />
                    )}
                </Button>
            </CardHeader>
            <CardContent>
                <pre className="mt-2 w-full overflow-auto rounded-md bg-muted p-4">
                    <code className="text-muted-foreground whitespace-pre-wrap">{jsonOutput}</code>
                </pre>
            </CardContent>
        </Card>
      )}

      {fullPromptOutput && (
        <Card className="mx-auto mt-8 w-full max-w-7xl shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline text-2xl">
                    Seu Prompt Completo Gerado
                </CardTitle>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy('full')}
                    >
                    {hasCopiedFullPrompt ? (
                        <ClipboardCheck className="h-5 w-5 text-green-500" />
                    ) : (
                        <Clipboard className="h-5 w-5" />
                    )}
                </Button>
            </CardHeader>
            <CardContent>
                <pre className="mt-2 w-full overflow-auto rounded-md bg-muted p-4">
                    <code className="text-muted-foreground whitespace-pre-wrap">{fullPromptOutput}</code>
                </pre>
            </CardContent>
        </Card>
      )}
    </>
  );
}
