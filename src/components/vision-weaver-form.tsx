"use client";

import { useState, useMemo, memo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SPECIAL_MIDJOURNEY_KEYS } from "@/lib/constants";
import { Clipboard, ClipboardCheck, Sparkles, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useOptions } from "@/context/options-context";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "./ui/tooltip";
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

const tutorialSteps = [
    {
      target: ".prompt-title",
      content: "Bem-vindo ao Gerador de Prompts para Imagens! Esta ferramenta ajuda você a criar prompts detalhados para IAs de geração de imagem.",
    },
    {
      target: ".base-prompt-input",
      content: "Comece descrevendo a ideia principal da sua imagem aqui. Seja criativo!",
    },
    {
      target: ".select-fields",
      content: "Use estes campos para adicionar parâmetros técnicos e de estilo ao seu prompt, como proporção, qualidade e versão da IA.",
    },
    {
      target: ".output-format-selector",
      content: "Escolha o formato da saída. 'Texto para Midjourney' gera um prompt em linha, enquanto 'JSON' cria uma estrutura de dados para outras IAs.",
    },
    {
      target: ".generate-prompt-button",
      content: "Quando terminar, clique aqui para gerar seu prompt final!",
    },
];

export function VisionWeaverForm() {
  const { toast } = useToast();
  const { promptOptions } = useOptions();
  const { addHistoryItem } = useHistory();
  const [output, setOutput] = useState("");
  const [hasCopied, setHasCopied] = useState(false);

  const { formSchema, defaultValues } = useMemo(() => {
    const schemaObject: { [key: string]: z.ZodType<any, any> } = {
        basePrompt: z.string().min(1, "Por favor, insira um prompt base."),
        outputType: z.enum(['midjourney', 'json']).default('midjourney'),
    };
    const defaultVals: { [key: string]: string } = {
        basePrompt: "",
        outputType: "midjourney",
    };

    promptOptions.forEach(option => {
      schemaObject[option.key] = z.string().optional();
      defaultVals[option.key] = 'off';
    });

    return {
      formSchema: z.object(schemaObject),
      defaultValues: defaultVals,
    };
  }, [promptOptions]);

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });
  
  const isNotApplicable = (value: string | undefined) => !value || value === 'off';

  const generateMidjourneyPrompt = (values: FormValues) => {
    let prompt = values.basePrompt;
    
    promptOptions.forEach(option => {
        const key = option.key;
        const value = values[key as keyof FormValues] as string | undefined;
        if(!isNotApplicable(value)) {
            if (SPECIAL_MIDJOURNEY_KEYS[key]) {
                prompt += ` ${SPECIAL_MIDJOURNEY_KEYS[key]} ${value}`;
            } else {
                prompt += `, ${value}`;
            }
        }
    });

    return prompt.trim();
  };
  
  const generateJsonOutput = (values: FormValues) => {
    const { basePrompt, outputType, ...rest } = values;
    const parameters: Record<string, string> = {};
    
    promptOptions.forEach(option => {
      const key = option.key;
      const value = rest[key as keyof typeof rest];
      if (!isNotApplicable(value)) {
        parameters[key] = value!;
      }
    });

    const promptData = {
        prompt: basePrompt,
        parameters: parameters,
    };
    return JSON.stringify(promptData, null, 2);
  };

  function onSubmit(values: FormValues) {
    let generatedOutput = "";
    let historyContent = "";

    if (values.outputType === 'midjourney') {
        generatedOutput = generateMidjourneyPrompt(values);
        // For midjourney, we still save a JSON structure for consistency in history
        const { basePrompt, outputType, ...rest } = values;
        const parameters: Record<string, string> = {};
        promptOptions.forEach(option => {
            const key = option.key;
            const value = rest[key as keyof typeof rest];
            if (!isNotApplicable(value)) {
                parameters[key] = value!;
            }
        });
        historyContent = JSON.stringify({ prompt: basePrompt, parameters, midjourneyPrompt: generatedOutput }, null, 2);
    } else {
        generatedOutput = generateJsonOutput(values);
        historyContent = generatedOutput;
    }

    addHistoryItem({
        type: 'prompt',
        content: historyContent,
    });
    
    setOutput(generatedOutput);
    setHasCopied(false);
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output).then(() => {
      setHasCopied(true);
      toast({
        title: "Copiado!",
        description: "O resultado foi copiado para a área de transferência.",
      });
      setTimeout(() => setHasCopied(false), 2000);
    });
  };

  return (
    <>
      <TutorialDialog pageKey="prompt-generator" steps={tutorialSteps} />
      <Card className="mx-auto w-full max-w-7xl shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2 text-2xl prompt-title">
            <Sparkles className="h-6 w-6 text-primary" />
            Crie seu Prompt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                control={form.control}
                name="basePrompt"
                render={({ field }) => (
                    <FormItem className="base-prompt-input">
                    <div className="flex items-center gap-2">
                        <FormLabel className="text-lg">Prompt Base</FormLabel>
                        <TooltipProvider>
                            <Tooltip>
                            <TooltipTrigger asChild>
                                <button type="button" className="focus:outline-none">
                                <HelpCircle className="h-4 w-4 cursor-help text-muted-foreground" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="max-w-xs">
                                Esta é a descrição principal da imagem que você deseja criar.
                                </p>
                            </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <FormControl>
                        <Textarea
                        placeholder="Ex: um astronauta surfando em uma onda cósmica"
                        className="min-h-[100px] resize-y"
                        {...field}
                        />
                    </FormControl>
                    <FormDescription>
                        Esta é a ideia principal da sua imagem.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 select-fields">
                {promptOptions.map(option => (
                    <DynamicSelectField 
                        key={option.key}
                        control={form.control}
                        name={option.key}
                        label={option.label}
                        placeholder="OFF"
                        options={option.options}
                        description={option.description}
                    />
                ))}
              </div>

              <div className="grid grid-cols-1 items-start gap-8 pt-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="outputType"
                  render={({ field }) => (
                    <FormItem className="space-y-3 output-format-selector">
                      <div className="flex items-center gap-2">
                        <FormLabel>Formato de Saída</FormLabel>
                        <TooltipProvider>
                            <Tooltip>
                            <TooltipTrigger asChild>
                                <button type="button" className="focus:outline-none">
                                <HelpCircle className="h-4 w-4 cursor-help text-muted-foreground" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="max-w-xs">
                                  Escolha 'Midjourney' para um prompt de texto simples ou 'JSON' para um formato estruturado compatível com APIs.
                                </p>
                            </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                      </div>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="midjourney" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Texto para Midjourney
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="json" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              JSON para Gemini / Outras IAs
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-center items-center gap-2 md:col-span-2 md:justify-end">
                    <Button type="submit" size="lg" className="w-full md:w-auto generate-prompt-button">
                        <Sparkles className="mr-2 h-5 w-5" />
                        Gerar Prompt
                    </Button>
                    <TooltipProvider>
                        <Tooltip>
                        <TooltipTrigger asChild>
                            <button type="button" className="focus:outline-none">
                            <HelpCircle className="h-4 w-4 cursor-help text-muted-foreground" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="max-w-xs">
                                Clique para gerar o prompt final com base nas suas seleções.
                            </p>
                        </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
              </div>

            </form>
          </Form>
        </CardContent>
      </Card>
      
      {output && (
        <Card className="mx-auto mt-8 w-full max-w-7xl shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline text-2xl">
                    Seu Prompt Gerado
                </CardTitle>
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
            </CardHeader>
            <CardContent>
                <pre className="mt-2 w-full overflow-auto rounded-md bg-muted p-4">
                    <code className="text-muted-foreground whitespace-pre-wrap">{output}</code>
                </pre>
            </CardContent>
        </Card>
      )}
    </>
  );
}
