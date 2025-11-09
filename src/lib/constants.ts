export const FORM_OPTIONS = {
  environment: [
    { value: 'indoor', label: 'Interno' },
    { value: 'outdoor', label: 'Externo' },
    { value: 'urban', label: 'Urbano' },
    { value: 'natural', label: 'Natural' },
    { value: 'sci-fi', label: 'Ficção Científica' },
    { value: 'fantasy', label: 'Fantasia' },
  ],
  lighting: [
    { value: 'warm', label: 'Quente' },
    { value: 'cold', label: 'Fria' },
    { value: 'studio', label: 'Estúdio' },
    { value: 'natural', label: 'Natural' },
    { value: 'dramatic', label: 'Dramática' },
    { value: 'backlit', label: 'Contraluz' },
  ],
  subject: [
    { value: 'person', label: 'Pessoa' },
    { value: 'landscape', label: 'Paisagem' },
    { value: 'vehicle', label: 'Veículo' },
    { value: 'animal', label: 'Animal' },
    { value: 'object', label: 'Objeto' },
    { value: 'abstract', label: 'Abstrato' },
  ],
  mood: [
    { value: 'calm', label: 'Calmo' },
    { value: 'energetic', label: 'Energético' },
    { value: 'mysterious', label: 'Misterioso' },
    { value: 'joyful', label: 'Alegre' },
    { value: 'melancholy', label: 'Melancólico' },
    { value: 'tense', label: 'Tenso' },
  ],
  imageSize: [
    { value: '1024x1024', label: '1024x1024 (Quadrado)' },
    { value: '1792x1024', label: '1792x1024 (Paisagem)' },
    { value: '1024x1792', label: '1024x1792 (Retrato)' },
  ],
  texture: [
    { value: 'low', label: 'Baixo Detalhe' },
    { value: 'medium', label: 'Detalhe Médio' },
    { value: 'high', label: 'Alto Detalhe' },
    { value: 'hyper_detailed', label: 'Hiper-detalhado' },
  ],
  cameraAngle: [
    { value: 'eye_level', label: 'Nível do Olho' },
    { value: 'low_angle', label: 'Ângulo Baixo' },
    { value: 'high_angle', label: 'Ângulo Alto' },
    { value: 'dutch_angle', label: 'Ângulo Holandês' },
    { value: "bird's_eye_view", label: 'Visão de Pássaro' },
  ],
};

export type FormOptionKey = keyof typeof FORM_OPTIONS;
