export const FORM_OPTIONS = {
  environment: [
    { value: 'indoor', label: 'Indoor' },
    { value: 'outdoor', label: 'Outdoor' },
    { value: 'urban', label: 'Urban' },
    { value: 'natural', label: 'Natural' },
    { value: 'sci-fi', label: 'Sci-Fi' },
    { value: 'fantasy', label: 'Fantasy' },
  ],
  lighting: [
    { value: 'warm', label: 'Warm' },
    { value: 'cold', label: 'Cold' },
    { value: 'studio', label: 'Studio' },
    { value: 'natural', label: 'Natural' },
    { value: 'dramatic', label: 'Dramatic' },
    { value: 'backlit', label: 'Backlit' },
  ],
  subject: [
    { value: 'person', label: 'Person' },
    { value: 'landscape', label: 'Landscape' },
    { value: 'vehicle', label: 'Vehicle' },
    { value: 'animal', label: 'Animal' },
    { value: 'object', label: 'Object' },
    { value: 'abstract', label: 'Abstract' },
  ],
  mood: [
    { value: 'calm', label: 'Calm' },
    { value: 'energetic', label: 'Energetic' },
    { value: 'mysterious', label: 'Mysterious' },
    { value: 'joyful', label: 'Joyful' },
    { value: 'melancholy', label: 'Melancholy' },
    { value: 'tense', label: 'Tense' },
  ],
  imageSize: [
    { value: '1024x1024', label: '1024x1024 (Square)' },
    { value: '1792x1024', label: '1792x1024 (Landscape)' },
    { value: '1024x1792', label: '1024x1792 (Portrait)' },
  ],
  texture: [
    { value: 'low', label: 'Low Detail' },
    { value: 'medium', label: 'Medium Detail' },
    { value: 'high', label: 'High Detail' },
    { value: 'hyper_detailed', label: 'Hyper-detailed' },
  ],
  cameraAngle: [
    { value: 'eye_level', label: 'Eye-level' },
    { value: 'low_angle', label: 'Low-angle' },
    { value: 'high_angle', label: 'High-angle' },
    { value: 'dutch_angle', label: 'Dutch Angle' },
    { value: "bird's_eye_view", label: "Bird's-eye View" },
  ],
};

export type FormOptionKey = keyof typeof FORM_OPTIONS;
