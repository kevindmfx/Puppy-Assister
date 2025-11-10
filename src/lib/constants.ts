export type Option = { value: string; label: string };

export type FormOption = {
    key: string;
    label: string;
    description: string;
    options: Option[];
}

export const INITIAL_PROMPT_OPTIONS: FormOption[] = [
    {
        key: 'aspectRatio',
        label: 'Proporção (Aspect Ratio)',
        description: 'Define a proporção entre a largura e a altura da imagem. "16:9" é uma paisagem, "9:16" é um retrato, "1:1" é um quadrado.',
        options: [
            { value: 'off', label: 'OFF' },
            { value: '1:1', label: '1:1 (Quadrado)' },
            { value: '16:9', label: '16:9 (Paisagem)' },
            { value: '9:16', label: '9:16 (Retrato)' },
            { value: '4:3', label: '4:3 (TV Clássica)' },
            { value: '3:2', label: '3:2 (Fotografia)' },
            { value: '2:1', label: '2:1 (Cinematográfico)' },
        ]
    },
    {
        key: 'chaos',
        label: 'Caos (Chaos)',
        description: 'Controla quão variadas e inesperadas serão as imagens geradas. Valores mais altos criam resultados mais abstratos e surpreendentes.',
        options: [
            { value: 'off', label: 'OFF' },
            { value: '0', label: '0 (Consistente)' },
            { value: '10', label: '10 (Pouco variado)' },
            { value: '25', label: '25 (Variado)' },
            { value: '50', label: '50 (Muito variado)' },
            { value: '100', label: '100 (Abstrato/Aleatório)' },
        ]
    },
    {
        key: 'quality',
        label: 'Qualidade',
        description: 'Ajusta o tempo de renderização e os detalhes da imagem. Valores mais altos levam mais tempo, mas produzem maior qualidade.',
        options: [
            { value: 'off', label: 'OFF' },
            { value: '.25', label: '0.25 (Rápido)' },
            { value: '.5', label: '0.5 (Meia qualidade)' },
            { value: '1', label: '1 (Padrão)' },
        ]
    },
    {
        key: 'style',
        label: 'Estilo',
        description: 'Aplica um estilo visual específico à sua imagem, influenciando a estética geral.',
        options: [
            { value: 'off', label: 'OFF' },
            { value: 'raw', label: 'Raw (Menos estilizado)' },
            { value: '4a', label: 'Estilo 4a (antigo)' },
            { value: '4b', label: 'Estilo 4b (antigo)' },
            { value: '4c', label: 'Estilo 4c (antigo)' },
            { value: 'cute', label: 'Niji-v5 Cute (Fofo)' },
            { value: 'expressive', label: 'Niji-v5 Expressive (Expressivo)' },
            { value: 'scenic', label: 'Niji-v5 Scenic (Cenário)' },
        ]
    },
    {
        key: 'stylize',
        label: 'Estilização (Stylize)',
        description: 'Controla a intensidade da estética padrão do Midjourney. Valores mais baixos respeitam mais o prompt, valores altos são mais "artísticos".',
        options: [
            { value: 'off', label: 'OFF' },
            { value: '0', label: '0 (Desligado)' },
            { value: '50', label: '50 (Baixo)' },
            { value: '100', label: '100 (Padrão)' },
            { value: '250', label: '250 (Alto)' },
            { value: '500', label: '500 (Muito Alto)' },
            { value: '1000', label: '1000 (Máximo)' },
        ]
    },
    {
        key: 'version',
        label: 'Versão do Midjourney',
        description: 'Escolhe qual versão do algoritmo do Midjourney usar. Versões mais novas oferecem mais realismo e coerência.',
        options: [
            { value: 'off', label: 'OFF' },
            { value: '6', label: 'V6 (Mais recente)' },
            { value: '5.2', label: 'V5.2' },
            { value: '5.1', label: 'V5.1' },
            { value: 'niji-v6', label: 'Niji V6 (Anime)' },
            { value: 'niji-v5', label: 'Niji V5 (Anime)' },
        ]
    },
    {
        key: 'camera',
        label: 'Câmera / Lente',
        description: 'Simula diferentes tipos de câmeras, lentes e ângulos de filmagem para dar uma aparência cinematográfica à imagem.',
        options: [
            { value: 'off', label: 'OFF' },
            { value: 'portrait', label: 'Retrato' },
            { value: 'wide angle shot', label: 'Lente Grande Angular' },
            { value: 'macro shot', label: 'Lente Macro' },
            { value: 'telephoto shot', label: 'Lente Teleobjetiva' },
            { value: 'drone shot', label: 'Visão de Drone' },
            { value: 'eye-level shot', label: 'Nível do Olho' },
            { value: 'low-angle shot', label: 'Ângulo Baixo' },
            { value: 'high-angle shot', label: 'Ângulo Alto' },
            { value: 'dutch angle', label: 'Ângulo Holandês' },
        ]
    }
];

