"use client";

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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FORM_OPTIONS, FormOptionKey } from "@/lib/constants";
import { Download, Sparkles } from "lucide-react";
import { downloadJson } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  basePrompt: z.string().min(1, "Por favor, insira um prompt base."),
  environment: z.string().optional(),
  environment_extra: z.string().optional(),
  lighting: z.string().optional(),
  lighting_extra: z.string().optional(),
  subject: z.string().optional(),
  subject_extra: z.string().optional(),
  mood: z.string().optional(),
  mood_extra: z.string().optional(),
  imageSize: z.string().optional(),
  imageSize_extra: z.string().optional(),
  texture: z.string().optional(),
  texture_extra: z.string().optional(),
  cameraAngle: z.string().optional(),
  cameraAngle_extra: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const SelectField = ({
  control,
  name,
  label,
  placeholder,
  optionsKey,
}: {
  control: any;
  name: keyof FormValues;
  label: string;
  placeholder: string;
  optionsKey: FormOptionKey;
}) => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
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
              {FORM_OPTIONS[optionsKey].map((option) => (
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
    <FormField
      control={control}
      name={`${name}_extra` as keyof FormValues}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Detalhes Extras para {label}</FormLabel>
          <FormControl>
            <Input placeholder={`ex: "com ruínas antigas"`} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
);

export function VisionWeaverForm() {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      basePrompt: "",
      environment: "",
      environment_extra: "",
      lighting: "",
      lighting_extra: "",
      subject: "",
      subject_extra: "",
      mood: "",
      mood_extra: "",
      imageSize: "1024x1024",
      imageSize_extra: "",
      texture: "",
      texture_extra: "",
      cameraAngle: "",
      cameraAngle_extra: "",
    },
  });

  function onSubmit(values: FormValues) {
    const promptData = Object.fromEntries(
      Object.entries(values).filter(
        ([, value]) => value !== "" && value !== undefined
      )
    );

    downloadJson(promptData, "prompt-tecelao-de-visao.json");

    toast({
      title: "JSON Gerado!",
      description: "Seu arquivo de prompt foi baixado com sucesso.",
    });
  }

  return (
    <Card className="mx-auto w-full max-w-4xl shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2 text-2xl">
          <Sparkles className="h-6 w-6 text-primary" />
          Crie seu Prompt de Imagem
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
                      placeholder="Descreva o conceito principal da sua imagem..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Esta é a base da sua imagem. Seja descritivo!
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SelectField
              control={form.control}
              name="environment"
              label="Ambiente"
              placeholder="Selecione um ambiente"
              optionsKey="environment"
            />
            <SelectField
              control={form.control}
              name="lighting"
              label="Iluminação"
              placeholder="Selecione um estilo de iluminação"
              optionsKey="lighting"
            />
            <SelectField
              control={form.control}
              name="subject"
              label="Assunto Principal"
              placeholder="Selecione um assunto principal"
              optionsKey="subject"
            />
            <SelectField
              control={form.control}
              name="mood"
              label="Humor"
              placeholder="Selecione um humor ou sentimento"
              optionsKey="mood"
            />
            <SelectField
              control={form.control}
              name="imageSize"
              label="Tamanho da Imagem"
              placeholder="Selecione as dimensões da imagem"
              optionsKey="imageSize"
            />
            <SelectField
              control={form.control}
              name="texture"
              label="Textura / Nível de Detalhe"
              placeholder="Selecione o nível de detalhe"
              optionsKey="texture"
            />
            <SelectField
              control={form.control}
              name="cameraAngle"
              label="Ângulo da Câmera"
              placeholder="Selecione um ângulo de câmera"
              optionsKey="cameraAngle"
            />

            <div className="flex justify-end">
              <Button type="submit" size="lg">
                <Download className="mr-2 h-5 w-5" />
                Gerar e Baixar JSON
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
