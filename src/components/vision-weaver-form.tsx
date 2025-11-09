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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { FormOptionKey } from "@/lib/constants";
import { Clipboard, ClipboardCheck, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useOptions } from "@/context/options-context";

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
}) => {
  const { options } = useOptions();
  const selectOptions = options[optionsKey];

  return (
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
};

export function VisionWeaverForm() {
  const { toast } = useToast();
  const { options } = useOptions();
  const [jsonOutput, setJsonOutput] = useState("");
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

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
    setJsonOutput(JSON.stringify(promptData, null, 2));
    setIsJsonModalOpen(true);
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonOutput).then(() => {
      setHasCopied(true);
      toast({
        title: "Copiado!",
        description: "O prompt JSON foi copiado para a área de transferência.",
      });
      setTimeout(() => setHasCopied(false), 2000);
    });
  };

  return (
    <>
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
                  <Sparkles className="mr-2 h-5 w-5" />
                  Gerar JSON
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Dialog open={isJsonModalOpen} onOpenChange={setIsJsonModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Seu Prompt JSON Gerado</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <pre className="mt-2 h-[450px] w-full overflow-auto rounded-md bg-muted p-4">
              <code className="text-muted-foreground">{jsonOutput}</code>
            </pre>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-2"
              onClick={handleCopy}
            >
              {hasCopied ? (
                <ClipboardCheck className="h-5 w-5 text-green-500" />
              ) : (
                <Clipboard className="h-5 w-5" />
              )}
            </Button>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Fechar
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