export const INITIAL_SCENE_OPTIONS: FormOption[] = [
    {
        key: 'cameraType',
        label: 'Tipo de Câmera',
        description: 'Define o estilo da filmagem. "Cinematic" para um visual de cinema, "Handheld" para uma sensação de câmera na mão.',
        options: [
            { value: 'off', label: 'OFF' },
            { value: 'cinematic', label: 'Cinematic' },
            { value: 'documentary', label: 'Documentary' },
            { value: 'handheld', label: 'Handheld' },
            { value: 'static', label: 'Static' },
        ]
    },
    {
        key: 'lens',
        label: 'Lente',
        description: 'Simula o efeito de diferentes lentes. "Wide" para uma visão ampla, "Macro" para detalhes em close-up.',
        options: [
            { value: 'off', label: 'OFF' },
            { value: 'wide', label: 'Wide Angle' },
            { value: 'telephoto', label: 'Telephoto' },
            { value: 'fisheye', label: 'Fisheye' },
            { value: 'macro', label: 'Macro' },
        ]
    },
    {
        key: 'timeOfDay',
        label: 'Horário do Dia',
        description: 'Define a iluminação e a atmosfera da cena com base no horário. "Golden Hour" para tons quentes, "Blue Hour" para tons frios.',
        options: [
            { value: 'off', label: 'OFF' },
            { value: 'day', label: 'Day' },
            { value: 'night', label: 'Night' },
            { value: 'golden hour', label: 'Golden Hour' },
            { value: 'blue hour', label: 'Blue Hour' },
            { value: 'dawn', label: 'Dawn' },
            { value: 'dusk', label: 'Dusk' },
        ]
    },
    {
        key: 'feeling',
        label: 'Sentimento',
        description: 'Define o tom emocional da cena, influenciando cores e iluminação para transmitir uma sensação específica.',
        options: [
            { value: 'off', label: 'OFF' },
            { value: 'happy', label: 'Happy' },
            { value: 'sad', label: 'Sad' },
            { value: 'tense', label: 'Tense' },
            { value: 'dreamy', label: 'Dreamy' },
            { value: 'energetic', label: 'Energetic' },
            { value: 'nostalgic', label: 'Nostalgic' },
        ]
    },
    {
        key: 'color',
        label: 'Coloração',
        description: 'Controla a paleta de cores da cena. "Vibrant" para cores intensas, "Monochromatic" para tons de uma única cor.',
        options: [
            { value: 'off', label: 'OFF' },
            { value: 'vibrant', label: 'Vibrant' },
            { value: 'monochromatic', label: 'Monochromatic' },
            { value: 'pastel', label: 'Pastel' },
            { value: 'high contrast', label: 'High Contrast' },
            { value: 'low contrast', label: 'Low Contrast' },
        ]
    },
    {
        key: 'sceneQuality',
        label: 'Qualidade da Cena',
        description: 'Define a resolução e a nitidez do vídeo. "4K" para máxima qualidade, "Grainy" para um visual de filme antigo.',
        options: [
            { value: 'off', label: 'OFF' },
            { value: '4K', label: '4K' },
            { value: '1080p', label: '1080p' },
            { value: '720p', label: '720p' },
            { value: 'grainy', label: 'Grainy' },
            { value: 'sharp', label: 'Sharp' },
        ]
    },
    {
        key: 'sceneStyle',
        label: 'Estilo da Cena',
        description: 'Define a estética geral do vídeo. "Realistic" para um visual de vida real, "Animated" para um estilo de animação.',
        options: [
            { value: 'off', label: 'OFF' },
            { value: 'realistic', label: 'Realistic' },
            { value: 'animated', label: 'Animated' },
            { value: 'fantasy', label: 'Fantasy' },
            { value: 'sci-fi', label: 'Sci-Fi' },
            { value: 'vintage', label: 'Vintage' },
        ]
    },
    {
        key: 'framing',
        label: 'Enquadramento',
        description: 'Define o tipo de plano da câmera. "Close-up" para focar em um rosto, "Long Shot" para mostrar o ambiente completo.',
        options: [
            { value: 'off', label: 'OFF' },
            { value: 'close-up', label: 'Close-up' },
            { value: 'medium shot', label: 'Medium Shot' },
            { value: 'long shot', label: 'Long Shot' },
            { value: 'establishing shot', label: 'Establishing Shot' },
            { value: 'point of view', label: 'Point of View (POV)'},
        ]
    },
    {
        key: 'texture',
        label: 'Textura',
        description: 'Controla a aparência das superfícies na cena. "Glossy" para superfícies brilhantes, "Matte" para foscas.',
        options: [
            { value: 'off', label: 'OFF' },
            { value: 'smooth', label: 'Smooth' },
            { value: 'rough', label: 'Rough' },
            { value: 'glossy', label: 'Glossy' },
            { value: 'matte', label: 'Matte' },
        ]
    },
    {
        key: 'cameraMovement',
        label: 'Movimento da Câmera',
        description: 'Adiciona movimento à câmera. "Pan" para mover horizontalmente, "Zoom In" para aproximar.',
        options: [
            { value: 'off', label: 'OFF' },
            { value: 'pan', label: 'Pan' },
            { value: 'tilt', label: 'Tilt' },
            { value: 'dolly', label: 'Dolly' },
            { value: 'zoom in', label: 'Zoom In' },
            { value: 'zoom out', label: 'Zoom Out' },
            { value: 'tracking shot', label: 'Tracking Shot' },
        ]
    },
    {
        key: 'fps',
        label: 'FPS (Quadros por Segundo)',
        description: 'Define a taxa de quadros do vídeo. "24 FPS" para um visual de cinema, "60 FPS" para movimentos mais suaves ou câmera lenta.',
        options: [
            { value: 'off', label: 'OFF' },
            { value: '24', label: '24 FPS (Cinematic)' },
            { value: '30', label: '30 FPS (Standard Video)' },
            { value: '60', label: '60 FPS (Slow Motion/Action)' },
            { value: '120', label: '120 FPS (Super Slow Motion)' },
        ]
    }
];

export const SPECIAL_MIDJOURNEY_KEYS: Record<string, string> = {
    aspectRatio: '--ar',
    chaos: '--c',
    quality: '--q',
    style: '--style',
    stylize: '--s',
    version: '--v',
};
