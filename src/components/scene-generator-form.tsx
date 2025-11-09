"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SceneFormOptionKey, SCENE_FORM_OPTIONS } from "@/lib/constants";
import { Clipboard, ClipboardCheck, Sparkles, PlusCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const sceneSchema = z.object({
  prompt: z.string().min(1, "O prompt da cena é obrigatório."),
  cameraType: z.string().optional(),
  lens: z.string().optional(),
  timeOfDay: z.string().optional(),
  feeling: z.string().optional(),
  color: z.string().optional(),
  sceneQuality: z.string().optional(),
  sceneStyle: z.string().optional(),
  framing: z.string().optional(),
  texture: z.string().optional(),
  cameraMovement: z.string().optional(),
  fps: z.string().optional(),
});

const formSchema = z.object({
  scenes: z.array(sceneSchema).max(8, "Você pode adicionar no máximo 8 cenas."),
});

type FormValues = z.infer<typeof formSchema>;
type SelectFieldNames = keyof Omit<z.infer<typeof sceneSchema>, 'prompt'>;

const SceneSelectField = ({
  control,
  name,
  label,
  placeholder,
  optionsKey,
}: {
  control: any;
  name: string;
  label: string;
  placeholder: string;
  optionsKey: SceneFormOptionKey;
}) => {
  const options = SCENE_FORM_OPTIONS[optionsKey];
  if (!options) return null;

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
};

export function SceneGeneratorForm() {
  const { toast } = useToast();
  const [output, setOutput] = useState("");
  const [hasCopied, setHasCopied] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scenes: [{ prompt: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "scenes",
  });

  const isNotApplicable = (value: string | undefined) => !value || value === 'off';

  const generateJsonOutput = (values: FormValues) => {
    const scenesData = values.scenes.map(scene => {
      const { prompt, ...rest } = scene;
      const parameters: Record<string, string> = {};
      
      const paramKeys = Object.keys(rest) as (keyof typeof rest)[];

      paramKeys.forEach(key => {
          const value = rest[key];
          if (!isNotApplicable(value)) {
              parameters[key] = value!;
          }
      });

      return {
          prompt,
          parameters,
      };
    });
    
    return JSON.stringify({ scenes: scenesData }, null, 2);
  };

  function onSubmit(values: FormValues) {
    const generatedOutput = generateJsonOutput(values);
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

  const addScene = () => {
    if (fields.length < 8) {
      append({ prompt: "" });
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
      <Card className="mx-auto w-full max-w-7xl shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-primary" />
            Crie sua Sequência
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Accordion type="multiple" defaultValue={['scene-0']} className="w-full space-y-4">
                {fields.map((field, index) => (
                  <AccordionItem key={field.id} value={`scene-${index}`} className="rounded-lg border bg-card px-4 shadow-sm">
                    <div className="flex items-center">
                        <AccordionTrigger className="flex-1 text-lg font-medium">
                            Cena {index + 1}
                        </AccordionTrigger>
                        {fields.length > 1 && (
                            <Button variant="ghost" size="icon" onClick={() => remove(index)}>
                                <Trash2 className="h-5 w-5 text-destructive" />
                            </Button>
                        )}
                    </div>
                    <AccordionContent className="pt-4">
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name={`scenes.${index}.prompt`}
                          render={({ field: formField }) => (
                            <FormItem>
                              <FormLabel className="text-base">Prompt da Cena</FormLabel>
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
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            <SceneSelectField control={form.control} name={`scenes.${index}.cameraType`} label="Tipo de Câmera" placeholder="OFF" optionsKey="cameraType" />
                            <SceneSelectField control={form.control} name={`scenes.${index}.lens`} label="Lente" placeholder="OFF" optionsKey="lens" />
                            <SceneSelectField control={form.control} name={`scenes.${index}.timeOfDay`} label="Horário do Dia" placeholder="OFF" optionsKey="timeOfDay" />
                            <SceneSelectField control={form.control} name={`scenes.${index}.feeling`} label="Sentimento" placeholder="OFF" optionsKey="feeling" />
                            <SceneSelectField control={form.control} name={`scenes.${index}.color`} label="Coloração" placeholder="OFF" optionsKey="color" />
                            <SceneSelectField control={form.control} name={`scenes.${index}.sceneQuality`} label="Qualidade" placeholder="OFF" optionsKey="sceneQuality" />
                            <SceneSelectField control={form.control} name={`scenes.${index}.sceneStyle`} label="Estilo" placeholder="OFF" optionsKey="sceneStyle" />
                            <SceneSelectField control={form.control} name={`scenes.${index}.framing`} label="Enquadramento" placeholder="OFF" optionsKey="framing" />
                            <SceneSelectField control={form.control} name={`scenes.${index}.texture`} label="Textura" placeholder="OFF" optionsKey="texture" />
                            <SceneSelectField control={form.control} name={`scenes.${index}.cameraMovement`} label="Movimento da Câmera" placeholder="OFF" optionsKey="cameraMovement" />
                            <SceneSelectField control={form.control} name={`scenes.${index}.fps`} label="FPS" placeholder="OFF" optionsKey="fps" />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              <div className="flex justify-between items-center pt-4">
                <Button type="button" variant="outline" onClick={addScene}>
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Adicionar Cena
                </Button>
                <Button type="submit" size="lg">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Gerar JSON das Cenas
                </Button>
              </div>

            </form>
          </Form>
        </CardContent>
      </Card>
      
      {output && (
        <Card className="mx-auto mt-8 w-full max-w-7xl shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline text-2xl">
                    Seu JSON Gerado
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
