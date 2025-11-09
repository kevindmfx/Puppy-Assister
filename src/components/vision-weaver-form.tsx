"use client";

import { useState } from "react";
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
import { FormOptionKey } from "@/lib/constants";
import { Clipboard, ClipboardCheck, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useOptions } from "@/context/options-context";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

const formSchema = z.object({
  basePrompt: z.string().min(1, "Por favor, insira um prompt base."),
  aspectRatio: z.string().optional(),
  chaos: z.string().optional(),
  quality: z.string().optional(),
  style: z.string().optional(),
  stylize: z.string().optional(),
  version: z.string().optional(),
  camera: z.string().optional(),
  outputType: z.enum(['midjourney', 'json']).default('midjourney'),
});

type FormValues = z.infer<typeof formSchema>;
type SelectFieldNames = 'aspectRatio' | 'chaos' | 'quality' | 'style' | 'stylize' | 'version' | 'camera';

const MidjourneySelectField = ({
  control,
  name,
  label,
  placeholder,
  optionsKey,
}: {
  control: any;
  name: SelectFieldNames;
  label: string;
  placeholder: string;
  optionsKey: FormOptionKey;
}) => {
  const { options } = useOptions();
  const selectOptions = options[optionsKey];

  if (!selectOptions) return null;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {selectOptions.map((option) => (
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
};

export function VisionWeaverForm() {
  const { toast } = useToast();
  const [output, setOutput] = useState("");
  const [hasCopied, setHasCopied] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      basePrompt: "",
      aspectRatio: "off",
      chaos: "off",
      quality: "off",
      style: "off",
      stylize: "off",
      version: "off",
      camera: "off",
      outputType: "midjourney",
    },
  });

  const isNotApplicable = (value: string | undefined) => !value || value === 'off';

  const generateMidjourneyPrompt = (values: FormValues) => {
    let prompt = values.basePrompt;
    if (!isNotApplicable(values.camera)) {
        prompt += `, ${values.camera}`;
    }
    if (!isNotApplicable(values.aspectRatio)) {
      prompt += ` --ar ${values.aspectRatio}`;
    }
    if (!isNotApplicable(values.chaos)) {
      prompt += ` --c ${values.chaos}`;
    }
    if (!isNotApplicable(values.quality)) {
      prompt += ` --q ${values.quality}`;
    }
    if (!isNotApplicable(values.style)) {
        prompt += ` --style ${values.style}`;
    }
    if (!isNotApplicable(values.stylize)) {
      prompt += ` --s ${values.stylize}`;
    }
    if (!isNotApplicable(values.version)) {
      prompt += ` --v ${values.version}`;
    }
    return prompt.trim();
  };
  
  const generateJsonOutput = (values: FormValues) => {
    const { basePrompt, outputType, ...rest } = values;
    const parameters: Record<string, string> = {};
    
    // Explicitly type the keys to match the form values
    const paramKeys: (keyof typeof rest)[] = ['aspectRatio', 'chaos', 'quality', 'style', 'stylize', 'version', 'camera'];

    paramKeys.forEach(key => {
        const value = rest[key];
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
    if (values.outputType === 'midjourney') {
        generatedOutput = generateMidjourneyPrompt(values);
    } else {
        generatedOutput = generateJsonOutput(values);
    }
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
      <Card className="mx-auto w-full max-w-7xl shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2 text-2xl">
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
                    <FormItem>
                    <FormLabel className="text-lg">Prompt Base</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="Ex: um astronauta surfando em uma onda cósmica"
                        className="min-h-[100px] resize-none"
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

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <MidjourneySelectField control={form.control} name="version" label="Versão do Midjourney" placeholder="OFF" optionsKey="version" />
                <MidjourneySelectField control={form.control} name="aspectRatio" label="Proporção (Aspect Ratio)" placeholder="OFF" optionsKey="aspectRatio" />
                <MidjourneySelectField control={form.control} name="quality" label="Qualidade" placeholder="OFF" optionsKey="quality" />
                <MidjourneySelectField control={form.control} name="chaos" label="Caos (Chaos)" placeholder="OFF" optionsKey="chaos" />
                <MidjourneySelectField control={form.control} name="stylize" label="Estilização (Stylize)" placeholder="OFF" optionsKey="stylize" />
                <MidjourneySelectField control={form.control} name="style" label="Estilo" placeholder="OFF" optionsKey="style" />
                <MidjourneySelectField control={form.control} name="camera" label="Câmera / Lente" placeholder="OFF" optionsKey="camera" />
              </div>

              <div className="grid grid-cols-1 items-start gap-8 pt-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="outputType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Formato de Saída</FormLabel>
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
                <div className="flex justify-center md:col-span-2 md:justify-end">
                    <Button type="submit" size="lg" className="w-full md:w-auto">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Gerar Prompt
                    </Button>
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
